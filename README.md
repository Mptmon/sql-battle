# 🗡️ SQL Battle — Платформа для проведения SQL-баттлов

Веб-приложение для проведения интерактивных SQL-соревнований на ИТ-мероприятиях. Участники пишут SQL-запросы в реальном времени, получают мгновенную обратную связь и соревнуются за место в лидерборде.

![SQL Battle](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Содержание

- [Возможности](#-возможности)
- [Технологический стек](#-технологический-стек)
- [Структура проекта](#-структура-проекта)
- [Установка и запуск](#-установка-и-запуск)
- [Интеграция с бэкендом](#-интеграция-с-бэкендом)
- [Рекомендации по бэкенду](#-рекомендации-по-бэкенду)
- [Деплой](#-деплой)
- [Roadmap](#-roadmap)

---

## ✨ Возможности

### 🎮 Для участников
- **Арена с редактором SQL** — профессиональный Monaco Editor (как в VS Code) с подсветкой синтаксиса
- **Мгновенное выполнение** — тестирование запросов с выводом результатов или ошибок
- **Личный кабинет** — статистика, рейтинг, история решенных задач
- **Реалтайм лидерборд** — обновление таблицы лидеров в реальном времени (WebSocket)
- **Адаптивный дизайн** — работа на любых устройствах

### 🛠 Для организаторов (Админка)
- **Управление задачами** — создание, редактирование, удаление задач
- **Настройка таймингов** — управление временем начала и длительностью раундов
- **Мониторинг участников** — просмотр статистики и прогресса

---

## 🛠 Технологический стек

### Фронтенд (реализовано ✅)

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Next.js** | 14.x | React-фреймворк с App Router |
| **TypeScript** | 5.x | Строгая типизация |
| **Tailwind CSS** | 3.x | Utility-first стилизация |
| **shadcn/ui** | Latest | UI-компоненты на Radix UI |
| **Monaco Editor** | Latest | Редактор кода из VS Code |
| **Sonner** | Latest | Всплывающие уведомления |
| **Lucide React** | Latest | Иконки |

### Бэкенд (рекомендации)

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Python** | 3.10+ | Язык программирования |
| **FastAPI** | 0.100+ | Веб-фреймворк для API |
| **PostgreSQL** | 14+ | Основная база данных |
| **SQLAlchemy** | 2.0+ | ORM для работы с БД |
| **Redis** | 7+ | Кэширование и WebSocket |
| **Docker** | Latest | Контейнеризация |

---

## 📁 Структура проекта


sql-battle/
├── app/ # Маршруты Next.js (App Router)
│ ├── (arena)/ # Зона участников
│ │ ├── battle/page.tsx # Арена (редактор SQL)
│ │ ├── profile/page.tsx # Личный кабинет
│ │ └── layout.tsx # Хедер с таймером
│ ├── admin/ # Зона администраторов
│ │ ├── tasks/page.tsx # Управление задачами
│ │ ├── settings/page.tsx # Настройки таймингов
│ │ └── layout.tsx # Боковое меню
│ ├── layout.tsx # Корневой layout
│ └── globals.css # Глобальные стили
│
├── components/ # Переиспользуемые компоненты
│ ├── ui/ # shadcn/ui компоненты
│ ├── admin/
│ │ └── TaskFormDialog.tsx # Форма создания задачи
│ └── SqlEditor.tsx # Обертка Monaco Editor
│
├── lib/ # Утилиты
│ ├── api.ts # API-клиент
│ ├── auth.ts # Управление JWT
│ └── mock-data.ts # Мок-данные
│
├── .env.local # Переменные окружения
├── package.json # Зависимости
└── tailwind.config.ts # Конфигурация Tailwind



---

## 🚀 Установка и запуск

### Требования
- Node.js 18+ 
- npm или yarn

### Шаги установки

1. **Клонировать репозиторий**
```bash
git clone https://github.com/your-repo/sql-battle.git
cd sql-battle

Установить зависимости

npm install

Настроить переменные окружения
Создай файл .env.local в корне проекта:

NEXT_PUBLIC_API_URL=http://localhost:8000/api

Запустить dev-сервер

npm run dev

Приложение будет доступно по адресу: http://localhost:3000
Сборка для продакшена

npm run build
npm start


Интеграция с бэкендом
Переключение на реальный API
Открой lib/api.ts
Найди строку:

const USE_MOCKS = true;

Поменяй на:

const USE_MOCKS = false;

Перезапусти сервер: npm run dev


API-контракт
Фронтенд ожидает следующие эндпоинты:
Аутентификация

POST /api/auth/register
  Body: { "username": "string", "password": "string" }
  Response: { "token": "string", "user": { "id": 1, "username": "string" } }

POST /api/auth/login
  Body: { "username": "string", "password": "string" }
  Response: { "token": "string", "user": { "id": 1, "username": "string" } }

GET /api/auth/me
  Headers: { "Authorization": "Bearer <token>" }
  Response: { "id": 1, "username": "string", "rating": 1250, "points": 450 }


  Задачи (Арена)

  GET /api/tasks
  Response: [
    { "id": 1, "title": "Найди хакеров", "difficulty": "easy", "points": 100 }
  ]

GET /api/tasks/{id}
  Response: {
    "id": 1,
    "title": "Найди хакеров",
    "description": "Напишите запрос...",
    "schema": "CREATE TABLE users (...)",
    "points": 100,
    "difficulty": "easy"
  }

POST /api/tasks/{id}/execute
  Headers: { "Authorization": "Bearer <token>" }
  Body: { "query": "SELECT * FROM users" }
  Response: {
    "status": "success",
    "data": [{ "id": 1, "name": "Иван" }],
    "execution_time": 0.12
  }
  ИЛИ
  Response: {
    "status": "error",
    "message": "Syntax error near 'SELEC'"
  }

POST /api/tasks/{id}/submit
  Headers: { "Authorization": "Bearer <token>" }
  Body: { "query": "SELECT * FROM users WHERE status = 'active'" }
  Response: {
    "is_correct": true,
    "points_earned": 100,
    "new_total_points": 550
  }


Профиль

GET /api/profile
  Headers: { "Authorization": "Bearer <token>" }
  Response: {
    "id": 1,
    "username": "Иван П.",
    "rating": 1250,
    "points": 450,
    "solved_tasks": [1, 3, 5]
  }


Админка

GET /api/admin/tasks
  Response: [
    { "id": 1, "title": "...", "difficulty": "easy", "points": 100 }
  ]

POST /api/admin/tasks
  Body: {
    "title": "string",
    "description": "string",
    "schema": "string",
    "solution": "string",
    "difficulty": "easy|medium|hard",
    "points": 100
  }

PUT /api/admin/tasks/{id}
  Body: { "title": "new title", ... }

DELETE /api/admin/tasks/{id}

GET /api/admin/settings
  Response: {
    "battle_start": "2025-01-15T10:00:00Z",
    "round_duration_minutes": 60
  }

PUT /api/admin/settings
  Body: { "battle_start": "...", "round_duration_minutes": 90 }


Лидерборд

GET /api/leaderboard
  Response: [
    { "rank": 1, "username": "Иван П.", "points": 450 },
    { "rank": 2, "username": "Даня", "points": 400 }
  ]

WebSocket: /ws/leaderboard
  Отправляет: { "type": "leaderboard_update", "data": [...] }



Рекомендации по бэкенду
Архитектура
Рекомендуемая структура FastAPI-проекта:

backend/
├── app/
│   ├── main.py                 # Точка входа, настройка CORS
│   ├── config.py               # Настройки (из .env)
│   ├── database.py             # Подключение к БД
│   ├── models/                 # SQLAlchemy модели
│   │   ├── user.py
│   │   ├── task.py
│   │   └── submission.py
│   ├── schemas/                # Pydantic схемы
│   │   ├── user.py
│   │   ├── task.py
│   │   └── submission.py
│   ├── routers/                # API эндпоинты
│   │   ├── auth.py
│   │   ├── tasks.py
│   │   ├── profile.py
│   │   └── admin.py
│   ├── services/               # Бизнес-логика
│   │   ├── sql_executor.py     # Выполнение SQL в sandbox
│   │   └── scorer.py           # Подсчет очков
│   └── utils/                  # Утилиты
│       ├── security.py         # JWT, хэширование паролей
│       └── websocket.py        # WebSocket менеджер
├── tests/                      # Тесты
├── requirements.txt
├── Dockerfile
└── .env

Критически важные моменты
1. Настройка CORS (ОБЯЗАТЕЛЬНО!)

# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

2. Безопасное выполнение SQL (Sandbox)
НИКОГДА не выполняй запросы участников напрямую в основной базе!

# app/services/sql_executor.py
import sqlite3
import tempfile
import os

async def execute_sql_safely(query: str, schema_sql: str, timeout: int = 2):
    """
    Выполняет SQL-запрос в изолированной среде.
    """
    # Создаем временную БД для каждого запроса
    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
        db_path = tmp.name
    
    try:
        conn = sqlite3.connect(db_path)
        conn.execute(f"PRAGMA busy_timeout = {timeout * 1000}")
        
        # Инициализируем схему
        conn.executescript(schema_sql)
        
        # Проверяем, что запрос только SELECT
        if not query.strip().upper().startswith("SELECT"):
            return {"status": "error", "message": "Разрешены только SELECT-запросы"}
        
        # Выполняем с таймаутом
        cursor = conn.cursor()
        cursor.execute(query)
        results = cursor.fetchall()
        
        # Форматируем результат
        columns = [desc[0] for desc in cursor.description]
        data = [dict(zip(columns, row)) for row in results]
        
        return {
            "status": "success",
            "data": data,
            "execution_time": 0.05  # Реальное время можно замерить через time.time()
        }
    
    except sqlite3.Error as e:
        return {"status": "error", "message": str(e)}
    
    finally:
        conn.close()
        os.unlink(db_path)  # Удаляем временную БД


Альтернатива для PostgreSQL:
Использовать Docker-контейнеры с ограничением ресурсов или отдельные схемы для каждого участника.


3. Сравнение результатов

# app/services/scorer.py
def compare_results(expected: list, actual: list) -> bool:
    """
    Сравнивает результаты с учетом того, что порядок строк может быть разным.
    """
    if len(expected) != len(actual):
        return False
    
    # Сортируем оба набора данных
    expected_sorted = sorted(expected, key=lambda x: tuple(sorted(x.items())))
    actual_sorted = sorted(actual, key=lambda x: tuple(sorted(x.items())))
    
    return expected_sorted == actual_sorted


4. JWT-аутентификация

# app/utils/security.py
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


5. WebSocket для лидерборда

# app/utils/websocket.py
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()


База данных
Схема PostgreSQL

-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rating INT DEFAULT 0,
    total_points INT DEFAULT 0,
    role VARCHAR(20) DEFAULT 'participant', -- 'participant' или 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Задачи
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    schema_sql TEXT NOT NULL,
    solution_sql TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
    points INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Попытки решения
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    task_id INT REFERENCES tasks(id),
    query TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_earned INT DEFAULT 0,
    execution_time FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Настройки баттла
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    battle_start TIMESTAMP NOT NULL,
    round_duration_minutes INT NOT NULL
);

Зависимости (requirements.txt)

fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.1.0
redis==5.0.1
websockets==12.0

Запуск бэкенда

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Установить зависимости
pip install -r requirements.txt

# Запустить сервер
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Деплой
Фронтенд (Vercel — бесплатно)
Залей код на GitHub
Подключи репозиторий к Vercel
Добавь переменную окружения NEXT_PUBLIC_API_URL в настройках Vercel
Деплой произойдет автоматически при каждом push

Бэкенд (Docker)

# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

docker build -t sql-battle-backend .
docker run -p 8000:8000 sql-battle-backend

Локальный деплой на мероприятии
Если нет интернета, можно запустить всё на одном ноутбуке:

# Терминал 1: Бэкенд
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Терминал 2: Фронтенд
cd frontend
npm run build
npm start -- -p 3000

Участники подключаются по локальной сети: http://192.168.x.x:3000

Roadmap
Этап 1 (Текущий) ✅
Арена с Monaco Editor
Личный кабинет
Админка
API-мост для интеграции
Этап 2 (Интеграция)
Реализация бэкенда (FastAPI)
Аутентификация (JWT)
Безопасное выполнение SQL
Подсчет очков
Этап 3 (Продвинутые фичи)
Реалтайм лидерборд (WebSocket)
Система достижений (бейджи)
История решений с возможностью просмотра кода
Экспорт статистики в CSV/PDF
Этап 4 (Масштабирование)
Поддержка командных баттлов
Мультиязычность (RU/EN)
Интеграция с Telegram-ботом для уведомлений
Мобильное приложение (React Native)


