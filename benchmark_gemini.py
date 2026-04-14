import os
import json
import requests
import time

# Вставьте ваш ключ от Google AI Studio
GEMINI_API_KEY = "AIzaSyAujnfg_9E6TRVrt3M9mEoSuQNvkGWUJQo"
# Используем самую быструю и актуальную модель
MODEL_NAME = "gemini-2.5-flash" 
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"

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

    response = None
    try:
        response = requests.post(URL, json=payload)
        response.raise_for_status()

        # Парсим ответ от Gemini
        result_text = response.json()['candidates'][0]['content']['parts'][0]['text']
        return json.loads(result_text)
    except Exception as e:
        print(f"Ошибка API: {e}")
        # Защита от лимитов (Rate Limits) бесплатного API
        if response is not None and response.status_code == 429:
            print("Превышен лимит запросов. Ждем 10 секунд...")
            time.sleep(10)
            return evaluate_code_gemini(code_content)

        return {"is_vulnerable": None, "vulnerability_type": "Error", "reasoning": str(e)}


def run_benchmark():
    print(f"🚀 Запуск бенчмарка на модели: {MODEL_NAME}...\n")

    metrics = {"TP": 0, "FP": 0, "TN": 0, "FN": 0, "Errors": 0}
    results_log = []

    print("--- 🔴 Тестирование Vulnerable компонентов ---")
    for filename in os.listdir('dataset/vulnerable'):
        if not filename.endswith('.jsx'):
            continue

        with open(f'dataset/vulnerable/{filename}', 'r', encoding='utf-8') as f:
            code = f.read()

        print(f"Анализ {filename}...", end=" ")
        start_time = time.time()
        prediction = evaluate_code_gemini(code)
        latency = time.time() - start_time

        if prediction.get("is_vulnerable") is True:
            metrics["TP"] += 1
            print(f"✅ Уязвимость найдена ({latency:.1f}s)")
        elif prediction.get("is_vulnerable") is False:
            metrics["FN"] += 1
            print(f"❌ Пропуск (False Negative) ({latency:.1f}s)")
        else:
            metrics["Errors"] += 1
            print("⚠️ Ошибка парсинга")

        results_log.append({"file": filename, "true_label": True, "prediction": prediction})
        time.sleep(2)  # Небольшая пауза, чтобы не спамить бесплатный API

    print("\n--- 🟢 Тестирование Patched компонентов ---")
    for filename in os.listdir('dataset/patched'):
        if not filename.endswith('.jsx'):
            continue

        with open(f'dataset/patched/{filename}', 'r', encoding='utf-8') as f:
            code = f.read()

        print(f"Анализ {filename}...", end=" ")
        start_time = time.time()
        prediction = evaluate_code_gemini(code)
        latency = time.time() - start_time

        if prediction.get("is_vulnerable") is False:
            metrics["TN"] += 1
            print(f"✅ Корректно признан безопасным ({latency:.1f}s)")
        elif prediction.get("is_vulnerable") is True:
            metrics["FP"] += 1
            print(f"❌ Ложное срабатывание (False Positive) ({latency:.1f}s)")
        else:
            metrics["Errors"] += 1
            print("⚠️ Ошибка парсинга")

        results_log.append({"file": filename, "true_label": False, "prediction": prediction})
        time.sleep(2)  # Пауза для стабильности API

    total = metrics["TP"] + metrics["TN"] + metrics["FP"] + metrics["FN"]
    accuracy = (metrics["TP"] + metrics["TN"]) / total if total > 0 else 0
    fpr = metrics["FP"] / (metrics["FP"] + metrics["TN"]) if (metrics["FP"] + metrics["TN"]) > 0 else 0
    fnr = metrics["FN"] / (metrics["FN"] + metrics["TP"]) if (metrics["FN"] + metrics["TP"]) > 0 else 0

    print("\n" + "=" * 40)
    print("📊 ИТОГОВЫЕ МЕТРИКИ GEMINI ДЛЯ СТАТЬИ:")
    print("=" * 40)
    print(f"Accuracy (Точность):        {accuracy * 100:.1f}%")
    print(f"False Positive Rate (FPR):  {fpr * 100:.1f}% (Ложные тревоги)")
    print(f"False Negative Rate (FNR):  {fnr * 100:.1f}% (Пропущенные уязвимости)")

    with open('gemini_benchmark_results.json', 'w', encoding='utf-8') as f:
        json.dump(results_log, f, indent=4, ensure_ascii=False)
    print("\nПодробный лог сохранен в 'gemini_benchmark_results.json'")


if __name__ == "__main__":
    run_benchmark()