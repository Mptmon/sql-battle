// app/(arena)/battle/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, Play, CheckCircle2, AlertCircle, LogOut } from "lucide-react"
import SqlEditor from "@/components/SqlEditor"
import DatabaseSchema from "@/components/DatabaseSchema"
import { toast } from "sonner"
import { getTaskById, executeQuery, submitSolution } from "@/lib/api"

const CURRENT_TASK_ID = 3

export default function BattlePage() {
    const router = useRouter()
    const [task, setTask] = useState<any>(null)
    const [sqlQuery, setSqlQuery] = useState("SELECT name, SUM(total_amount) as total_sum, COUNT(*) as order_count\nFROM users\nJOIN orders ON users.id = orders.user_id\nGROUP BY users.name\nHAVING COUNT(*) > 2\nORDER BY total_sum DESC;")
    const [isExecuting, setIsExecuting] = useState(false)
    const [result, setResult] = useState<null | { type: 'success', data: any[] } | { type: 'error', message: string }>(null)
    const [isTimeUp, setIsTimeUp] = useState(false)
    const [expectedResult, setExpectedResult] = useState<any[] | null>(null)

    useEffect(() => {
        async function loadTask() {
            try {
                const data = await getTaskById(CURRENT_TASK_ID)
                setTask(data)
            } catch (error) {
                toast.error("Ошибка загрузки задачи")
            }
        }
        loadTask()

        const checkTime = () => {
            const startTimeStr = localStorage.getItem("battle_start_time")
            const durationStr = localStorage.getItem("battle_duration")

            if (startTimeStr && durationStr) {
                const startTime = parseInt(startTimeStr, 10)
                const duration = parseInt(durationStr, 10)
                const elapsed = Math.floor((Date.now() - startTime) / 1000)

                if (elapsed >= duration) {
                    setIsTimeUp(true)
                }
            }
        }

        checkTime()
        const interval = setInterval(checkTime, 1000)

        return () => clearInterval(interval)
    }, [])

    const handleExecute = async () => {
        if (!task) return
        if (isTimeUp) {
            toast.error("Время вышло!", { description: "Нельзя выполнять запросы после окончания времени" })
            return
        }

        setIsExecuting(true)
        setResult(null)

        try {
            const res = await executeQuery(task.id, sqlQuery)
            if (res.status === "error") {
                setResult({ type: 'error', message: res.message })
                toast.error("Ошибка выполнения запроса")
            } else {
                setResult({ type: 'success', data: res.data })
                toast.success("Запрос выполнен успешно", { description: `Время: ${res.execution_time}s` })
            }
        } catch (error) {
            setResult({ type: 'error', message: "Ошибка соединения с сервером" })
            toast.error("Сервер недоступен")
        } finally {
            setIsExecuting(false)
        }
    }

    const handleSubmit = async () => {
        if (!task) return

        if (isTimeUp) {
            toast.error("Время вышло!", {
                description: "К сожалению, время на выполнение задачи истекло",
                duration: 5000
            })
            return
        }

        toast.info("Отправка на проверку...")
        try {
            const res = await submitSolution(task.id, sqlQuery)
            if (res.is_correct) {
                toast.success("Верно! 🎉", { description: `+${res.points_earned} баллов` })
                if (res.expected_result) {
                    setExpectedResult(res.expected_result)
                }
            } else {
                toast.error("Неверно", { description: "Попробуйте еще раз" })
                if (res.expected_result) {
                    setExpectedResult(res.expected_result)
                }
            }
        } catch (error) {
            toast.error("Ошибка проверки")
        }
    }

    const handleExitToLobby = () => {
        localStorage.removeItem("battle_start_time")
        localStorage.removeItem("battle_duration")
        setExpectedResult(null)
        toast.info("Возврат в лобби", { description: "Ожидание новой задачи..." })
        router.push("/lobby")
    }

    if (!task) {
        return (
            <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center text-zinc-500 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                <p className="text-sm animate-pulse">Загрузка арены...</p>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                <div className="w-full md:w-1/3 flex flex-col">
                    <Card className="bg-zinc-900 border-zinc-800 flex-1 flex flex-col transition-all duration-300 hover:border-zinc-700">
                        <CardHeader className="border-b border-zinc-800 pb-3">
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="text-emerald-400 text-lg leading-tight">Задача #{task.id}: {task.title}</CardTitle>
                                <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 shrink-0">
                                    {task.points} баллов
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 flex-1 overflow-y-auto custom-scrollbar">
                            <Tabs defaultValue="task" className="w-full">
                                <TabsList className="bg-zinc-800 w-full justify-start">
                                    <TabsTrigger value="task" className="flex-1 data-[state=active]:bg-zinc-700">Условие</TabsTrigger>
                                    <TabsTrigger value="schema" className="flex-1 data-[state=active]:bg-zinc-700">Схема БД</TabsTrigger>
                                </TabsList>

                                <TabsContent value="task" className="mt-4 text-zinc-300 space-y-3 text-sm leading-relaxed">
                                    <p>{task.description}</p>
                                </TabsContent>

                                <TabsContent value="schema" className="mt-4">
                                    {task.tables && task.tables.length > 0 ? (
                                        <DatabaseSchema tables={task.tables} />
                                    ) : (
                                        <div className="relative group">
                                            <pre className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-xs text-emerald-300 overflow-x-auto font-mono transition-colors group-hover:border-emerald-500/30">
                                                {task.schema}
                                            </pre>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full md:w-2/3 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <Database className="h-4 w-4" /> SQL Editor
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleExecute}
                                disabled={isExecuting || isTimeUp}
                            >
                                {isExecuting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                                {isExecuting ? "Выполнение..." : "Выполнить (Run)"}
                            </Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmit}
                                disabled={isTimeUp}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Отправить решение
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-orange-400 transition-all active:scale-95"
                                onClick={handleExitToLobby}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Выйти в лобби
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 transition-all duration-300">
                        <SqlEditor value={sqlQuery} onChange={setSqlQuery} />
                    </div>
                </div>
            </div>

            <div className="h-1/3 min-h-[200px] bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col transition-all duration-300 hover:border-zinc-700 overflow-y-auto">
                <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 rounded-t-lg flex items-center gap-2">
                    <Database className="h-4 w-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase">Результат выполнения</h3>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {!result && !expectedResult && (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                            <Database className="h-8 w-8 opacity-20" />
                            <p className="text-sm">Нажмите "Выполнить", чтобы увидеть результат запроса</p>
                        </div>
                    )}

                    {result?.type === 'error' && (
                        <div className="bg-red-950/20 border border-red-900/50 text-red-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <span>{result.message}</span>
                        </div>
                    )}

                    {result?.type === 'success' && result.data.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-zinc-800 hover:bg-transparent">
                                        {Object.keys(result.data[0]).map((key) => (
                                            <TableHead key={key} className="text-zinc-400 font-mono uppercase text-xs">{key}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result.data.map((row, idx) => (
                                        <TableRow key={idx} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                            {Object.values(row).map((val: any, i) => (
                                                <TableCell key={i} className="font-mono text-zinc-300">{val}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {expectedResult && expectedResult.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <h4 className="text-sm font-semibold text-emerald-400 uppercase">Эталонный результат</h4>
                            </div>
                            <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-emerald-900/50 hover:bg-transparent">
                                            {Object.keys(expectedResult[0]).map((key) => (
                                                <TableHead key={key} className="text-emerald-400 font-mono uppercase text-xs">{key}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {expectedResult.map((row, idx) => (
                                            <TableRow key={idx} className="border-emerald-900/50 hover:bg-emerald-900/20">
                                                {Object.values(row).map((val: any, i) => (
                                                    <TableCell key={i} className="font-mono text-emerald-300">{val}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2">
                                💡 Сравните ваш результат с эталонным. Порядок строк может отличаться.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}