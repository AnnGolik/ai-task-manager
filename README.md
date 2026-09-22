# AI Task Manager

Практическое задание по производственной практике: система управления задачами с автоматическим анализом текста.

## 📖 О проекте

Приложение позволяет пользователям регистрироваться, входить в систему и управлять своими задачами. При создании задачи её текст автоматически анализируется Python-сервисом, который определяет **приоритет** и **категорию**.

### Что реализовано

**Уровень 1 (Junior):**
- Создание, просмотр, изменение статуса и удаление задач.
- REST API на Node.js + Express.
- Хранение данных в PostgreSQL.
- React-интерфейс с формой и таблицей задач.
- Python-скрипт для экспорта задач в CSV.

**Уровень 2 (Middle):**
- Регистрация и вход пользователей (JWT-авторизация).
- Пароли хранятся в виде хеша (bcrypt).
- Каждый пользователь видит **только свои** задачи.
- Отдельный Python-сервис (FastAPI) для анализа текста задачи.
- Интеграция Node.js ↔ Python: backend отправляет текст задачи в Python и получает приоритет и категорию.
- Защищённые маршруты на фронтенде (React Router).
- Отображение приоритета и категории в интерфейсе.

## 🛠 Стек технологий

| Компонент | Технология |
|-----------|------------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express, JWT, bcrypt |
| База данных | PostgreSQL |
| Python-сервис | FastAPI, Uvicorn |
| Контроль версий | Git, GitHub |

## 📋 Требования

Перед запуском убедитесь, что установлены:

- **Node.js** v18 или выше — [скачать](https://nodejs.org/)
- **PostgreSQL** v15 или выше — [скачать](https://www.postgresql.org/download/)
- **Python** v3.10 или выше — [скачать](https://www.python.org/downloads/)

## 🚀 Установка и запуск

### Шаг 1. Клонирование репозитория

```bash
git clone https://github.com/AnnGolik/ai-task-manager.git
cd ai-task-manager
```

### Шаг 2. Настройка базы данных

1. Откройте pgAdmin (или psql) и создайте базу данных:

```sql
CREATE DATABASE task_manager;
```

2. Подключитесь к базе `task_manager` и выполните SQL-скрипт:

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

### Шаг 3. Запуск Backend (Node.js)

```bash
cd backend
npm install
```

Создайте файл `.env` в папке `backend` (по образцу `.env.example`):

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=ваш_пароль
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
JWT_SECRET=ваш_секретный_ключ
```

Запустите сервер:

```bash
npm run dev
```

Backend будет доступен по адресу: `http://localhost:5000`

### Шаг 4. Запуск Python-сервиса (анализатор текста)

Откройте **новый терминал**:

```bash
cd python
pip install -r requirements.txt
python -m uvicorn analyzer:app --reload --port 8000
```

Python-сервис будет доступен по адресу: `http://localhost:8000`
Документация (Swagger UI): `http://localhost:8000/docs`

### Шаг 5. Запуск Frontend (React)

Откройте **новый терминал**:

```bash
cd frontend
npm install
npm start
```

Приложение откроется в браузере: `http://localhost:3000`

### Шаг 6 (опционально). Экспорт задач в CSV

```bash
cd python
python export_tasks.py
```

Будет создан файл `tasks_export.csv` со всеми задачами.

## 📡 API

### Авторизация

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/auth/register` | Регистрация нового пользователя |
| POST | `/auth/login` | Вход существующего пользователя |

**Пример тела запроса:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Ответ:** `{ "token": "...", "user": { "id": 1, "email": "..." } }`

### Задачи (требуется JWT-токен)

Заголовок запроса: `Authorization: Bearer <ваш_токен>`

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/tasks` | Получить только свои задачи |
| POST | `/tasks` | Создать задачу |
| PUT | `/tasks/:id` | Изменить статус задачи |
| DELETE | `/tasks/:id` | Удалить задачу |

**Пример создания задачи:**
```json
{
  "title": "Подготовить презентацию для клиента",
  "description": "До пятницы"
}
```

### Python-сервис

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/` | Проверка работоспособности |
| POST | `/analyze` | Анализ текста задачи |

**Пример запроса:**
```json
{
  "text": "Подготовить презентацию для клиента до пятницы"
}
```

**Ответ:**
```json
{
  "priority": "high",
  "category": "business"
}
```

## 🏷 Справочные значения

### Статусы задач
- `new` — Новая
- `in_progress` — В работе
- `done` — Выполнена

### Приоритеты
- `high` — Высокий
- `medium` — Средний
- `low` — Низкий

### Категории
- `business` — Работа
- `study` — Учёба
- `personal` — Личное
- `health` — Здоровье
- `finance` — Финансы
- `general` — Общее

## 🔐 Безопасность

- Пароли хешируются через **bcrypt** перед сохранением в БД.
- **JWT-токены** подписываются секретным ключом (`JWT_SECRET`).
- Файл `.env` **не попадает в Git** (добавлен в `.gitignore`).
- Пользователь может видеть, изменять и удалять **только свои** задачи.
- При запросе чужих задач возвращается `404 Not Found`.

## 📂 Структура проекта

```
ai-task-manager/
├── backend/              # Node.js + Express (backend)
│   ├── middleware/       # Проверка JWT-токена
│   ├── routes/           # Роуты: auth.js, tasks.js
│   ├── db.js             # Подключение к PostgreSQL
│   ├── index.js          # Точка входа
│   └── .env.example      # Пример переменных окружения
│
├── frontend/             # React-приложение
│   └── src/
│       ├── api/          # Axios-обёртка с авто-токеном
│       ├── context/      # AuthContext (хранилище токена)
│       ├── pages/        # Register, Login, Tasks
│       ├── App.js        # Роутинг
│       └── index.js
│
├── python/               # Python-сервис
│   ├── analyzer.py       # FastAPI-сервис анализа текста
│   ├── export_tasks.py   # Скрипт экспорта в CSV
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

## 👤 Автор

**Анна** — студентка, практика по разработке веб-приложений.

GitHub: [@AnnGolik](https://github.com/AnnGolik)