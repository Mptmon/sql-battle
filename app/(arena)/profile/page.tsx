// app/(arena)/profile/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockUser, mockTasks } from "@/lib/mock-data";

export default function ProfilePage() {
    // Фильтруем только решенные задачи для истории
    const solvedTasks = mockTasks.filter(task => task.status === "solved");

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* Шапка профиля */}
            <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300 hover:scale-[1.01] hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20">
                <CardContent className="pt-6 flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-2 border-emerald-500">
                        <AvatarImage src={mockUser.avatarUrl} alt={mockUser.username} />
                        <AvatarFallback className="text-2xl">{mockUser.username.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-zinc-100">{mockUser.username}</h2>
                        <p className="text-zinc-400">{mockUser.email}</p>
                    </div>

                    <div className="flex gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-emerald-400">#{mockUser.rank}</div>
                            <div className="text-xs text-zinc-500 uppercase">Место</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-zinc-100">{mockUser.totalPoints}</div>
                            <div className="text-xs text-zinc-500 uppercase">Баллов</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-zinc-100">{mockUser.rating}</div>
                            <div className="text-xs text-zinc-500 uppercase">Рейтинг</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Статистика и История решений */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Карточка с мини-статистикой */}
                <Card className="bg-zinc-900 border-zinc-800 transition-all duration-300 hover:scale-[1.01] hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20">
                    <CardHeader>
                        <CardTitle className="text-emerald-400 text-sm uppercase">Статистика баттла</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Решено задач:</span>
                            <span className="font-bold text-zinc-100">{solvedTasks.length} / {mockTasks.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Лучший результат:</span>
                            <span className="font-bold text-emerald-400">0.12 сек</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Любимая сложность:</span>
                            <Badge variant="secondary" className="bg-zinc-800">Hard</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Таблица истории решений */}
                <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-emerald-400 text-sm uppercase">История решений</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableHead className="text-zinc-400">Задача</TableHead>
                                    <TableHead className="text-zinc-400 text-center">Сложность</TableHead>
                                    <TableHead className="text-zinc-400 text-center">Время</TableHead>
                                    <TableHead className="text-zinc-400 text-right">Баллы</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {solvedTasks.map((task) => (
                                    <TableRow key={task.id} className="border-zinc-800 hover:bg-zinc-800/50">
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
                                        <TableCell className="text-center text-zinc-400 font-mono">
                                            {task.userResult?.execution_time}с
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-emerald-400">
                                            +{task.userResult?.points_earned}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}