# AI Task Manager

Практическое задание по производственной практике: система управления задачами с автоматическим анализом текста.

## 📘 О проекте

Приложение позволяет пользователям регистрироваться, входить в систему и управлять своими задачами. При создании задачи её текст автоматически анализируется Python-сервисом, который определяет **приоритет** и **категорию**.

### ❓ Что реализовано

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

## 🔨 Стек технологий

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
- **Python** v3.10 или выше — [скачать](https://www.python.org/downloads/)
- **Docker Desktop** (рекомендуется) — [скачать](https://www.docker.com/products/docker-desktop/)  
  *или* **PostgreSQL** v15+ — [скачать](https://www.postgresql.org/download/)

## 🚀 Установка и запуск

### Шаг 1. Клонирование репозитория

```bash
git clone https://github.com/AnnGolik/ai-task-manager.git
cd ai-task-manager
```

### Шаг 2. Запуск и настройка базы данных

Есть **два способа** — выберите любой.

#### Способ А. Через Docker (рекомендуется)

Убедитесь, что **Docker Desktop запущен** (значок кита в трее зелёный), затем из корня проекта выполните:

```bash
docker compose up -d
```

Docker автоматически:
- скачает образ `postgres:17-alpine`;
- создаст базу `task_manager` (пользователь `postgres`, пароль `1234`);
- выполнит SQL-скрипт `backend/sql/init.sql` — таблицы, индексы и связи создадутся сами.

Проверить, что контейнер работает:

```bash
docker ps
```

Ожидаемый статус: `Up ... (healthy)`.

Проверить, что таблицы созданы:

```bash
docker exec -it ai-task-manager-db psql -U postgres -d task_manager -c "\dt"
```

Посмотреть логи:

```bash
docker logs ai-task-manager-db
```

Остановить контейнер (данные сохранятся):

```bash
docker compose down
```

Остановить и удалить данные (полный сброс БД):

```bash
docker compose down -v
```

#### Способ Б. Локальный PostgreSQL 
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

### Быстрый запуск на Windows

Если вы работаете на Windows и PostgreSQL уже запущен как служба (локально или в Docker), можно запустить **все три сервиса одной командой**:

```bash
.\start-all.bat
```

Скрипт откроет три отдельных окна:
- Backend (Node.js) — порт 5000
- Python (FastAPI) — порт 8000
- Frontend (React) — порт 3000

Через 10–15 секунд автоматически откроется браузер на `http://localhost:3000`.

**Важно:** PostgreSQL должен быть уже запущен (проверьте службу `postgresql-x64-17` в `services.msc`).

## 🐳 Docker

Проект использует Docker для запуска PostgreSQL. Это позволяет:

- Запускать БД **одной командой** на любой ОС (Windows / macOS / Linux).
- Не устанавливать PostgreSQL локально.
- Автоматически создавать таблицы при первом старте (через `init.sql`).
- Хранить данные в volume между перезапусками.

### Полезные команды

| Команда | Что делает |
|---------|------------|
| `docker compose up -d` | Запустить контейнер в фоне |
| `docker compose down` | Остановить контейнер (данные сохраняются) |
| `docker compose down -v` | Остановить и удалить данные |
| `docker ps` | Список работающих контейнеров |
| `docker logs ai-task-manager-db` | Логи PostgreSQL |
| `docker exec -it ai-task-manager-db psql -U postgres -d task_manager` | Зайти в psql внутри контейнера |

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

## ℹ️ Справочные значения

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

## 📂 Структура проекта и назначение файлов

```
ai-task-manager/
├── backend/                     # Node.js-сервер
├── frontend/                    # React-приложение
├── python/                      # Python-сервисы
├── docker-compose.yml           # Конфигурация Docker
├── start-all.bat                # Запуск всех сервисов (Windows)
├── .gitignore
└── README.md
```

### Backend

| Файл | Назначение |
|------|------------|
| `backend/index.js` | Точка входа Express-сервера. Подключает CORS, парсер JSON, роуты. |
| `backend/db.js` | Пул подключений к PostgreSQL через `pg.Pool`. Читает переменные из `.env`. |
| `backend/package.json` | Список зависимостей и команды запуска (`npm start`, `npm run dev`). |
| `backend/.env.example` | Пример переменных окружения. Копируется в `.env` при первом запуске. |
| `backend/middleware/auth.js` | Middleware проверки JWT-токена. Извлекает пользователя из заголовка `Authorization`. |
| `backend/routes/auth.js` | Роуты регистрации и входа. Хеширует пароли через bcrypt, выдаёт JWT. |
| `backend/routes/tasks.js` | CRUD-роуты задач. Фильтрует по `user_id`. При создании отправляет текст в Python-сервис (с таймаутом 3 сек). |
| `backend/sql/init.sql` | SQL-скрипт создания таблиц `users` и `tasks`, индексов и связей. Применяется автоматически в Docker. |

### Frontend

| Файл | Назначение |
|------|------------|
| `frontend/package.json` | Зависимости React, React Router, Axios. |
| `frontend/public/index.html` | HTML-шаблон. Подключает favicon и задаёт `<title>`. |
| `frontend/public/favicon.svg` | Иконка приложения (SVG-логотип). |
| `frontend/src/index.js` | Точка входа React. Оборачивает приложение в `AuthProvider`. |
| `frontend/src/App.js` | Роутинг. Реализует `PrivateRoute` и `PublicRoute` для защиты страниц. |
| `frontend/src/App.css` | Все стили: тема, градиенты, анимации, адаптивность. |
| `frontend/src/api/api.js` | Настроенный экземпляр Axios. Автоматически подставляет JWT-токен в заголовки. |
| `frontend/src/context/AuthContext.js` | React Context авторизации. Хранит токен и пользователя в `localStorage`. |
| `frontend/src/components/Logo.jsx` | SVG-компонент логотипа. |
| `frontend/src/pages/Login.jsx` | Страница входа. |
| `frontend/src/pages/Register.jsx` | Страница регистрации. |
| `frontend/src/pages/Tasks.jsx` | Главная страница: форма создания, таблица задач, смена статуса, удаление, индикатор загрузки. |
| `frontend/src/App.test.js` | Тест рендеринга `<App />`. |

### Python

| Файл | Назначение |
|------|------------|
| `python/analyzer.py` | FastAPI-сервис анализа текста. Возвращает приоритет и категорию по ключевым словам. |
| `python/export_tasks.py` | Скрипт экспорта задач из PostgreSQL в CSV. Параметры БД читает из `.env`. |
| `python/requirements.txt` | Зависимости: `fastapi`, `uvicorn`, `psycopg2-binary`, `python-dotenv`. |
| `python/.env.example` | Пример переменных для подключения к БД. |

### Корень проекта

| Файл | Назначение |
|------|------------|
| `docker-compose.yml` | Конфигурация Docker Compose: сервис `postgres`, монтирование `init.sql`, volume для данных. |
| `start-all.bat` | Батник для Windows. Открывает три окна: backend, Python, frontend. |
| `.gitignore` | Исключает из Git `node_modules`, `.env`, `__pycache__`, `tasks_export.csv`. |
| `README.md` | Этот файл. |


## 👩🏻 Автор

**Анна Голикова** — студентка, практика по разработке веб-приложений.

GitHub: [@AnnGolik](https://github.com/AnnGolik)