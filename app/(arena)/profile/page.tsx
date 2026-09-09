"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trophy, Clock, Target } from "lucide-react"
import { getUserProfile, getUserSubmissionHistory } from "@/lib/api"

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileData, historyData] = await Promise.all([
                    getUserProfile(),
                    getUserSubmissionHistory()
                ])
                setProfile(profileData)
                setHistory(historyData)
            } catch (error) {
                console.error("Failed to load profile data:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading || !profile) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <span className="ml-2 text-zinc-400">Загрузка профиля...</span>
            </div>
        )
    }

    // --- РАСЧЕТ СТАТИСТИКИ НА ОСНОВЕ ИСТОРИИ ---
    const correctSubmissions = history.filter(h => h.is_correct)
    const solvedTasksCount = correctSubmissions.length

    // Лучший результат (минимальное время среди правильных решений)
    const bestTime = correctSubmissions.length > 0
        ? Math.min(...correctSubmissions.map(h => h.execution_time)).toFixed(2)
        : "0.00"

    // Любимая сложность (та, которую решали чаще всего)
    const difficultyCounts: Record<string, number> = { easy: 0, medium: 0, hard: 0 }
    correctSubmissions.forEach(h => {
        if (difficultyCounts[h.difficulty] !== undefined) {
            difficultyCounts[h.difficulty]++
        }
    })
    const favoriteDifficulty = Object.entries(difficultyCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    const difficultyLabels: Record<string, string> = { easy: "Легкая", medium: "Средняя", hard: "Сложная" }
    const difficultyColors: Record<string, string> = {
        easy: "border-green-500 text-green-400",
        medium: "border-yellow-500 text-yellow-400",
        hard: "border-red-500 text-red-400"
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Шапка профиля */}
            <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300 hover:scale-[1.01] hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20">
                <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-20 w-20 border-2 border-emerald-500">
                        <AvatarImage src={profile.avatarUrl || ""} alt={profile.username} />
                        <AvatarFallback className="text-2xl bg-zinc-800 text-emerald-400">
                            {profile.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-zinc-100">{profile.username}</h2>
                        <p className="text-zinc-400">{profile.email || "Email не указан"}</p>
                        <Badge className="mt-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 capitalize">
                            {profile.role === "admin" ? "Администратор" : "Участник"}
                        </Badge>
                    </div>

                    <div className="flex gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-emerald-400">#{profile.rank || 1}</div>
                            <div className="text-xs text-zinc-500 uppercase">Место</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-zinc-100">{profile.totalPoints}</div>
                            <div className="text-xs text-zinc-500 uppercase">Баллов</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-zinc-100">{profile.rating}</div>
                            <div className="text-xs text-zinc-500 uppercase">Рейтинг</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Статистика и История решений */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Блок "Статистика баттла" (строго по ТЗ) */}
                <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300 hover:scale-[1.01] hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20">
                    <CardHeader>
                        <CardTitle className="text-emerald-400 text-sm uppercase flex items-center gap-2">
                            <Trophy className="h-4 w-4" /> Статистика баттла
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 flex items-center gap-2"><Target className="h-4 w-4" /> Решено задач:</span>
                            <span className="font-bold text-zinc-100 text-lg">{solvedTasksCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 flex items-center gap-2"><Clock className="h-4 w-4" /> Лучший результат:</span>
                            <span className="font-bold text-emerald-400 text-lg">{bestTime} сек</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Любимая сложность:</span>
                            {solvedTasksCount > 0 ? (
                                <Badge variant="outline" className={difficultyColors[favoriteDifficulty]}>
                                    {difficultyLabels[favoriteDifficulty]}
                                </Badge>
                            ) : (
                                <span className="text-zinc-500 text-sm">Нет данных</span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Блок "История решений" (строго по ТЗ) */}
                <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-emerald-400 text-sm uppercase">История решений</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableHead className="text-zinc-400">Название задачи</TableHead>
                                        <TableHead className="text-zinc-400 text-center">Сложность</TableHead>
                                        <TableHead className="text-zinc-400 text-center">Время</TableHead>
                                        <TableHead className="text-zinc-400 text-right">Баллы</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((item) => (
                                        <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                            <TableCell className="font-medium text-zinc-200">
                                                {item.task_title}
                                                {!item.is_correct && <span className="text-red-400 text-xs ml-2">(Неверно)</span>}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={difficultyColors[item.difficulty] || "border-zinc-500 text-zinc-400"}>
                                                    {difficultyLabels[item.difficulty] || item.difficulty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center text-zinc-400 font-mono">
                                                {item.execution_time} сек
                                            </TableCell>
                                            <TableCell className={`text-right font-bold ${item.is_correct ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                                {item.is_correct ? `+${item.points_earned}` : "0"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12 text-zinc-500">
                                <Target className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>История решений пока пуста.</p>
                                <p className="text-sm">Перейди на Арену и реши свою первую задачу!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}