// app/(arena)/welcome/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, Trophy, Database, Code2, Users } from "lucide-react"

export default function WelcomePage() {
    const router = useRouter()

    const handleStart = () => {
        router.push("/login")
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20">
            <div className="max-w-4xl w-full space-y-8">

                {/* Заголовок */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <Database className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h1 className="text-5xl font-bold text-zinc-100">
                        SQL <span className="text-emerald-400">Battle</span>
                    </h1>
                    <p className="text-xl text-zinc-400">
                        Проверь свои навыки работы с базами данных в реальном времени
                    </p>
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-4 py-2 text-sm">
                        CDEK_Digital • IT Summit 2026
                    </Badge>
                </div>

                {/* Правила */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-zinc-900/80 backdrop-blur border-zinc-800">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="p-3 rounded-full bg-blue-500/10">
                                    <Clock className="h-6 w-6 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-100">5 минут</h3>
                                <p className="text-sm text-zinc-400">
                                    На каждую задачу дается ровно 5 минут
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/80 backdrop-blur border-zinc-800">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="p-3 rounded-full bg-purple-500/10">
                                    <Code2 className="h-6 w-6 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-100">SQL-запросы</h3>
                                <p className="text-sm text-zinc-400">
                                    Пиши запросы, тестируй и отправляй на проверку
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/80 backdrop-blur border-zinc-800">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="p-3 rounded-full bg-yellow-500/10">
                                    <Trophy className="h-6 w-6 text-yellow-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-100">Рейтинг</h3>
                                <p className="text-sm text-zinc-400">
                                    Соревнуйся с другими участниками в реальном времени
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Дополнительная информация */}
                <Card className="bg-zinc-900/80 backdrop-blur border-zinc-800">
                    <CardContent className="pt-6">
                        <div className="space-y-4 text-sm text-zinc-300">
                            <div className="flex items-start gap-3">
                                <Zap className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-zinc-100">Мгновенная проверка:</span>{" "}
                                    Твои запросы выполняются в изолированной среде и сравниваются с эталонным результатом
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-zinc-100">Лидерборд:</span>{" "}
                                    Следи за своим местом в рейтинге и обгоняй соперников
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Database className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-zinc-100">Реальные данные:</span>{" "}
                                    Работай с реальными таблицами и данными, как в продакшене
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Кнопка старта */}
                <div className="flex justify-center">
                    <Button
                        onClick={handleStart}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-6 transition-all active:scale-95 shadow-lg shadow-emerald-900/30"
                    >
                        <Zap className="mr-2 h-5 w-5" />
                        Войти / Регистрация
                    </Button>
                </div>

                {/* Подвал */}
                <div className="text-center text-xs text-zinc-600">
                    CDEK_Digital • Удачи! Пусть победит сильнейший 🗡️
                </div>
            </div>
        </div>
    )
}