// app/(arena)/leaderboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Crown, Users, Clock, Target, Loader2 } from "lucide-react"
import { getLeaderboard, connectLeaderboardWebSocket } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { toast } from "sonner"

interface LeaderboardEntry {
    rank: number
    username: string
    totalPoints: number
    solvedTasks: number
    avgTime: number
    avatar: string
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const currentUser = getUser()

    useEffect(() => {
        async function loadLeaderboard() {
            try {
                const data = await getLeaderboard()
                setLeaderboard(data)
            } catch (error) {
                toast.error("Ошибка загрузки лидерборда")
            } finally {
                setIsLoading(false)
            }
        }

        loadLeaderboard()

        // Подключаем WebSocket для реалтайм-обновлений
        const ws = connectLeaderboardWebSocket((updatedData) => {
            setLeaderboard(updatedData)
            toast.info("Лидерборд обновлен!", { duration: 2000 })
        })

        return () => {
            if (ws) ws.close()
        }
    }, [])

    // Функция для получения цвета медали
    const getMedalColor = (rank: number) => {
        if (rank === 1) return "from-yellow-400 to-yellow-600"
        if (rank === 2) return "from-zinc-300 to-zinc-500"
        if (rank === 3) return "from-orange-400 to-orange-600"
        return ""
    }

    // Функция для получения иконки медали
    const getMedalIcon = (rank: number) => {
        if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />
        if (rank === 2) return <Medal className="h-6 w-6 text-zinc-300" />
        if (rank === 3) return <Medal className="h-6 w-6 text-orange-400" />
        return null
    }

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center text-zinc-500 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                <p className="text-sm animate-pulse">Загрузка лидерборда...</p>
            </div>
        )
    }

    // Статистика
    const totalParticipants = leaderboard.length
    const totalPoints = leaderboard.reduce((sum, entry) => sum + entry.totalPoints, 0)
    const avgSolvedTasks = (leaderboard.reduce((sum, entry) => sum + entry.solvedTasks, 0) / totalParticipants).toFixed(1)

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Заголовок */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-yellow-400" />
                        Лидерборд
                    </h1>
                    <p className="text-zinc-400 mt-1">Топ участников SQL-баттла</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-4 py-2">
                    <Users className="mr-2 h-4 w-4" />
                    {totalParticipants} участников
                </Badge>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <Target className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-zinc-100">{totalPoints}</div>
                                <div className="text-xs text-zinc-500 uppercase">Всего баллов</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Clock className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-zinc-100">{avgSolvedTasks}</div>
                                <div className="text-xs text-zinc-500 uppercase">Среднее задач</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Trophy className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-zinc-100">{leaderboard[0]?.totalPoints || 0}</div>
                                <div className="text-xs text-zinc-500 uppercase">Лидер</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Таблица лидерборда */}
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardHeader className="border-b border-zinc-800">
                    <CardTitle className="text-emerald-400">Рейтинг участников</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/50">
                                <TableHead className="text-zinc-400 w-20 text-center">Место</TableHead>
                                <TableHead className="text-zinc-400">Участник</TableHead>
                                <TableHead className="text-zinc-400 text-center">Решено задач</TableHead>
                                <TableHead className="text-zinc-400 text-center">Среднее время</TableHead>
                                <TableHead className="text-zinc-400 text-right">Баллы</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboard.map((entry) => {
                                const isCurrentUser = currentUser?.username === entry.username
                                const isTop3 = entry.rank <= 3

                                return (
                                    <TableRow
                                        key={entry.rank}
                                        className={`
                      border-zinc-800 transition-all duration-300
                      ${isCurrentUser ? "bg-emerald-500/10 border-l-4 border-l-emerald-500" : ""}
                      ${isTop3 ? "hover:bg-zinc-800/70" : "hover:bg-zinc-800/50"}
                    `}
                                    >
                                        {/* Место */}
                                        <TableCell className="text-center">
                                            {isTop3 ? (
                                                <div className="flex items-center justify-center">
                                                    <div className={`relative p-2 rounded-full bg-gradient-to-br ${getMedalColor(entry.rank)}`}>
                                                        {getMedalIcon(entry.rank)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-zinc-500 font-mono text-lg">#{entry.rank}</span>
                                            )}
                                        </TableCell>

                                        {/* Участник */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className={`h-10 w-10 ${isTop3 ? "border-2 border-yellow-500/50" : "border border-zinc-700"}`}>
                                                    <AvatarFallback className={isTop3 ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400" : "bg-zinc-800 text-zinc-400"}>
                                                        {entry.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className={`font-semibold ${isCurrentUser ? "text-emerald-400" : "text-zinc-200"}`}>
                                                        {entry.username}
                                                        {isCurrentUser && (
                                                            <Badge variant="outline" className="ml-2 text-xs border-emerald-500/50 text-emerald-400">
                                                                Вы
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Решено задач */}
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                                                {entry.solvedTasks}
                                            </Badge>
                                        </TableCell>

                                        {/* Среднее время */}
                                        <TableCell className="text-center font-mono text-zinc-400">
                                            {entry.avgTime.toFixed(2)}с
                                        </TableCell>

                                        {/* Баллы */}
                                        <TableCell className="text-right">
                                            <span className={`text-xl font-bold ${isTop3 ? "text-yellow-400" : "text-emerald-400"}`}>
                                                {entry.totalPoints}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Подсказка про WebSocket */}
            <div className="text-center text-xs text-zinc-600">
                💡 Лидерборд обновляется в реальном времени через WebSocket (когда подключен бэкенд)
            </div>
        </div>
    )
}