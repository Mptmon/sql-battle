// components/Timer.tsx
"use client"

import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"

export default function Timer() {
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const startTimeStr = localStorage.getItem("battle_start_time")
        const durationStr = localStorage.getItem("battle_duration")

        if (!startTimeStr || !durationStr) {
            // Таймер не запущен (пользователь в лобби или на другой странице)
            setTimeLeft(null)
            setIsActive(false)
            return
        }

        const startTime = parseInt(startTimeStr, 10)
        const duration = parseInt(durationStr, 10)

        // Проверяем, не истёк ли таймер ещё до загрузки страницы
        const now = Date.now()
        const elapsed = Math.floor((now - startTime) / 1000)
        const remaining = duration - elapsed

        if (remaining <= 0) {
            setTimeLeft(0)
            setIsActive(true)
            return
        }

        setTimeLeft(remaining)
        setIsActive(true)

        const interval = setInterval(() => {
            const currentNow = Date.now()
            const currentElapsed = Math.floor((currentNow - startTime) / 1000)
            const currentRemaining = duration - currentElapsed

            if (currentRemaining <= 0) {
                setTimeLeft(0)
                clearInterval(interval)
            } else {
                setTimeLeft(currentRemaining)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [])

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