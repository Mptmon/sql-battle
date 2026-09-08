# SQL Battle - Платформа для проведения SQL-соревнований

Платформа для проведения интерактивных SQL-баттлов на IT-мероприятиях. Разработана для **cdek_digital**.

## 🎯 Описание проекта

SQL Battle — это веб-приложение для проведения соревнований по написанию SQL-запросов в реальном времени. Участники получают задачи, пишут SQL-запросы, и система автоматически проверяет правильность решений путём сравнения результатов с эталонными.

### Ключевые особенности
- ⏱ **Таймер 5 минут** на каждую задачу
- 🏆 **Лидерборд в реальном времени** (WebSocket)
- 🐦 **Интерактивная схема БД** с примерами данных
- ✅ **Проверка через сравнение результатов** (не текста запроса)
- 👥 **Система назначений** задач участникам
- 🎨 **Брендинг cdek_digital**

---

## 🏗 Архитектура

┌─────────────────┐
│   Frontend      │  Next.js 16 + React + TypeScript
│   (этот репо)   │  Tailwind CSS + shadcn/ui
└────────┬────────┘
         │ HTTP/WebSocket
         ▼
┌─────────────────┐
│   Backend       │  Python + FastAPI
│   (отдельный    │  PostgreSQL/SQLite
│    репо)        │  WebSocket для реалтайма
└─────────────────┘

---

## 🔄 User Flow (Поток пользователя)

1. Welcome (/) → Стартовая страница с правилами
   ↓
2. Login (/login) → Авторизация/регистрация
   ↓
3. Lobby (/lobby) → Ожидание назначения задачи
   ↓ (админ назначает задачу через /admin/users)
4. Battle (/battle?taskId=X) → Решение задачи
   - Таймер запускается автоматически (5 минут)
   - Пользователь видит схему БД с примерами данных
   - Пишет SQL-запрос в Monaco Editor
   - Может выполнить запрос для проверки (Run)
   - Отправляет решение (Submit)
   ↓
5. Результат → Проверка на бэкенде
   - Если верно: начисление баллов, обновление лидерборда
   - Если неверно: показ эталонного результата
   ↓
6. Возврат в лобби → Ожидание следующей задачи

---

## 📊 Структура данных

### Таблица `users` (Пользователи)

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rating INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  role VARCHAR(20) DEFAULT 'participant', -- 'participant' или 'admin'
  created_at TIMESTAMP DEFAULT NOW()
);

### Таблица `tasks` (Задачи)

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
  points INTEGER NOT NULL,
  schema TEXT NOT NULL, -- DDL для создания таблиц
  tables JSONB NOT NULL, -- Структура таблиц с примерами данных
  expected_result JSONB NOT NULL, -- Эталонный результат
  created_at TIMESTAMP DEFAULT NOW()
);

**Пример поля `tables`:**

[
  {
    "name": "users",
    "columns": [
      { "name": "id", "type": "INT" },
      { "name": "name", "type": "VARCHAR" },
      { "name": "city", "type": "VARCHAR" }
    ],
    "sampleData": [
      { "id": 1, "name": "Иван Петров", "city": "Москва" },
      { "id": 2, "name": "Мария Сидорова", "city": "СПб" }
    ]
  }
]

**Пример поля `expected_result`:**

[
  { "city": "Москва", "user_count": 15 },
  { "city": "СПб", "user_count": 12 }
]

### Таблица `submissions` (Попытки решений)

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  task_id INTEGER REFERENCES tasks(id),
  query TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

### Таблица `task_assignments` (Назначения задач)

CREATE TABLE task_assignments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) UNIQUE,
  task_id INTEGER REFERENCES tasks(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

---

## 🔌 API-контракт

### Базовый URL

http://localhost:8000/api

### Аутентификация

Все запросы (кроме `/auth/*`) требуют заголовок:

Authorization: Bearer <jwt_token>

---

### 🔐 Аутентификация

#### POST `/auth/register`
Регистрация нового пользователя.

**Request:**

{
  "username": "ivan.petrov",
  "email": "ivan@cdek.digital",
  "password": "secure_password"
}

**Response (201):**

{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "ivan.petrov",
    "email": "ivan@cdek.digital",
    "rating": 0,
    "total_points": 0,
    "role": "participant"
  }
}

#### POST `/auth/login`
Вход в систему.

**Request:**

{
  "username": "ivan.petrov",
  "password": "secure_password"
}

**Response (200):**

{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "ivan.petrov",
    "email": "ivan@cdek.digital",
    "rating": 1250,
    "total_points": 450,
    "role": "participant"
  }
}

---

### 👤 Профиль пользователя

#### GET `/profile`
Получить данные текущего пользователя.

**Response (200):**

{
  "id": 1,
  "username": "ivan.petrov",
  "email": "ivan@cdek.digital",
  "rating": 1250,
  "total_points": 450,
  "rank": 3,
  "solved_tasks": [1, 2, 5],
  "role": "participant"
}

---

### 🎮 Задачи

#### GET `/tasks`
Получить список всех задач (для админки).

**Response (200):**

[
  {
    "id": 1,
    "title": "Найди активных хакеров",
    "difficulty": "easy",
    "points": 100,
    "status": "unsolved"
  }
]

#### GET `/tasks/{id}`
Получить детали задачи.

**Response (200):**

{
  "id": 3,
  "title": "Анализ заказов клиентов",
  "description": "Напишите запрос, который вернёт имя клиента...",
  "difficulty": "hard",
  "points": 500,
  "schema": "CREATE TABLE users (...); CREATE TABLE orders (...);",
  "tables": [
    {
      "name": "users",
      "columns": [
        { "name": "id", "type": "INT" },
        { "name": "name", "type": "VARCHAR" }
      ],
      "sampleData": [
        { "id": 1, "name": "Иван Петров" }
      ]
    }
  ]
}

---

### ⚡ Выполнение и проверка запросов

#### POST `/tasks/{id}/execute`
Выполнить SQL-запрос (кнопка "Run" в интерфейсе).

**Request:**

{
  "query": "SELECT name FROM users WHERE status = 'active'"
}

**Response (200):**

{
  "status": "success",
  "data": [
    { "name": "Иван Петров" },
    { "name": "Мария Сидорова" }
  ],
  "execution_time": 0.045
}

**Response при ошибке (200):**

{
  "status": "error",
  "message": "ERROR: column \"status\" does not exist"
}

**Важно:**
- Выполнять в изолированной среде (sandbox)
- Таймаут: 3 секунды
- Только SELECT-запросы
- Запрет: INSERT, UPDATE, DELETE, DROP, ALTER

#### POST `/tasks/{id}/submit`
Отправить решение на проверку.

**Request:**

{
  "query": "SELECT name, COUNT(*) FROM users GROUP BY name"
}

**Response (200):**

{
  "is_correct": true,
  "points_earned": 100,
  "new_total_points": 550,
  "expected_result": [
    { "name": "Иван Петров", "count": 1 },
    { "name": "Мария Сидорова", "count": 1 }
  ]
}

**Логика проверки:**
1. Создать временную БД с тестовыми данными
2. Выполнить запрос участника
3. Выполнить эталонный запрос (из `tasks.expected_result`)
4. Сравнить результаты:
   - Количество строк должно совпадать
   - Названия колонок могут отличаться (если использованы алиасы)
   - Порядок строк не важен
   - Значения должны совпадать с точностью до типов данных
5. Если совпало: `is_correct: true`, начислить баллы
6. Всегда возвращать `expected_result` для отображения пользователю

---

### 🏆 Лидерборд

#### GET `/leaderboard`
Получить топ участников.

**Response (200):**

[
  {
    "rank": 1,
    "username": "Алексей Смирнов",
    "total_points": 1250,
    "solved_tasks": 8,
    "avg_time": 0.45,
    "avatar": "АС"
  }
]

#### WebSocket `/ws/leaderboard`
Реалтайм-обновления лидерборда.

**Подключение:**

const ws = new WebSocket('ws://localhost:8000/ws/leaderboard');

**Сообщение от сервера:**

{
  "type": "leaderboard_update",
  "data": [
    { "rank": 1, "username": "...", "total_points": 1300 }
  ]
}

**Когда отправлять:**
- После успешной проверки решения (submit)
- Каждые 5 секунд для синхронизации

---

### 👥 Админка

#### GET `/admin/users`
Получить список всех пользователей.

**Response (200):**

[
  {
    "id": 1,
    "username": "ivan.petrov",
    "email": "ivan@cdek.digital",
    "rating": 1250,
    "total_points": 450,
    "assigned_task_id": 3
  }
]

#### POST `/admin/users/{user_id}/assign`
Назначить задачу пользователю.

**Request:**

{
  "task_id": 3
}

**Response (200):**

{
  "success": true,
  "message": "Задача назначена"
}

#### POST `/admin/users/{user_id}/clear`
Снять назначение задачи.

**Response (200):**

{
  "success": true,
  "message": "Назначение снято"
}

#### GET `/user/assigned-task`
Получить назначенную задачу (для лобби).

**Response (200) если задача назначена:**

{
  "id": 3,
  "title": "Анализ заказов клиентов",
  "difficulty": "hard",
  "points": 500
}

**Response (404) если задача не назначена:**

{
  "error": "Task not assigned"
}

#### GET `/admin/tasks`
Получить все задачи для админки.

**Response (200):**

[
  {
    "id": 1,
    "title": "Найди активных хакеров",
    "difficulty": "easy",
    "points": 100,
    "description": "...",
    "schema": "...",
    "tables": [...],
    "expected_result": [...]
  }
]

#### POST `/admin/tasks`
Создать новую задачу.

**Request:**

{
  "title": "Новая задача",
  "description": "Описание задачи",
  "difficulty": "medium",
  "points": 250,
  "schema": "CREATE TABLE ...",
  "tables": [...],
  "expected_result": [...]
}

**Response (201):**

{
  "id": 10,
  "title": "Новая задача",
  "success": true
}

---

## 🔐 Безопасность

### Sandbox для SQL-запросов

Каждый запрос участника должен выполняться в изолированной среде:

# Пример на Python с SQLite
import sqlite3
import tempfile

def execute_sql_in_sandbox(query: str, schema: str, test_data: list):
    # Создаём временную БД
    with tempfile.NamedTemporaryFile(suffix='.db') as tmp:
        conn = sqlite3.connect(tmp.name)
        
        # Создаём схему
        conn.executescript(schema)
        
        # Загружаем тестовые данные
        for table_data in test_data:
            # INSERT statements...
            pass
        
        # Выполняем запрос с таймаутом
        conn.settimeout(3)  # 3 секунды
        cursor = conn.execute(query)
        result = cursor.fetchall()
        
        conn.close()
        return result

### Валидация запросов

FORBIDDEN_KEYWORDS = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE']

def validate_query(query: str) -> bool:
    query_upper = query.upper()
    for keyword in FORBIDDEN_KEYWORDS:
        if keyword in query_upper:
            return False
    return True

### JWT-токены

from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

---

## 🚀 Инструкция по запуску

### Frontend (этот репозиторий)

# Клонировать репозиторий
git clone https://github.com/your-username/sql-battle.git
cd sql-battle

# Установить зависимости
npm install

# Создать .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Запустить dev-сервер
npm run dev

# Открыть http://localhost:3000

### Backend (отдельный репозиторий)

# Клонировать репозиторий бэкенда
git clone https://github.com/your-username/sql-battle-backend.git
cd sql-battle-backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Установить зависимости
pip install -r requirements.txt

# Настроить .env
echo "DATABASE_URL=postgresql://user:pass@localhost/sql_battle" > .env
echo "SECRET_KEY=your-secret-key" >> .env

# Запустить миграции
alembic upgrade head

# Запустить сервер
uvicorn main:app --reload --host 0.0.0.0 --port 8000

---

## 📝 Переключение между моками и реальным API

В файле `lib/api.ts`:

// Режим моков (для разработки без бэкенда)
const USE_MOCKS = true;

// Режим реального API (для продакшена)
const USE_MOCKS = false;

---

## 🎨 Брендинг

Логотип **cdek_digital** отображается на всех страницах:
- Файл: `public/cdek_digital.svg`
- Компонент: `components/Logo.tsx`
- Используется в хедере, welcome-странице, login-странице

---

## 📞 Контакты

Разработчик: [Ваше имя]  
Email: [your-email@cdek.digital]  
GitHub: [your-username]

---

## 📄 Лицензия

MIT License - свободно для использования в рамках cdek_digital.

---

**Удачи на IT-слёте! 🚀**
