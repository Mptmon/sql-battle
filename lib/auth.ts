// lib/auth.ts

const TOKEN_KEY = "sql_battle_token";
const USER_KEY = "sql_battle_user";

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

// Явно указываем, что возвращаем объект со строковыми ключами и значениями
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { "Authorization": `Bearer ${token}` };
  }
  return {};
}