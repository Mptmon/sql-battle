// app/admin/settings/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function AdminSettingsPage() {
    const [startTime, setStartTime] = useState("2026-09-15T10:00")
    const [duration, setDuration] = useState("120")

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        // Здесь позже будет fetch запрос к API Дани: PUT /api/admin/settings
        toast.success("Настройки сохранены!", { description: `Старт: ${startTime}, Длительность: ${duration} мин.` })
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-zinc-100">Настройки баттла</h1>
                <p className="text-zinc-400 mt-1">Управление временем начала и длительностью этапов.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-orange-400">Временные параметры</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Эти настройки будут синхронизированы с таймером на странице участников.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="startTime" className="text-zinc-300">Дата и время начала</Label>
                            <Input
                                id="startTime"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration" className="text-zinc-300">Длительность раунда (в минутах)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-sm"
                            />
                            <p className="text-xs text-zinc-500">Рекомендуемое значение: 60-120 минут.</p>
                        </div>

                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                            Сохранить настройки
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}