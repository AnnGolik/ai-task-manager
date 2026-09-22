# AI Task Manager (Уровень 1 + Уровень 2, смешано)

Практическое задание: система управления задачами с автоматическим анализом текста.

## 🎯 Что умеет приложение

**Уровень 1:**
- Создание, просмотр, изменение статуса и удаление задач.
- Хранение задач в PostgreSQL.

**Уровень 2:**
- Регистрация и вход пользователей (JWT-авторизация).
- Пароли хранятся в хешированном виде (bcrypt).
- Каждый пользователь видит **только свои** задачи.
- Автоматический анализ текста задачи: Python-сервис определяет **приоритет** и **категорию**.
- Экспорт всех задач в CSV (Python-скрипт).

## 🛠 Стек технологий

| Компонент | Технология |
|-----------|------------|
| Frontend | React + JavaScript + React Router |
| Backend | Node.js + Express + JWT |
| База данных | PostgreSQL |
| Python-сервис | FastAPI + Uvicorn |
| Контроль версий | Git |

## 📋 Требования

- Node.js (v18+)
- PostgreSQL (v15+)
- Python (v3.10+)

## 🚀 Установка и запуск

### 1. База данных

1. Откройте pgAdmin и создайте базу данных `task_manager`.
2. Выполните SQL-скрипт:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend (Node.js)

```bash
cd backend
npm install
# Создайте файл .env (см. .env.example) и укажите свой пароль от PostgreSQL
npm run dev
```
Сервер запустится на `http://localhost:5000`.

### 3. Python-сервис (анализ текста)

```bash
cd python
pip install fastapi uvicorn
python -m uvicorn analyzer:app --reload --port 8000
```
Сервис запустится на `http://localhost:8000`. Документация: `http://localhost:8000/docs`.

### 4. Frontend (React)

```bash
cd frontend
npm install
npm start
```
Приложение откроется на `http://localhost:3000`.

### 5. Python-скрипт экспорта в CSV (опционально)

```bash
cd python
pip install psycopg2-binary
python export_tasks.py
```
Создаст файл `tasks_export.csv` со всеми задачами.

## 📡 API

### Авторизация
- `POST /auth/register` — регистрация нового пользователя.
- `POST /auth/login` — вход существующего пользователя.

### Задачи (требуется JWT-токен)
- `GET /tasks` — получить только свои задачи.
- `POST /tasks` — создать задачу (текст отправляется в Python для анализа).
- `PUT /tasks/:id` — изменить статус задачи.
- `DELETE /tasks/:id` — удалить задачу.

### Python-сервис
- `POST /analyze` — анализ текста (принимает `{text}` и возвращает `{priority, category}`).

## 🏷 Статусы, приоритеты, категории

**Статусы:** `new`, `in_progress`, `done`

**Приоритеты:** `high`, `medium`, `low`

**Категории:** `business`, `study`, `personal`, `health`, `finance`, `general`

## 🔐 Безопасность

- Пароли хешируются через `bcrypt` перед сохранением в БД.
- JWT-токены подписываются секретным ключом из `.env`.
- Файл `.env` не попадает в Git (добавлен в `.gitignore`).
- Пользователь может видеть, изменять и удалять только свои задачи.