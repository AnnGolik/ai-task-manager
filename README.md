# AI Task Manager (Уровень 1)

Практическое задание: приложение для управления задачами.

## Стек технологий
- **Frontend:** React + JavaScript
- **Backend:** Node.js + Express
- **База данных:** PostgreSQL
- **Дополнительно:** Python (экспорт задач в CSV)

## Требования
Перед запуском убедитесь, что у вас установлены:
- Node.js 
- PostgreSQL 
- Python 

## Установка и запуск

### 1. База данных
1. Откройте pgAdmin и создайте базу данных `task_manager`.
2. Выполните SQL-скрипт:
   ```sql
   CREATE TABLE tasks (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT,
       status VARCHAR(20) NOT NULL DEFAULT 'new',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
### 2. Backend
```bash
cd backend
npm install
# Создайте файл .env с настройками (см. .env.example)
npm run dev
```
Сервер запустится на `http://localhost:5000`.

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
Приложение откроется на `http://localhost:3000`.

### 4. Python-скрипт (экспорт задач в CSV)
```bash
cd python
pip install psycopg2-binary
python export_tasks.py
```
Скрипт создаст файл `tasks_export.csv` со всеми задачами.

## API
- `GET /tasks` — получить список задач
- `POST /tasks` — создать задачу
- `PUT /tasks/:id` — изменить статус задачи
- `DELETE /tasks/:id` — удалить задачу

## Статусы задач
- `new` — Новая
- `in_progress` — В работе
- `done` — Выполнена