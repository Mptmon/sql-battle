const TOKEN_KEY = "sql_battle_token";
const USER_KEY = "sql_battle_user";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface User {
  id: number;
  username: string;
  email?: string;
  rating: number;
  totalPoints: number;
  role: "participant" | "admin";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout() {
  clearToken();
  clearUser();
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { "Authorization": `Bearer ${token}` };
  }
  return {};
}

// ==========================================
// РЕАЛЬНЫЕ ФУНКЦИИ С "ДЕТЕКТОРОМ" ОТВЕТА
// ==========================================

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Ошибка входа");
  }

  const data = await res.json();

  // 🔥 ЭТА СТРОКА ПОКАЖЕТ НАМ ТОЧНУЮ СТРУКТУРУ ОТВЕТА В КОНСОЛИ БРАУЗЕРА
  console.log("🔥 ОТВЕТ БЭКЕНДА ПРИ ЛОГИНЕ:", data);

  // Поддерживаем оба частых варианта: { access_token: "..." } или { token: "..." }
  const token = data.access_token || data.token;

  if (!token) {
    throw new Error("Бэкенд не вернул токен в ответе");
  }

  setToken(token);

  // Если бэк вернул данные пользователя внутри ответа
  if (data.user) {
    setUser({
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      rating: data.user.rating || 0,
      totalPoints: data.user.total_points || 0,
      role: data.user.role || "participant",
    });
  } else {
    // Если нет, сохраняем базовые данные (полный профиль подтянется из /api/profile)
    setUser({
      id: 0, // Будет обновлено при первом запросе профиля
      username: username,
      rating: 0,
      totalPoints: 0,
      role: "participant",
    });
  }

  return data;
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Ошибка регистрации");
  }

  const data = await res.json();
  console.log("🔥 ОТВЕТ БЭКЕНДА ПРИ РЕГИСТРАЦИИ:", data);

  const token = data.access_token || data.token;
  if (token) setToken(token);

  if (data.user) {
    setUser({
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      rating: data.user.rating || 0,
      totalPoints: data.user.total_points || 0,
      role: data.user.role || "participant",
    });
  }

  return data;
}