// app/admin/layout.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            {/* Сайдбар админки */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col">
                <h2 className="text-lg font-bold text-orange-400 mb-8 px-2">ADMIN PANEL</h2>
                <nav className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400 hover:bg-zinc-800" asChild>
                        <Link href="/admin/tasks">Задачи</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400 hover:bg-zinc-800" asChild>
                        <Link href="/admin/users">Участники</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start text-zinc-300 hover:text-orange-400 hover:bg-zinc-800" asChild>
                        <Link href="/admin/settings">Тайминги и настройки</Link>
                    </Button>
                </nav>

                <div className="mt-auto pt-4 border-t border-zinc-800">
                    <Button variant="outline" className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700" asChild>
                        <Link href="/battle">Выйти на площадку</Link>
                    </Button>
                </div>
            </aside>

            {/* Контент админки */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}