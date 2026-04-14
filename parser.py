import os
import sys

def get_unique_filepath(directory, component_name, extension=".jsx"):
    """Возвращает уникальное имя файла, чтобы ничего не перезаписывать"""
    base_path = f"{directory}/{component_name}{extension}"
    if not os.path.exists(base_path):
        return base_path
    
    counter = 1
    while True:
        new_path = f"{directory}/{component_name}_{counter}{extension}"
        if not os.path.exists(new_path):
            return new_path
        counter += 1

def process_file(filename):
    os.makedirs('dataset/vulnerable', exist_ok=True)
    os.makedirs('dataset/patched', exist_ok=True)
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"❌ Ошибка: Файл {filename} не найден.")
        sys.exit(1)

    current_component = None
    current_type = None
    code_buffer = []
    saved_count = 0

    def save_current():
        nonlocal saved_count
        if not (current_component and current_type and code_buffer):
            return

        directory = f'dataset/{current_type}'
        filepath = get_unique_filepath(directory, current_component)
        
        with open(filepath, 'w', encoding='utf-8') as out_f:
            out_f.write("".join(code_buffer))
        
        print(f"✅ Сохранен: {filepath}")
        saved_count += 1

    for line in lines:
        line_lower = line.lower()

        # Новый компонент
        if 'component' in line_lower and ':' in line_lower:
            save_current()
            parts = line.split(':', 1)
            if len(parts) > 1:
                raw_name = parts[1].strip()
                current_component = "".join(c for c in raw_name if c.isalnum() or c == '_')
            current_type = None
            code_buffer = []
            continue

        # Начало Vulnerable Code
        elif 'vulnerable code' in line_lower:
            save_current()
            current_type = 'vulnerable'
            code_buffer = []
            continue

        # Начало Patched Code
        elif 'patched code' in line_lower:
            save_current()
            current_type = 'patched'
            code_buffer = []
            continue

        # Собираем код
        elif current_type is not None:
            code_buffer.append(line)

    # Сохраняем последний блок
    save_current()

    if saved_count == 0:
        print("\n⚠️ Внимание: Ни одного файла не сохранено!")
    else:
        print(f"\n🚀 Парсинг завершён! Сохранено новых файлов: {saved_count}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Использование: python parser.py raw_output.md")
        print("   (можно указывать разные файлы: raw_output2.md, batch3.md и т.д.)")
    else:
        process_file(sys.argv[1])