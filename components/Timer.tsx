"use client"

import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"

export default function Timer() {
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        // Функция, которая проверяет localStorage КАЖДУЮ секунду
        const updateTimer = () => {
            const startTimeStr = localStorage.getItem("battle_start_time")
            const durationStr = localStorage.getItem("battle_duration")

            // Если данных нет (пользователь в лобби), сбрасываем состояние
            if (!startTimeStr || !durationStr) {
                setTimeLeft(null)
                setIsActive(false)
                return
            }

            const startTime = parseInt(startTimeStr, 10)
            const duration = parseInt(durationStr, 10)
            const now = Date.now()

            const elapsed = Math.floor((now - startTime) / 1000)
            const remaining = duration - elapsed

            if (remaining <= 0) {
                setTimeLeft(0)
                setIsActive(true)
            } else {
                setTimeLeft(remaining)
                setIsActive(true)
            }
        }

        // Запускаем проверку сразу при монтировании
        updateTimer()

        // И повторяем каждую секунду. 
        // Благодаря этому, как только battle/page.tsx обновит localStorage, 
        // таймер на следующем тике (через макс. 1 сек) увидит новые данные и сбросится!
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, []) // Массив зависимостей пуст, но это ОК, т.к. мы читаем localStorage внутри интервала

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    // Таймер не запущен — показываем прочерки
    if (!isActive || timeLeft === null) {
        return (
            <div className="font-mono text-xl text-zinc-600 bg-zinc-900/50 px-4 py-1 rounded border border-zinc-800">
                --:--
            </div>
        )
    }

    const isUrgent = timeLeft > 0 && timeLeft <= 60
    const isFinished = timeLeft === 0

    return (
        <div
            className={`
        font-mono text-xl px-4 py-1 rounded border flex items-center gap-2 transition-all duration-500
        ${isFinished
                    ? "bg-red-950/50 border-red-500 text-red-400 animate-pulse"
                    : isUrgent
                        ? "bg-red-950/30 border-red-500/50 text-red-400 animate-pulse"
                        : "bg-zinc-900 border-zinc-800 text-emerald-400"
                }
      `}
        >
            {isFinished ? (
                <>
                    <AlertTriangle className="h-5 w-5" />
                    ВРЕМЯ ВЫШЛО
                </>
            ) : (
                <>
                    <Clock className={`h-5 w-5 ${isUrgent ? "text-red-400" : "text-emerald-400"}`} />
                    {formatTime(timeLeft)}
                </>
            )}
        </div>
    )
}