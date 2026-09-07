// app/(arena)/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Shield, Zap } from "lucide-react"
import { toast } from "sonner"
import { setToken, setUser } from "@/lib/auth"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [loginData, setLoginData] = useState({ username: "", password: "" })
    const [registerData, setRegisterData] = useState({ username: "", password: "", email: "" })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 800))

            if (loginData.username.length < 3 || loginData.password.length < 3) {
                toast.error("Ошибка входа", { description: "Логин и пароль должны быть длиннее 3 символов" })
                setIsLoading(false)
                return
            }

            setToken("mock-jwt-token-" + Date.now())
            setUser({
                id: 1,
                username: loginData.username,
                email: loginData.username + "@company.com",
                rating: 1250,
                totalPoints: 450,
                role: "participant"
            })

            toast.success("Добро пожаловать!", { description: `Привет, ${loginData.username}!` })
            router.push("/lobby") // <-- Редирект в Лобби
        } catch (error) {
            toast.error("Ошибка сервера")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 800))

            if (registerData.username.length < 3 || registerData.password.length < 3) {
                toast.error("Ошибка регистрации", { description: "Логин и пароль должны быть длиннее 3 символов" })
                setIsLoading(false)
                return
            }

            setToken("mock-jwt-token-" + Date.now())
            setUser({
                id: Math.floor(Math.random() * 1000),
                username: registerData.username,
                email: registerData.email || registerData.username + "@company.com",
                rating: 0,
                totalPoints: 0,
                role: "participant"
            })

            toast.success("Регистрация успешна!", { description: "Добро пожаловать в баттл!" })
            router.push("/lobby") // <-- Редирект в Лобби
        } catch (error) {
            toast.error("Ошибка сервера")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <Shield className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-100">SQL Battle</h1>
                    <p className="text-zinc-400 mt-2">Войди, чтобы начать соревнование</p>
                </div>

                <Card className="bg-zinc-900/80 backdrop-blur border-zinc-800 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-emerald-400">Доступ к арене</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Войди или создай аккаунт, чтобы участвовать в баттле
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
                                <TabsTrigger value="login" className="data-[state=active]:bg-zinc-700">Вход</TabsTrigger>
                                <TabsTrigger value="register" className="data-[state=active]:bg-zinc-700">Регистрация</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-username" className="text-zinc-300">Логин</Label>
                                        <Input
                                            id="login-username"
                                            type="text"
                                            placeholder="ivan.petrov"
                                            value={loginData.username}
                                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800 text-zinc-100"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="login-password" className="text-zinc-300">Пароль</Label>
                                        <Input
                                            id="login-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800 text-zinc-100"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all active:scale-95"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Вход...</>
                                        ) : (
                                            <><Zap className="mr-2 h-4 w-4" /> Войти на арену</>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-username" className="text-zinc-300">Логин</Label>
                                        <Input
                                            id="reg-username"
                                            type="text"
                                            placeholder="ivan.petrov"
                                            value={registerData.username}
                                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800 text-zinc-100"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email" className="text-zinc-300">Email (опционально)</Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            placeholder="ivan@company.com"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800 text-zinc-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password" className="text-zinc-300">Пароль</Label>
                                        <Input
                                            id="reg-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800 text-zinc-100"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all active:scale-95"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Регистрация...</>
                                        ) : (
                                            <><Zap className="mr-2 h-4 w-4" /> Создать аккаунт</>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}