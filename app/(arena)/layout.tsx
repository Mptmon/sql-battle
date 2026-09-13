"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { getUser, isAuthenticated, logout } from "@/lib/auth"
import type { User as UserType } from "@/lib/auth"
import Timer from "@/components/Timer"
import Logo from "@/components/Logo"
import { toast } from "sonner"

export default function ArenaLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<UserType | null>(null)
    const [isAuth, setIsAuth] = useState(false)
    const [isTournamentActive, setIsTournamentActive] = useState(false)

    useEffect(() => {
        const auth = isAuthenticated()
        setIsAuth(auth)
        setUser(getUser())

        const publicRoutes = ["/login", "/welcome"]

        if (!auth && !publicRoutes.includes(pathname)) {
            router.replace("/login")
        }

        // Проверяем статус турнира через localStorage (устанавливается лобби)
        const checkTournamentStatus = () => {
            const startStr = localStorage.getItem("tournament_start")
            const endStr = localStorage.getItem("tournament_end")
            const allTasksCompleted = localStorage.getItem("allTasksCompleted") === "true"

            if (!startStr || !endStr) {
                setIsTournamentActive(false)
                return
            }

            const now = new Date().getTime()
            const startTime = new Date(startStr).getTime()
            const endTime = new Date(endStr).getTime()

            // Турнир активен между start и end
            const isBetweenStartAndEnd = now >= startTime && now < endTime

            // Вкладки скрыты если: турнир идет ИЛИ все задачи решены (но турнир еще не закончился)
            const shouldHideTabs = isBetweenStartAndEnd || allTasksCompleted
            setIsTournamentActive(shouldHideTabs)

            //  НОВОЕ: Если турнир завершен и мы на арене — редирект в лобби
            if (now >= endTime && pathname === "/battle") {
                toast.info("Турнир завершен", {
                    description: "Время вышло. Возврат в лобби для просмотра результатов."
                })
                localStorage.removeItem("isTournamentActive")
                router.replace("/lobby")
                return
            }

            // Блокировка ручного перехода в профиль/лидерборд
            if (shouldHideTabs && (pathname === "/profile" || pathname === "/leaderboard")) {
                toast.warning("Доступ ограничен", {
                    description: "Нельзя переходить в профиль или лидерборд до завершения турнира!"
                })
                router.replace("/lobby")
            }
        }

        checkTournamentStatus()
        // Проверяем каждую секунду, чтобы вовремя переключить состояние
        const interval = setInterval(checkTournamentStatus, 1000)

        return () => clearInterval(interval)
    }, [pathname, router])

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    if (pathname === "/login" || pathname === "/welcome") {
        return (
            <div className="min-h-screen flex flex-col">
                <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-6 py-3 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <Logo size="sm" showText={false} />
                        <div className="h-6 w-px bg-zinc-800" />
                        <h1 className="text-xl font-bold text-emerald-400 tracking-wider">SQL_BATTLE</h1>
                    </div>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Logo size="sm" showText={false} />
                        <div className="h-6 w-px bg-zinc-800" />
                        <h1 className="text-xl font-bold text-emerald-400 tracking-wider">SQL_BATTLE</h1>
                    </div>
                    {isAuth && (
                        <nav className="hidden md:flex gap-4 text-sm">
                            {!isTournamentActive && (
                                <>
                                    <Link href="/profile" className="text-zinc-300 hover:text-emerald-400 transition">Мой профиль</Link>
                                    <Link href="/leaderboard" className="text-zinc-300 hover:text-emerald-400 transition">Лидерборд</Link>
                                </>
                            )}
                        </nav>
                    )}
                </div>

                {isAuth && user ? (
                    <div className="flex items-center gap-4">
                        {pathname === "/battle" && <Timer />}
                        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                            <span className="text-zinc-300 text-sm hidden sm:block">{user.username}</span>
                            <Avatar className="h-8 w-8 border border-emerald-500">
                                <AvatarFallback className="bg-emerald-900 text-emerald-300">
                                    {user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                                title="Выйти"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button variant="outline" asChild className="bg-zinc-900 border-zinc-700">
                        <Link href="/login">
                            <User className="mr-2 h-4 w-4" />
                            Войти
                        </Link>
                    </Button>
                )}
            </header>

            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    )
}