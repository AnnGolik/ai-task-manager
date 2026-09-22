import csv
import psycopg2

# Параметры подключения к базе данных
conn = psycopg2.connect(
    dbname="task_manager",
    user="postgres",
    password="1234",
    host="localhost",
    port="5432"
)

cur = conn.cursor()
cur.execute("SELECT id, title, description, status, created_at FROM tasks ORDER BY id")
rows = cur.fetchall()

# Сохраняем в CSV
with open('tasks_export.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['id', 'title', 'description', 'status', 'created_at'])
    writer.writerows(rows)

print(f"Экспортировано {len(rows)} задач в tasks_export.csv")

cur.close()
conn.close()