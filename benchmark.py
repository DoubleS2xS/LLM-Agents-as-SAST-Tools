import os
import json
import requests
import time

# Настройки Ollama
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3" # Если скачали другую, поменяйте здесь (например, "qwen2.5-coder")

PROMPT_TEMPLATE = """You are an expert Static Application Security Testing (SAST) agent.
Analyze the following React component code for vulnerabilities, specifically focusing on:
1. DOM-based XSS (e.g., unsafe dangerouslySetInnerHTML, unvalidated URL params).
2. Insecure Client-Side Storage (e.g., sensitive tokens in localStorage, unencrypted sessionStorage).

Code to analyze:
jsx
{code}
Respond STRICTLY with a JSON object in the following format, and nothing else:
{{
"is_vulnerable": true or false,
"vulnerability_type": "Brief description or null if safe",
"reasoning": "1 sentence explaining why"
}}
"""


def evaluate_code(code_content):
    payload = {
        "model": MODEL_NAME,
        "prompt": PROMPT_TEMPLATE.format(code=code_content),
        "format": "json", # Заставляем Ollama отвечать строгим JSON
        "stream": False,
        "options": {
            "temperature": 0.1 # Низкая температура для детерминированности
        }
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        result = response.json()
        
        # Парсим JSON ответ от модели
        return json.loads(result["response"])
    except Exception as e:
        print(f"Ошибка API: {e}")
        return {"is_vulnerable": None, "vulnerability_type": "Error", "reasoning": "Failed to parse"}


def run_benchmark():
    print(f"🚀 Запуск бенчмарка на модели: {MODEL_NAME}...\n")

    metrics = {"TP": 0, "FP": 0, "TN": 0, "FN": 0, "Errors": 0}
    results_log = []

    # Тестируем уязвимый код (Ожидаем True)
    print("--- 🔴 Тестирование Vulnerable компонентов ---")
    for filename in os.listdir('dataset/vulnerable'):
        if not filename.endswith('.jsx'): continue
        
        with open(f'dataset/vulnerable/{filename}', 'r', encoding='utf-8') as f:
            code = f.read()
            
        print(f"Анализ {filename}...", end=" ")
        start_time = time.time()
        prediction = evaluate_code(code)
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

    # Тестируем безопасный код (Ожидаем False)
    print("\n--- 🟢 Тестирование Patched компонентов ---")
    for filename in os.listdir('dataset/patched'):
        if not filename.endswith('.jsx'): continue
        
        with open(f'dataset/patched/{filename}', 'r', encoding='utf-8') as f:
            code = f.read()
            
        print(f"Анализ {filename}...", end=" ")
        start_time = time.time()
        prediction = evaluate_code(code)
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

    # Подсчет итоговых метрик
    total = metrics["TP"] + metrics["TN"] + metrics["FP"] + metrics["FN"]
    accuracy = (metrics["TP"] + metrics["TN"]) / total if total > 0 else 0
    fpr = metrics["FP"] / (metrics["FP"] + metrics["TN"]) if (metrics["FP"] + metrics["TN"]) > 0 else 0
    fnr = metrics["FN"] / (metrics["FN"] + metrics["TP"]) if (metrics["FN"] + metrics["TP"]) > 0 else 0

    print("\n" + "="*40)
    print("📊 ИТОГОВЫЕ МЕТРИКИ ДЛЯ СТАТЬИ:")
    print("="*40)
    print(f"Accuracy (Точность):        {accuracy*100:.1f}%")
    print(f"False Positive Rate (FPR):  {fpr*100:.1f}% (Ложные тревоги)")
    print(f"False Negative Rate (FNR):  {fnr*100:.1f}% (Пропущенные уязвимости)")
    print(f"Всего файлов проверено:     {total}")
    print(f"Ошибок генерации:           {metrics['Errors']}")

    # Сохраняем полный лог для детального разбора в статье
    with open('benchmark_results.json', 'w', encoding='utf-8') as f:
        json.dump(results_log, f, indent=4, ensure_ascii=False)
    print("\nПодробный лог сохранен в 'benchmark_results.json'")
if __name__ == "__main__":
    run_benchmark()
