// components/admin/TaskFormDialog.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export function TaskFormDialog() {
    const [open, setOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Здесь позже будет fetch запрос к API Дани: POST /api/admin/tasks
        toast.success("Задача сохранена!", { description: "Даня (бэк) скоро подключит реальное сохранение в БД." })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    + Добавить задачу
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-zinc-100">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-orange-400">Новая задача для баттла</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Заполните условия, схему БД и эталонное решение.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right text-zinc-300">Название</Label>
                            <Input id="title" placeholder="Например: Топ-10 заказов" className="col-span-3 bg-zinc-950 border-zinc-800" required />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right text-zinc-300 pt-2">Условие</Label>
                            <Textarea id="description" placeholder="Опишите, что нужно сделать..." className="col-span-3 bg-zinc-950 border-zinc-800 min-h-[100px]" required />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="schema" className="text-right text-zinc-300 pt-2">Схема БД</Label>
                            <Textarea id="schema" placeholder="CREATE TABLE users (...)" className="col-span-3 bg-zinc-950 border-zinc-800 font-mono text-xs" required />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="solution" className="text-right text-zinc-300 pt-2">Эталонный SQL</Label>
                            <Textarea id="solution" placeholder="SELECT * FROM..." className="col-span-3 bg-zinc-950 border-zinc-800 font-mono text-xs text-emerald-400" required />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="difficulty" className="text-right text-zinc-300">Сложность</Label>
                            <Select defaultValue="medium">
                                <SelectTrigger className="col-span-3 bg-zinc-950 border-zinc-800">
                                    <SelectValue placeholder="Выберите сложность" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="easy">Легко (100 баллов)</SelectItem>
                                    <SelectItem value="medium">Средне (250 баллов)</SelectItem>
                                    <SelectItem value="hard">Сложно (500 баллов)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-zinc-800 border-zinc-700">Отмена</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Сохранить задачу</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}