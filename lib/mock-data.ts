// lib/mock-data.ts

export const mockUser = {
    id: 1,
    username: "Иван Петров",
    email: "ivan.petrov@company.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
    rating: 1250,
    totalPoints: 450,
    rank: 3,
    solvedTasks: [1, 2, 5],
    role: "participant"
};

export const mockTasks = [
    {
        id: 1,
        title: "Найди активных хакеров",
        difficulty: "easy",
        points: 100,
        status: "solved",
        description: "Напишите запрос, который вернёт список имён всех активных хакеров (status = 'active').",
        schema: "CREATE TABLE hackers (\n  id INT,\n  name VARCHAR,\n  status VARCHAR\n);",
        tables: [
            {
                name: "hackers",
                columns: [
                    { name: "id", type: "INT" },
                    { name: "name", type: "VARCHAR" },
                    { name: "status", type: "VARCHAR" }
                ],
                sampleData: [
                    { id: 1, name: "Алексей", status: "active" },
                    { id: 2, name: "Мария", status: "inactive" },
                    { id: 3, name: "Дмитрий", status: "active" }
                ]
            }
        ],
        expectedResult: [
            { name: "Алексей" },
            { name: "Дмитрий" }
        ],
        userResult: {
            execution_time: 0.12,
            points_earned: 100,
            date: "2026-09-06"
        }
    },
    {
        id: 2,
        title: "Топ-10 самых дорогих заказов",
        difficulty: "medium",
        points: 250,
        status: "solved",
        description: "Напишите запрос, который вернёт 10 самых дорогих заказов с указанием ID клиента и суммы заказа. Отсортируйте по убыванию суммы.",
        schema: "CREATE TABLE orders (\n  id INT,\n  client_id INT,\n  amount DECIMAL,\n  created_at TIMESTAMP\n);",
        tables: [
            {
                name: "orders",
                columns: [
                    { name: "id", type: "INT" },
                    { name: "client_id", type: "INT" },
                    { name: "amount", type: "DECIMAL" },
                    { name: "created_at", type: "TIMESTAMP" }
                ],
                sampleData: [
                    { id: 1, client_id: 101, amount: 1500.50, created_at: "2026-09-01 10:30:00" },
                    { id: 2, client_id: 102, amount: 2300.00, created_at: "2026-09-02 14:15:00" },
                    { id: 3, client_id: 103, amount: 890.75, created_at: "2026-09-03 09:45:00" }
                ]
            }
        ],
        expectedResult: [
            { client_id: 102, amount: 2300.00 },
            { client_id: 101, amount: 1500.50 },
            { client_id: 103, amount: 890.75 }
        ],
        userResult: {
            execution_time: 0.45,
            points_earned: 250,
            date: "2026-09-06"
        }
    },
    {
        id: 3,
        title: "Анализ заказов клиентов",
        difficulty: "hard",
        points: 500,
        status: "unsolved",
        description: "Напишите запрос, который вернёт имя клиента, общую сумму его заказов и количество заказов. Выведите только тех клиентов, у которых более 2 заказов. Отсортируйте по общей сумме по убыванию.",
        schema: `CREATE TABLE users (
  id INT,
  name VARCHAR,
  email VARCHAR
);

CREATE TABLE orders (
  id INT,
  user_id INT,
  total_amount DECIMAL,
  created_at TIMESTAMP
);

CREATE TABLE order_items (
  id INT,
  order_id INT,
  product_name VARCHAR,
  quantity INT,
  price DECIMAL
);`,
        tables: [
            {
                name: "users",
                columns: [
                    { name: "id", type: "INT" },
                    { name: "name", type: "VARCHAR" },
                    { name: "email", type: "VARCHAR" }
                ],
                sampleData: [
                    { id: 1, name: "Иван Петров", email: "ivan@mail.ru" },
                    { id: 2, name: "Мария Сидорова", email: "maria@mail.ru" },
                    { id: 3, name: "Дмитрий Козлов", email: "dmitry@mail.ru" }
                ]
            },
            {
                name: "orders",
                columns: [
                    { name: "id", type: "INT" },
                    { name: "user_id", type: "INT" },
                    { name: "total_amount", type: "DECIMAL" },
                    { name: "created_at", type: "TIMESTAMP" }
                ],
                sampleData: [
                    { id: 101, user_id: 1, total_amount: 1500.50, created_at: "2026-09-01 10:30:00" },
                    { id: 102, user_id: 1, total_amount: 2300.00, created_at: "2026-09-02 14:15:00" },
                    { id: 103, user_id: 2, total_amount: 890.75, created_at: "2026-09-03 09:45:00" },
                    { id: 104, user_id: 1, total_amount: 450.00, created_at: "2026-09-04 16:20:00" }
                ]
            },
            {
                name: "order_items",
                columns: [
                    { name: "id", type: "INT" },
                    { name: "order_id", type: "INT" },
                    { name: "product_name", type: "VARCHAR" },
                    { name: "quantity", type: "INT" },
                    { name: "price", type: "DECIMAL" }
                ],
                sampleData: [
                    { id: 1, order_id: 101, product_name: "Ноутбук", quantity: 1, price: 1500.50 },
                    { id: 2, order_id: 102, product_name: "Монитор", quantity: 2, price: 1150.00 },
                    { id: 3, order_id: 103, product_name: "Клавиатура", quantity: 1, price: 890.75 },
                    { id: 4, order_id: 102, product_name: "Мышь", quantity: 1, price: 0.00 }
                ]
            }
        ],
        expectedResult: [
            { name: "Иван Петров", total_sum: 4250.50, order_count: 3 }
        ],
        userResult: null
    },
    {
        id: 5,
        title: "Анализ логов безопасности",
        difficulty: "hard",
        points: 500,
        status: "solved",
        description: "Напишите запрос, который найдёт все IP-адреса, с которых было более 5 неудачных попыток входа за последний час.",
        schema: "CREATE TABLE login_attempts (\n  id INT,\n  ip_address VARCHAR,\n  success BOOLEAN,\n  attempt_time TIMESTAMP\n);",
        tables: [
            {
                name: "login_attempts",
                columns: [
                    { name: "id", type: "INT" },
                    { name: "ip_address", type: "VARCHAR" },
                    { name: "success", type: "BOOLEAN" },
                    { name: "attempt_time", type: "TIMESTAMP" }
                ],
                sampleData: [
                    { id: 1, ip_address: "192.168.1.100", success: false, attempt_time: "2026-09-06 10:00:00" },
                    { id: 2, ip_address: "192.168.1.100", success: false, attempt_time: "2026-09-06 10:01:00" },
                    { id: 3, ip_address: "192.168.1.101", success: true, attempt_time: "2026-09-06 10:02:00" }
                ]
            }
        ],
        expectedResult: [
            { ip_address: "192.168.1.100", failed_attempts: 6 }
        ],
        userResult: {
            execution_time: 1.20,
            points_earned: 500,
            date: "2026-09-05"
        }
    }
];

export const mockLeaderboard = [
    { rank: 1, username: "Алексей Смирнов", totalPoints: 1250, solvedTasks: 8, avgTime: 0.45, avatar: "АС" },
    { rank: 2, username: "Мария Иванова", totalPoints: 1100, solvedTasks: 7, avgTime: 0.52, avatar: "МИ" },
    { rank: 3, username: "Дмитрий Козлов", totalPoints: 950, solvedTasks: 6, avgTime: 0.61, avatar: "ДК" },
    { rank: 4, username: "Елена Петрова", totalPoints: 800, solvedTasks: 5, avgTime: 0.73, avatar: "ЕП" },
    { rank: 5, username: "Сергей Волков", totalPoints: 750, solvedTasks: 5, avgTime: 0.68, avatar: "СВ" },
    { rank: 6, username: "Анна Соколова", totalPoints: 600, solvedTasks: 4, avgTime: 0.82, avatar: "АС" },
    { rank: 7, username: "Иван Морозов", totalPoints: 550, solvedTasks: 4, avgTime: 0.79, avatar: "ИМ" },
    { rank: 8, username: "Ольга Новикова", totalPoints: 450, solvedTasks: 3, avgTime: 0.91, avatar: "ОН" },
    { rank: 9, username: "Павел Федоров", totalPoints: 400, solvedTasks: 3, avgTime: 0.88, avatar: "ПФ" },
    { rank: 10, username: "Наталья Орлова", totalPoints: 350, solvedTasks: 2, avgTime: 1.05, avatar: "НО" },
];

export let mockAssignedTask: any = null;

export function simulateAdminAssignTask() {
    mockAssignedTask = {
        id: 3,
        title: "Анализ заказов клиентов",
        description: "Напишите запрос, который вернёт имя клиента, общую сумму его заказов и количество заказов.",
        schema: "CREATE TABLE users (...);",
        points: 500,
        difficulty: "hard"
    };
}

export function simulateAdminClearTask() {
    mockAssignedTask = null;
}
// lib/mock-data.ts (добавить в конец)

export const mockUsers = [
    { id: 1, username: "Иван Петров", email: "ivan@mail.ru", rating: 1250, totalPoints: 450 },
    { id: 2, username: "Мария Сидорова", email: "maria@mail.ru", rating: 1100, totalPoints: 350 },
    { id: 3, username: "Дмитрий Козлов", email: "dmitry@mail.ru", rating: 950, totalPoints: 250 },
    { id: 4, username: "Елена Волкова", email: "elena@mail.ru", rating: 800, totalPoints: 150 },
];

// Хранилище назначенных задач (userId -> taskId)
export let mockAssignments: Record<number, number> = {};

export function assignTaskToUser(userId: number, taskId: number) {
    mockAssignments[userId] = taskId;
}

export function clearUserAssignment(userId: number) {
    delete mockAssignments[userId];
}

export function getUserAssignment(userId: number): number | null {
    return mockAssignments[userId] || null;
}