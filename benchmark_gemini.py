import os
import json
import requests
import time
import random
import tempfile
import shutil

# Конфигурация через переменные окружения для воспроизводимости и безопасности.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
API_VERSION = os.getenv("GEMINI_API_VERSION", "v1beta")
REQUEST_TIMEOUT_SEC = float(os.getenv("GEMINI_TIMEOUT_SEC", "45"))
REQUEST_DELAY_SEC = float(os.getenv("GEMINI_REQUEST_DELAY_SEC", "8"))
MAX_RETRIES = int(os.getenv("GEMINI_MAX_RETRIES", "2"))
BASE_BACKOFF_SEC = float(os.getenv("GEMINI_BASE_BACKOFF_SEC", "2"))
MAX_BACKOFF_SEC = float(os.getenv("GEMINI_MAX_BACKOFF_SEC", "60"))
RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}


def _build_url():
    return (
        f"https://generativelanguage.googleapis.com/{API_VERSION}/models/"
        f"{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"
    )


def _compute_backoff(attempt):
    exp = min(MAX_BACKOFF_SEC, BASE_BACKOFF_SEC * (2 ** (attempt - 1)))
    return exp + random.uniform(0, 1)


RESULTS_JSONL = "gemini_benchmark_results.jsonl"
RESULTS_JSON = "gemini_benchmark_results.json"


def _atomic_write_json_from_list(list_obj, dest_path):
    # Write JSON array atomically using a temp file and os.replace
    dir_name = os.path.dirname(dest_path) or "."
    fd, tmp = tempfile.mkstemp(dir=dir_name, prefix=os.path.basename(dest_path))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(list_obj, f, indent=4, ensure_ascii=False)
        os.replace(tmp, dest_path)
    finally:
        if os.path.exists(tmp):
            try:
                os.remove(tmp)
            except Exception:
                pass


def _extract_json_payload(result_text):
    result_text = result_text.strip()
    try:
        return json.loads(result_text)
    except json.JSONDecodeError:
        left = result_text.find("{")
        right = result_text.rfind("}")
        if left != -1 and right != -1 and right > left:
            return json.loads(result_text[left : right + 1])
        raise

PROMPT_TEMPLATE = """You are an expert Static Application Security Testing (SAST) agent.
Analyze the following React component code for vulnerabilities, specifically focusing on:
1. DOM-based XSS (e.g., unsafe dangerouslySetInnerHTML, unvalidated URL params).
2. Insecure Client-Side Storage (e.g., sensitive tokens in localStorage, unencrypted sessionStorage).
Note: Distinguish between sensitive data (PII/Tokens) and benign UI state. React's native JSX {} binding is safe from XSS.

Code to analyze:
```jsx
{CODE_PLACEHOLDER}
```
Respond STRICTLY with a JSON object in the following format, and nothing else:
{{
"is_vulnerable": true or false,
"vulnerability_type": "Brief description or null if safe",
"reasoning": "1 sentence explaining why"
}}
"""


def evaluate_code_gemini(code_content):
    payload = {
        "contents": [{
            "parts": [{"text": PROMPT_TEMPLATE.replace("{CODE_PLACEHOLDER}", code_content)}]
        }],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json"  # Заставляем Gemini вернуть чистый JSON
        }
    }

    url = _build_url()
    last_error = None

    for attempt in range(1, MAX_RETRIES + 2):
        response = None
        try:
            response = requests.post(url, json=payload, timeout=REQUEST_TIMEOUT_SEC)
            response.raise_for_status()
            result_text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
            parsed = _extract_json_payload(result_text)
            parsed["_attempts"] = attempt
            return parsed
        except requests.HTTPError as e:
            status_code = response.status_code if response is not None else None
            last_error = e

            # Если получили 429, попробим уважать Retry-After заголовок (если есть),
            # иначе используем экспоненциальный backoff с джиттером.
            if status_code == 429:
                retry_after = None
                try:
                    retry_after = response.headers.get("Retry-After") if response is not None else None
                except Exception:
                    retry_after = None

                if retry_after:
                    try:
                        wait_s = int(float(retry_after))
                    except Exception:
                        try:
                            wait_s = int(retry_after)
                        except Exception:
                            wait_s = _compute_backoff(attempt)
                else:
                    wait_s = _compute_backoff(attempt)

                if attempt <= MAX_RETRIES:
                    print(
                        f"Ошибка API: HTTP {status_code}. Уважение Retry-After / backoff: ждем {wait_s:.1f}s (попытка {attempt}/{MAX_RETRIES})"
                    )
                    time.sleep(wait_s)
                    continue

            if status_code in RETRYABLE_STATUS_CODES and attempt <= MAX_RETRIES:
                wait_s = _compute_backoff(attempt)
                print(
                    f"Ошибка API: HTTP {status_code}. Ретрай {attempt}/{MAX_RETRIES}, ждем {wait_s:.1f}s..."
                )
                time.sleep(wait_s)
                continue

            return {
                "is_vulnerable": None,
                "vulnerability_type": "Error",
                "reasoning": f"HTTP {status_code}: {e}",
                "_attempts": attempt,
            }
        except (requests.RequestException, KeyError, IndexError, json.JSONDecodeError) as e:
            last_error = e
            if attempt <= MAX_RETRIES:
                wait_s = _compute_backoff(attempt)
                print(
                    f"Ошибка API/парсинга: {e}. "
                    f"Ретрай {attempt}/{MAX_RETRIES}, ждем {wait_s:.1f}s..."
                )
                time.sleep(wait_s)
                continue

            return {
                "is_vulnerable": None,
                "vulnerability_type": "Error",
                "reasoning": str(e),
                "_attempts": attempt,
            }

    return {
        "is_vulnerable": None,
        "vulnerability_type": "Error",
        "reasoning": str(last_error) if last_error else "Unknown error",
        "_attempts": MAX_RETRIES + 1,
    }


def run_benchmark():
    if not GEMINI_API_KEY:
        raise RuntimeError(
            "Не задан GEMINI_API_KEY. Установите переменную окружения перед запуском."
        )

    print(f"🚀 Запуск бенчмарка на модели: {MODEL_NAME}...\n")

    metrics = {"TP": 0, "FP": 0, "TN": 0, "FN": 0, "Errors": 0}
    results_log = []

    def _append_result_and_persist(result_obj):
        # Append single JSON line to JSONL and atomically rebuild JSON file
        try:
            with open(RESULTS_JSONL, "a", encoding="utf-8") as jf:
                jf.write(json.dumps(result_obj, ensure_ascii=False) + "\n")
        except Exception as e:
            print(f"Не удалось записать в {RESULTS_JSONL}: {e}")

        # Rebuild JSON array atomically from JSONL
        try:
            all_objs = []
            with open(RESULTS_JSONL, "r", encoding="utf-8") as jf:
                for line in jf:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        all_objs.append(json.loads(line))
                    except Exception:
                        # Игнорируем битые строки, но сообщаем
                        print("Предупреждение: Не удалось распарсить строку в JSONL при обновлении JSON")
            _atomic_write_json_from_list(all_objs, RESULTS_JSON)
        except FileNotFoundError:
            # Если JSONL удалён между операциями — пропускаем
            pass
        except Exception as e:
            print(f"Ошибка при обновлении {RESULTS_JSON}: {e}")

    # Load existing results (resume support)
    processed_files = set()
    if os.path.exists(RESULTS_JSONL):
        try:
            with open(RESULTS_JSONL, "r", encoding="utf-8") as jf:
                for line in jf:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        obj = json.loads(line)
                        results_log.append(obj)
                        if "file" in obj:
                            processed_files.add((obj.get("true_label"), obj["file"]))
                    except Exception:
                        # Пропустить некорректную строку
                        continue
            print(f"Загружено {len(results_log)} записей из {RESULTS_JSONL} (resume)")
        except Exception as e:
            print(f"Не удалось прочитать {RESULTS_JSONL}: {e}")
    elif os.path.exists(RESULTS_JSON):
        try:
            with open(RESULTS_JSON, "r", encoding="utf-8") as jf:
                arr = json.load(jf)
                for obj in arr:
                    results_log.append(obj)
                    if "file" in obj:
                        processed_files.add((obj.get("true_label"), obj["file"]))
            print(f"Загружено {len(results_log)} записей из {RESULTS_JSON} (resume)")
        except Exception as e:
            print(f"Не удалось прочитать {RESULTS_JSON}: {e}")

    print("--- 🔴 Тестирование Vulnerable компонентов ---")
    for filename in os.listdir('dataset/vulnerable'):
        if not filename.endswith('.jsx'):
            continue

        if (True, filename) in processed_files:
            print(f"Пропущен {filename} (уже обработан)")
            continue

        with open(f'dataset/vulnerable/{filename}', 'r', encoding='utf-8') as f:
            code = f.read()

        print(f"Анализ {filename}...", end=" ")
        start_time = time.time()
        prediction = evaluate_code_gemini(code)
        latency = time.time() - start_time
        attempts = prediction.get("_attempts", 1)

        if prediction.get("is_vulnerable") is True:
            metrics["TP"] += 1
            print(f"✅ Уязвимость найдена ({latency:.1f}s)")
        elif prediction.get("is_vulnerable") is False:
            metrics["FN"] += 1
            print(f"❌ Пропуск (False Negative) ({latency:.1f}s)")
        else:
            metrics["Errors"] += 1
            print(f"⚠️ Ошибка парсинга (попыток: {attempts})")

        res_obj = {
            "file": filename,
            "true_label": True,
            "latency_sec": round(latency, 2),
            "attempts": attempts,
            "prediction": prediction,
        }
        results_log.append(res_obj)
        _append_result_and_persist(res_obj)
        time.sleep(REQUEST_DELAY_SEC)

    print("\n--- 🟢 Тестирование Patched компонентов ---")
    for filename in os.listdir('dataset/patched'):
        if not filename.endswith('.jsx'):
            continue

        if (False, filename) in processed_files:
            print(f"Пропущен {filename} (уже обработан)")
            continue

        with open(f'dataset/patched/{filename}', 'r', encoding='utf-8') as f:
            code = f.read()

        print(f"Анализ {filename}...", end=" ")
        start_time = time.time()
        prediction = evaluate_code_gemini(code)
        latency = time.time() - start_time
        attempts = prediction.get("_attempts", 1)

        if prediction.get("is_vulnerable") is False:
            metrics["TN"] += 1
            print(f"✅ Корректно признан безопасным ({latency:.1f}s)")
        elif prediction.get("is_vulnerable") is True:
            metrics["FP"] += 1
            print(f"❌ Ложное срабатывание (False Positive) ({latency:.1f}s)")
        else:
            metrics["Errors"] += 1
            print(f"⚠️ Ошибка парсинга (попыток: {attempts})")

        res_obj = {
            "file": filename,
            "true_label": False,
            "latency_sec": round(latency, 2),
            "attempts": attempts,
            "prediction": prediction,
        }
        results_log.append(res_obj)
        _append_result_and_persist(res_obj)
        time.sleep(REQUEST_DELAY_SEC)

    # Пересчитать метрики из накопленного results_log (учитывает resume)
    metrics = {"TP": 0, "FP": 0, "TN": 0, "FN": 0, "Errors": 0}
    for obj in results_log:
        true_label = obj.get("true_label")
        pred = obj.get("prediction", {})
        is_vuln = pred.get("is_vulnerable")
        if is_vuln is True and true_label is True:
            metrics["TP"] += 1
        elif is_vuln is False and true_label is True:
            metrics["FN"] += 1
        elif is_vuln is False and true_label is False:
            metrics["TN"] += 1
        elif is_vuln is True and true_label is False:
            metrics["FP"] += 1
        else:
            metrics["Errors"] += 1

    total = metrics["TP"] + metrics["TN"] + metrics["FP"] + metrics["FN"]
    accuracy = (metrics["TP"] + metrics["TN"]) / total if total > 0 else 0
    fpr = metrics["FP"] / (metrics["FP"] + metrics["TN"]) if (metrics["FP"] + metrics["TN"]) > 0 else 0
    fnr = metrics["FN"] / (metrics["FN"] + metrics["TP"]) if (metrics["FN"] + metrics["TP"]) > 0 else 0
    total_samples = total + metrics["Errors"]
    coverage = total / total_samples if total_samples > 0 else 0
    effective_accuracy = (metrics["TP"] + metrics["TN"]) / total_samples if total_samples > 0 else 0

    print("\n" + "=" * 40)
    print("📊 ИТОГОВЫЕ МЕТРИКИ GEMINI ДЛЯ СТАТЬИ:")
    print("=" * 40)
    print(f"Accuracy (Точность):        {accuracy * 100:.1f}%")
    print(f"Coverage (Без ошибок API):  {coverage * 100:.1f}%")
    print(f"Effective Accuracy (all):   {effective_accuracy * 100:.1f}%")
    print(f"False Positive Rate (FPR):  {fpr * 100:.1f}% (Ложные тревоги)")
    print(f"False Negative Rate (FNR):  {fnr * 100:.1f}% (Пропущенные уязвимости)")
    print(f"Errors (API/JSON):          {metrics['Errors']}")

    # Results are written incrementally to JSONL and atomically mirrored to JSON during the run.
    print(f"\nПодробный лог сохранен в '{RESULTS_JSON}' и '{RESULTS_JSONL}' (incremental)")


if __name__ == "__main__":
    run_benchmark()