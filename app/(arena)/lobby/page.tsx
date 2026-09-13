"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Clock, Zap, Bomb, Play, Trophy, Hourglass } from "lucide-react"
import { getSettings } from "@/lib/api"
import { toast } from "sonner"

export default function LobbyPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [timeLeft, setTimeLeft] = useState(0)
    const [phase, setPhase] = useState<'waiting' | 'ready' | 'completed' | 'finished'>('waiting')

    useEffect(() => {
        async function fetchTournamentStatus() {
            // Дефолтные значения на случай, если бэкенд не отвечает
            // По умолчанию считаем, что турнир уже начался и закончится через 2 часа
            let startTime = new Date(Date.now() - 1000)
            let endTime = new Date(Date.now() + 2 * 60 * 60 * 1000)

            try {
                const settings = await getSettings()
                if (settings?.battle_start) {
                    startTime = new Date(settings.battle_start)
                }
                if (settings?.battle_end) {
                    endTime = new Date(settings.battle_end)
                } else if (settings?.battle_start) {
                    endTime = new Date(startTime.getTime() + 60 * 60 * 1000)
                }
            } catch (error) {
                console.warn("⚠️ Бэкенд недоступен, используются тестовые таймеры")
            }


            // Сохраняем времена в localStorage для layout.tsx
            localStorage.setItem("tournament_start", startTime.toISOString())
            localStorage.setItem("tournament_end", endTime.toISOString())

            setIsLoading(false)

            const updateTimer = () => {
                const now = new Date().getTime()
                const startDistance = startTime.getTime() - now
                const endDistance = endTime.getTime() - now

                if (endDistance < 0) {
                    // Турнир завершен
                    setTimeLeft(0)
                    setPhase('finished')
                    localStorage.removeItem("isTournamentActive")
                    localStorage.removeItem("allTasksCompleted") // Сбрасываем флаг
                } else if (startDistance < 0) {
                    // Турнир идет
                    setTimeLeft(0)
                    const allTasksCompleted = localStorage.getItem("allTasksCompleted") === "true"
                    if (allTasksCompleted) {
                        setPhase('completed')
                    } else {
                        setPhase('ready')
                    }
                } else {
                    // Ожидание старта — сбрасываем флаг, так как турнир еще не начался
                    localStorage.removeItem("allTasksCompleted")
                    setTimeLeft(Math.floor(startDistance / 1000))
                    setPhase('waiting')
                }
            }

            updateTimer()
            const interval = setInterval(updateTimer, 1000)

            return () => clearInterval(interval)
        }

        fetchTournamentStatus()
    }, [])

    const handleStartTournament = () => {
        localStorage.setItem("battle_start_time", Date.now().toString())
        localStorage.setItem("battle_duration", "300")
        localStorage.setItem("isTournamentActive", "true")

        toast.success("Турнир начался! Удачи!", { description: "Первая задача уже ждет вас." })
        router.push("/battle")
    }

    const handleViewResults = () => {
        localStorage.removeItem("isTournamentActive")
        localStorage.removeItem("allTasksCompleted")
        router.push("/leaderboard")
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
                <p className="text-zinc-400 animate-pulse">Синхронизация с сервером турнира...</p>
            </div>
        )
    }

    // СОСТОЯНИЕ 1: Ожидание начала турнира (таймер тикает)
    if (phase === 'waiting') {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
                <Card className="bg-zinc-900/90 backdrop-blur border-red-900/50 max-w-md w-full text-center shadow-2xl shadow-red-900/10">
                    <CardHeader>
                        <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4 animate-pulse">
                            <Bomb className="h-10 w-10 text-red-500" />
                        </div>
                        <CardTitle className="text-zinc-100 text-2xl">Ожидание начала турнира</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="py-4">
                            <div className="text-7xl font-mono font-bold text-red-500 tracking-wider tabular-nums">
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest">До старта</p>
                        </div>

                        <p className="text-zinc-400 text-sm">
                            Пожалуйста, не закрывайте эту вкладку. Как только таймер истечет,
                            вам будет предоставлен доступ к первой задаче.
                        </p>

                        <Button disabled className="w-full bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed">
                            <Clock className="mr-2 h-4 w-4" />
                            Ожидание команды администратора...
                        </Button>

                        {/* Подсказка для тестирования */}
                        <div className="pt-4 border-t border-zinc-800">
                            <p className="text-xs text-zinc-600 mb-2">💡 Тестовый режим (бэкенд недоступен)</p>
                            <p className="text-xs text-zinc-700">Старт через 10 сек, конец через 60 сек</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // СОСТОЯНИЕ 2: Турнир начался — кнопка активна
    if (phase === 'ready') {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
                <Card className="bg-zinc-900/90 backdrop-blur border-emerald-500/50 max-w-lg w-full shadow-2xl shadow-emerald-900/30 animate-in fade-in zoom-in-95 duration-500">
                    <CardHeader>
                        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Zap className="h-10 w-10 text-emerald-400" />
                        </div>
                        <CardTitle className="text-center text-emerald-400 text-3xl">Турнир начался!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <p className="text-zinc-300 text-lg">
                            Первая задача уже назначена и ждет вас на арене.
                        </p>
                        <div className="flex justify-center gap-2">
                            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 px-4 py-1">
                                Режим: Турнир
                            </Badge>
                        </div>

                        <Button
                            onClick={handleStartTournament}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl py-8 transition-all active:scale-95 shadow-lg shadow-emerald-900/40 group"
                        >
                            <Play className="mr-3 h-6 w-6 fill-current group-hover:scale-110 transition-transform" />
                            ПРИСТУПИТЬ К РЕШЕНИЮ
                        </Button>

                        <p className="text-xs text-zinc-600 mt-4">
                            У вас будет 5 минут на каждую задачу. Удачи!
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // СОСТОЯНИЕ 3: Все задачи решены, ожидание конца турнира
    if (phase === 'completed') {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
                <Card className="bg-zinc-900/90 backdrop-blur border-blue-500/50 max-w-lg w-full shadow-2xl shadow-blue-900/30 animate-in fade-in zoom-in-95 duration-500">
                    <CardHeader>
                        <div className="mx-auto w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                            <Hourglass className="h-10 w-10 text-blue-400 animate-pulse" />
                        </div>
                        <CardTitle className="text-center text-blue-400 text-3xl">Отличная работа!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <p className="text-zinc-300 text-lg">
                            Все назначенные задачи выполнены. Ожидайте окончания турнира и подведения итогов.
                        </p>
                        <div className="flex justify-center gap-2">
                            <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 px-4 py-1">
                                Задачи завершены
                            </Badge>
                        </div>

                        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                            <p className="text-sm text-zinc-400">
                                💡 Результаты будут доступны после официального завершения турнира.
                            </p>
                        </div>

                        <Button disabled className="w-full bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed">
                            <Hourglass className="mr-2 h-4 w-4 animate-spin" />
                            Ожидание окончания турнира...
                        </Button>

                        <p className="text-xs text-zinc-600 mt-4">
                            Профиль и лидерборд станут доступны после подведения итогов.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // СОСТОЯНИЕ 4: Турнир завершен — можно смотреть результаты
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
            <Card className="bg-zinc-900/90 backdrop-blur border-yellow-500/50 max-w-lg w-full shadow-2xl shadow-yellow-900/30 animate-in fade-in zoom-in-95 duration-500">
                <CardHeader>
                    <div className="mx-auto w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                        <Trophy className="h-10 w-10 text-yellow-400" />
                    </div>
                    <CardTitle className="text-center text-yellow-400 text-3xl">Турнир завершен!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <p className="text-zinc-300 text-lg">
                        Время вышло. Результаты готовы к просмотру.
                    </p>

                    <Button
                        onClick={handleViewResults}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xl py-8 transition-all active:scale-95 shadow-lg shadow-yellow-900/40 group"
                    >
                        <Trophy className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                        ОЗНАКОМИТЬСЯ С РЕЗУЛЬТАТАМИ
                    </Button>

                    <p className="text-xs text-zinc-600 mt-4">
                        После просмотра результатов вы сможете свободно перемещаться по профилю и лидерборду.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}