// app/(arena)/lobby/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Clock, Zap, Shield } from "lucide-react"
import { getAssignedTask } from "@/lib/api"
import { simulateAdminAssignTask } from "@/lib/mock-data"
import { toast } from "sonner"

export default function LobbyPage() {
    const router = useRouter()
    const [assignedTask, setAssignedTask] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkTask = async () => {
            try {
                const task = await getAssignedTask()
                if (task) {
                    setAssignedTask(task)
                }
                // 🎯 ВАЖНО: Всегда снимаем загрузку после проверки
                setIsLoading(false)
            } catch (error) {
                console.error("Ошибка проверки задачи", error)
                setIsLoading(false) // Даже при ошибке снимаем загрузку
            }
        }

        // Первая проверка
        checkTask()

        // Опрос сервера каждые 3 секунды (поллинг)
        const interval = setInterval(checkTask, 3000)

        return () => clearInterval(interval)
    }, [])

    const handleStartBattle = () => {
        // Сохраняем время начала битвы для таймера (5 минут = 300 секунд)
        localStorage.setItem("battle_start_time", Date.now().toString())
        localStorage.setItem("battle_duration", "300")

        toast.success("Задача получена!", { description: "У вас есть 5 минут. Удачи!" })
        router.push(`/battle?taskId=${assignedTask.id}`)
    }

    // --- Состояние загрузки ---
    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
                <p className="text-zinc-400 animate-pulse">Проверка статуса...</p>
            </div>
        )
    }

    // --- Состояние ожидания ---
    if (!assignedTask) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
                <Card className="bg-zinc-900/80 backdrop-blur border-zinc-800 max-w-md w-full text-center">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                            <Clock className="h-8 w-8 text-blue-400 animate-pulse" />
                        </div>
                        <CardTitle className="text-zinc-100">Ожидание задачи</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-zinc-400">
                            Администратор еще не назначил вам задачу. Пожалуйста, оставайтесь в этом окне.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Автоматическое обновление каждые 3 сек...</span>
                        </div>

                        {/* КНОПКА ДЛЯ ТЕСТА (удалишь перед слетом или скроешь) */}
                        <div className="pt-4 border-t border-zinc-800">
                            <p className="text-xs text-zinc-600 mb-2">Панель разработчика (Тест)</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50"
                                onClick={() => {
                                    simulateAdminAssignTask()
                                    toast.info("Задача назначена админом!")
                                }}
                            >
                                <Shield className="mr-2 h-4 w-4" />
                                Симулировать назначение задачи
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // --- Состояние готовности ---
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
            <Card className="bg-zinc-900/80 backdrop-blur border-emerald-500/30 max-w-lg w-full shadow-2xl shadow-emerald-900/20">
                <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                        <Zap className="h-8 w-8 text-emerald-400" />
                    </div>
                    <CardTitle className="text-center text-emerald-400">Задача назначена!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                    <div>
                        <h3 className="text-xl font-bold text-zinc-100 mb-2">{assignedTask.title}</h3>
                        <div className="flex justify-center gap-2">
                            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                                {assignedTask.difficulty === 'easy' ? 'Легко' : assignedTask.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                            </Badge>
                            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                                {assignedTask.points} баллов
                            </Badge>
                        </div>
                    </div>

                    <p className="text-zinc-400 text-sm">
                        У вас есть <span className="text-emerald-400 font-bold">5 минут</span> на выполнение.
                        Таймер запустится сразу после нажатия кнопки.
                    </p>

                    <Button
                        onClick={handleStartBattle}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-6 transition-all active:scale-95 shadow-lg shadow-emerald-900/30"
                    >
                        <Zap className="mr-2 h-5 w-5" />
                        Начать выполнение задачи
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}