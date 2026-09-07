// app/admin/tasks/page.tsx
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TaskFormDialog } from "@/components/admin/TaskFormDialog"
import { mockTasks } from "@/lib/mock-data"
import { toast } from "sonner"

export default function AdminTasksPage() {
    const handleDelete = (id: number) => {
        // Здесь позже будет fetch запрос к API Дани: DELETE /api/admin/tasks/{id}
        toast.warning("Задача удалена", { description: `Задача #${id} удалена из списка (пока только визуально).` })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">Управление задачами</h1>
                    <p className="text-zinc-400 mt-1">Добавляйте, редактируйте и удаляйте задачи для участников.</p>
                </div>
                <TaskFormDialog />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableHead className="text-zinc-400 w-16">ID</TableHead>
                            <TableHead className="text-zinc-400">Название</TableHead>
                            <TableHead className="text-zinc-400 text-center">Сложность</TableHead>
                            <TableHead className="text-zinc-400 text-center">Баллы</TableHead>
                            <TableHead className="text-zinc-400 text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockTasks.map((task) => (
                            <TableRow key={task.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="font-mono text-zinc-500">#{task.id}</TableCell>
                                <TableCell className="font-medium text-zinc-200">{task.title}</TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant="outline"
                                        className={
                                            task.difficulty === 'easy' ? 'border-green-500 text-green-400' :
                                                task.difficulty === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                                    'border-red-500 text-red-400'
                                        }
                                    >
                                        {task.difficulty === 'easy' ? 'Легко' : task.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center font-bold text-zinc-300">{task.points}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-orange-400 hover:bg-zinc-800">
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        Удалить
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}