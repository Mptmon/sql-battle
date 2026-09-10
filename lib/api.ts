// lib/api.ts

import { getAuthHeaders } from "./auth";
import { mockUser, mockTasks, mockLeaderboard } from "./mock-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const USE_MOCKS = false;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 1. АРЕНА (Задачи и выполнение)
// ==========================================

export async function getTasks() {
    if (USE_MOCKS) {
        await delay(300);
        return mockTasks.map(t => ({ id: t.id, title: t.title, difficulty: t.difficulty, points: t.points }));
    }
    const res = await fetch(`${API_BASE_URL}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
}

export async function getTaskById(id: number) {
    if (USE_MOCKS) {
        await delay(300);
        const task = mockTasks.find(t => t.id === id) || mockTasks[0];
        return {
            id: task.id,
            title: task.title,
            description: task.description || "Напишите запрос...",
            schema: task.schema || "CREATE TABLE users (...);",
            tables: task.tables || [],
            expectedResult: task.expectedResult || [],
            points: task.points,
            difficulty: task.difficulty
        };
    }
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch task");
    return res.json();
}

export async function executeQuery(taskId: number, query: string) {
    if (USE_MOCKS) {
        await delay(800);
        if (query.toUpperCase().includes("ERROR")) {
            return { status: "error", message: "ERROR: syntax error at or near \"ERROR\"" };
        }
        return {
            status: "success",
            data: [{ city: "Москва", active_users: 1540 }, { city: "СПб", active_users: 890 }],
            execution_time: 0.04
        };
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders()
    };

    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/execute`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query })
    });
    return res.json();
}

// 🔥 ИЗМЕНЕНИЕ 1: Добавлен параметр timeSpent
export async function submitSolution(taskId: number, query: string, timeSpent: number) {
    if (USE_MOCKS) {
        await delay(1000);
        const task = mockTasks.find(t => t.id === taskId);

        if (!task || !task.expectedResult) {
            return { is_correct: false, points_earned: 0, new_total_points: 0, expected_result: [] };
        }

        const hasGroupBy = query.toUpperCase().includes("GROUP BY");
        const hasJoin = query.toUpperCase().includes("JOIN");
        const isComplexQuery = hasGroupBy || hasJoin;

        if (isComplexQuery) {
            return {
                is_correct: true,
                points_earned: task.points,
                new_total_points: 700,
                expected_result: task.expectedResult
            };
        } else {
            return {
                is_correct: false,
                points_earned: 0,
                new_total_points: 450,
                expected_result: task.expectedResult
            };
        }
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders()
    };

    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/submit`, {
        method: "POST",
        headers: headers,
        // 🔥 ИЗМЕНЕНИЕ 1: Отправляем time_spent на бэкенд
        body: JSON.stringify({ query, time_spent: timeSpent })
    });
    return res.json();
}

// ==========================================
// 2. ПРОФИЛЬ
// ==========================================

export async function getUserProfile() {
    if (USE_MOCKS) {
        await delay(300);
        return mockUser;
    }
    const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();

    return {
        id: data.id,
        username: data.username,
        email: data.email,
        rating: data.rating ?? 0,
        totalPoints: data.total_points ?? data.totalPoints ?? 0,
        solvedTasks: data.solved_tasks ?? data.solvedTasks ?? [],
        role: data.role ?? "participant",
    };
}

// ==========================================
// 3. АДМИНКА
// ==========================================

export async function getAdminTasks() {
    if (USE_MOCKS) {
        await delay(300);
        return mockTasks;
    }
    const res = await fetch(`${API_BASE_URL}/admin/tasks`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch admin tasks");
    return res.json();
}

export async function createTask(data: any) {
    if (USE_MOCKS) {
        await delay(500);
        return { id: Math.random(), ...data };
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders()
    };

    const res = await fetch(`${API_BASE_URL}/admin/tasks`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function getSettings() {
    if (USE_MOCKS) {
        await delay(300);
        return { battle_start: "2026-09-15T10:00:00Z", round_duration_minutes: 120 };
    }
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
}

export async function updateSettings(data: any) {
    if (USE_MOCKS) {
        await delay(500);
        return data;
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders()
    };

    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data)
    });
    return res.json();
}

// ==========================================
// 4. ЛОББИ И НАЗНАЧЕНИЕ ЗАДАЧ
// ==========================================

export async function getAssignedTask() {
    if (USE_MOCKS) {
        await delay(500);
        const { mockAssignedTask } = await import("./mock-data");
        return mockAssignedTask;
    }

    const res = await fetch(`${API_BASE_URL}/user/assigned-task`, {
        headers: getAuthHeaders()
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch assigned task");
    return res.json();
}

// ==========================================
// 5. ЛИДЕРБОРД
// ==========================================

export async function getLeaderboard() {
    if (USE_MOCKS) {
        await delay(500);
        return mockLeaderboard;
    }
    const res = await fetch(`${API_BASE_URL}/leaderboard`);
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    const data = await res.json();

    // 🔥 ИЗМЕНЕНИЕ 2: Заменяем avgTime на totalTimeSpent
    return data.map((entry: any) => ({
        rank: entry.rank,
        username: entry.username,
        avatar: entry.avatar,
        totalPoints: entry.total_points ?? entry.totalPoints ?? 0,
        solvedTasks: entry.solved_tasks ?? entry.solvedTasks ?? 0,
        totalTimeSpent: entry.total_time_spent ?? entry.totalTimeSpent ?? 0,
    }));
}

export function connectLeaderboardWebSocket(onUpdate: (data: any[]) => void) {
    if (USE_MOCKS) {
        console.log("[Mock] WebSocket не подключен (режим моков)");
        return null;
    }

    if (typeof window === "undefined") return null;

    const token = typeof window !== "undefined" ? localStorage.getItem("sql_battle_token") : null;
    const wsBaseUrl = API_BASE_URL.replace('http://', 'ws://').replace('/api', '');
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";
    const wsUrl = `${wsBaseUrl}/ws/leaderboard${tokenQuery}`;

    console.log("🔌 Попытка подключения к WebSocket:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("✅ [WebSocket] Соединение установлено");

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === "leaderboard_update") {
                onUpdate(data.data);
            }
        } catch (e) {
            console.error("Ошибка парсинга WebSocket сообщения", e);
        }
    };

    ws.onerror = (error) => {
        console.error("❌ [WebSocket] Ошибка соединения. Проверьте, что бэкенд запущен и принимает токен в query-параметре.");
    };

    ws.onclose = () => console.log("🔌 [WebSocket] Соединение закрыто");

    return ws;
}

// ==========================================
// 6. УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ И НАЗНАЧЕНИЯМИ
// ==========================================

export async function getAllUsers() {
    if (USE_MOCKS) {
        await delay(300);
        const { mockUsers, mockAssignments } = await import("./mock-data");
        return mockUsers.map(user => ({
            ...user,
            assignedTaskId: mockAssignments[user.id] || null
        }));
    }

    const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
}

export async function assignTask(userId: number, taskId: number) {
    if (USE_MOCKS) {
        await delay(500);
        const { assignTaskToUser } = await import("./mock-data");
        assignTaskToUser(userId, taskId);
        return { success: true };
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders()
    };

    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/assign`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ taskId })
    });
    return res.json();
}

export async function clearAssignment(userId: number) {
    if (USE_MOCKS) {
        await delay(300);
        const { clearUserAssignment } = await import("./mock-data");
        clearUserAssignment(userId);
        return { success: true };
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders()
    };

    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/clear`, {
        method: "POST",
        headers: headers
    });
    return res.json();
}

// ==========================================
// 7. ИСТОРИЯ ПОПЫТОК (ПРОФИЛЬ)
// ==========================================

export async function getUserSubmissionHistory() {
    if (USE_MOCKS) {
        await delay(300);
        return [];
    }
    const res = await fetch(`${API_BASE_URL}/profile/history`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch submission history");
    return res.json();
}