# LLM-Agents-as-SAST-Tools

Небольшой исследовательский репозиторий для проверки, насколько LLM могут выступать как SAST-агенты при анализе React-компонентов.

## Что делает проект

- Формирует датасет из пар:
  - `vulnerable` (уязвимый код)
  - `patched` (исправленный код)
- Прогоняет этот датасет через LLM
- Считает метрики качества:
  - Accuracy
  - False Positive Rate (FPR)
  - False Negative Rate (FNR)

## Структура репозитория

- `/home/runner/work/LLM-Agents-as-SAST-Tools/LLM-Agents-as-SAST-Tools/parser.py` — парсер сырого markdown-вывода в `.jsx` файлы датасета.
- `/home/runner/work/LLM-Agents-as-SAST-Tools/LLM-Agents-as-SAST-Tools/benchmark.py` — бенчмарк через локальную модель Ollama.
- `/home/runner/work/LLM-Agents-as-SAST-Tools/LLM-Agents-as-SAST-Tools/benchmark_gemini.py` — бенчмарк через Gemini API.
- `/home/runner/work/LLM-Agents-as-SAST-Tools/LLM-Agents-as-SAST-Tools/dataset/vulnerable` — уязвимые компоненты.
- `/home/runner/work/LLM-Agents-as-SAST-Tools/LLM-Agents-as-SAST-Tools/dataset/patched` — исправленные компоненты.
- `/home/runner/work/LLM-Agents-as-SAST-Tools/LLM-Agents-as-SAST-Tools/paper` — материалы для статьи.

## Требования

- Python 3.9+
- Пакет `requests`

Установка:

```bash
pip install requests
```

## Подготовка датасета (опционально)

Если нужно заново разобрать сырой markdown:

```bash
python parser.py raw_output.md
```

Скрипт создаст/дополнит `dataset/vulnerable` и `dataset/patched`.

## Запуск бенчмарка: Ollama

1. Установите и запустите Ollama.
2. Скачайте модель (по умолчанию в коде указана `llama3`).
3. Запустите:

```bash
python benchmark.py
```

Результаты сохраняются в:
- `/home/runner/work/LLM-Agents-as-SAST-Tools/LLM-Agents-as-SAST-Tools/benchmark_results.json`

## Запуск бенчмарка: Gemini

1. Укажите API-ключ Gemini в `benchmark_gemini.py`.
2. Запустите:

```bash
python benchmark_gemini.py
```

Результаты сохраняются в:
- `/home/runner/work/LLM-Agents-as-SAST-Tools/LLM-Agents-as-SAST-Tools/gemini_benchmark_results.json`

## Формат результата

Каждый элемент лога:

```json
{
  "file": "Component.jsx",
  "true_label": true,
  "prediction": {
    "is_vulnerable": true,
    "vulnerability_type": "DOM XSS via dangerouslySetInnerHTML",
    "reasoning": "..."
  }
}
```

## Ограничения

- Это исследовательский прототип, а не production-SAST.
- Качество зависит от модели, промпта и стабильности API.
- Для корректного сравнения желательно фиксировать одинаковую модель и параметры генерации.
