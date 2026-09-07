// app/admin/users/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserPlus, Trash2, Loader2 } from "lucide-react"
import { getAllUsers, assignTask, clearAssignment, getTasks } from "@/lib/api"
import { toast } from "sonner"

interface User {
    id: number
    username: string
    email: string
    rating: number
    totalPoints: number
    assignedTaskId: number | null
}

interface Task {
    id: number
    title: string
    difficulty: string
    points: number
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedTaskId, setSelectedTaskId] = useState<string>("")
    const [isAssigning, setIsAssigning] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [usersData, tasksData] = await Promise.all([
                getAllUsers(),
                getTasks()
            ])
            setUsers(usersData)
            setTasks(tasksData)
        } catch (error) {
            toast.error("Ошибка загрузки данных")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAssign = async () => {
        if (!selectedUser || !selectedTaskId) return

        setIsAssigning(true)
        try {
            await assignTask(selectedUser.id, parseInt(selectedTaskId))
            toast.success("Задача назначена!", {
                description: `${selectedUser.username} получил задачу`
            })
            setDialogOpen(false)
            setSelectedTaskId("")
            setSelectedUser(null)
            await loadData() // Перезагружаем данные
        } catch (error) {
            toast.error("Ошибка назначения задачи")
        } finally {
            setIsAssigning(false)
        }
    }

    const handleClear = async (userId: number, username: string) => {
        try {
            await clearAssignment(userId)
            toast.success("Назначение снято", {
                description: `${username} больше не имеет назначенной задачи`
            })
            await loadData()
        } catch (error) {
            toast.error("Ошибка снятия назначения")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-zinc-100">Управление участниками</h1>
                <p className="text-zinc-400 mt-1">Назначайте задачи участникам баттла</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-orange-400">Участники ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableHead className="text-zinc-400">ID</TableHead>
                                <TableHead className="text-zinc-400">Имя пользователя</TableHead>
                                <TableHead className="text-zinc-400">Email</TableHead>
                                <TableHead className="text-zinc-400 text-center">Рейтинг</TableHead>
                                <TableHead className="text-zinc-400 text-center">Баллы</TableHead>
                                <TableHead className="text-zinc-400 text-center">Назначенная задача</TableHead>
                                <TableHead className="text-zinc-400 text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="font-mono text-zinc-500">#{user.id}</TableCell>
                                    <TableCell className="font-medium text-zinc-200">{user.username}</TableCell>
                                    <TableCell className="text-zinc-400">{user.email}</TableCell>
                                    <TableCell className="text-center font-bold text-zinc-300">{user.rating}</TableCell>
                                    <TableCell className="text-center font-bold text-emerald-400">{user.totalPoints}</TableCell>
                                    <TableCell className="text-center">
                                        {user.assignedTaskId ? (
                                            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                                                Задача #{user.assignedTaskId}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-zinc-700 text-zinc-500">
                                                Не назначена
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog open={dialogOpen && selectedUser?.id === user.id} onOpenChange={setDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-400 hover:text-orange-400 hover:bg-zinc-800"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Назначить задачу
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                                                <DialogHeader>
                                                    <DialogTitle className="text-orange-400">Назначить задачу</DialogTitle>
                                                    <DialogDescription className="text-zinc-400">
                                                        Выберите задачу для пользователя <span className="text-zinc-200 font-semibold">{user.username}</span>
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="task-select" className="text-zinc-300">Задача</Label>
                                                        <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                                                            <SelectTrigger id="task-select" className="bg-zinc-950 border-zinc-800">
                                                                <SelectValue placeholder="Выберите задачу" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                                {tasks.map((task) => (
                                                                    <SelectItem key={task.id} value={task.id.toString()}>
                                                                        #{task.id} - {task.title} ({task.points} баллов)
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setDialogOpen(false)}
                                                        className="bg-zinc-800 border-zinc-700"
                                                    >
                                                        Отмена
                                                    </Button>
                                                    <Button
                                                        onClick={handleAssign}
                                                        disabled={!selectedTaskId || isAssigning}
                                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                                    >
                                                        {isAssigning ? (
                                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Назначение...</>
                                                        ) : (
                                                            "Назначить"
                                                        )}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {user.assignedTaskId && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                                                onClick={() => handleClear(user.id, user.username)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Снять
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}