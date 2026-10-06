import csv
import os
import sys
import psycopg2
from dotenv import load_dotenv

# Загружаем переменные из .env-файла
load_dotenv()

def export_tasks():
    """Выгружает все задачи из PostgreSQL в CSV-файл."""
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
        )
    except psycopg2.Error as e:
        print(f"Ошибка подключения к БД: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        cur = conn.cursor()
        cur.execute("SELECT id, title, description, status, created_at FROM tasks ORDER BY id")
        rows = cur.fetchall()

        with open('tasks_export.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'title', 'description', 'status', 'created_at'])
            writer.writerows(rows)

        print(f"Экспортировано {len(rows)} задач в tasks_export.csv")
    except psycopg2.Error as e:
        print(f"Ошибка БД: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Непредвиденная ошибка: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    export_tasks()