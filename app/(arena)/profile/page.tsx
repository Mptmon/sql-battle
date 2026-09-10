"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Trophy, Clock, Target, LogOut } from "lucide-react"
import { getUserProfile, getUserSubmissionHistory, getLeaderboard } from "@/lib/api"
import { getUser } from "@/lib/auth"

export default function ProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [userRank, setUserRank] = useState<number | null>(null)
    const [totalParticipants, setTotalParticipants] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileData, historyData, leaderboardData] = await Promise.all([
                    getUserProfile(),
                    getUserSubmissionHistory(),
                    getLeaderboard()
                ])

                setProfile(profileData)
                setHistory(historyData)

                // Находим пользователя в лидерборде
                const currentUser = getUser()
                if (currentUser?.username) {
                    const userEntry = leaderboardData.find(
                        (entry: any) => entry.username === currentUser.username
                    )
                    if (userEntry) {
                        setUserRank(userEntry.rank)
                    }
                }
                setTotalParticipants(leaderboardData.length)
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

    // Общее время решения (сумма времени по всем решенным задачам)
    const totalTimeSpent = correctSubmissions.reduce((sum, h) => {
        const time = h.time_spent !== undefined ? h.time_spent : (h.execution_time || 0)
        return sum + time
    }, 0)

    // Функция для красивого форматирования секунд в "Xм YYс"
    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}м ${s.toString().padStart(2, '0')}с`
    }

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

    // Вычисляем процентиль (рейтинг)
    const percentile = userRank && totalParticipants > 1
        ? Math.round(((totalParticipants - userRank) / (totalParticipants - 1)) * 100)
        : 0

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
                            <div className="text-3xl font-bold text-emerald-400">
                                {userRank ? `#${userRank}` : "—"}
                            </div>
                            <div className="text-xs text-zinc-500 uppercase">Место</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-zinc-100">{profile.totalPoints}</div>
                            <div className="text-xs text-zinc-500 uppercase">Баллов</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-zinc-100">{percentile}%</div>
                            <div className="text-xs text-zinc-500 uppercase">Рейтинг</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Статистика и История решений */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Блок "Статистика баттла" */}
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
                            <span className="text-zinc-400 flex items-center gap-2"><Clock className="h-4 w-4" /> Общее время решения:</span>
                            <span className="font-bold text-emerald-400 text-lg">{formatDuration(totalTimeSpent)}</span>
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

                {/* Блок "История решений" */}
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
                                                {formatDuration(item.time_spent !== undefined ? item.time_spent : (item.execution_time || 0))}
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

            {/* Кнопка возврата в лобби */}
            <div className="flex justify-center mt-6">
                <Button
                    variant="outline"
                    onClick={() => router.push("/lobby")}
                    className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-all active:scale-95"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Вернуться в лобби
                </Button>
            </div>
        </div>
    )
}