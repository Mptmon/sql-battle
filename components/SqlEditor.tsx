// components/SqlEditor.tsx
"use client" // Обязательно! Monaco работает только в браузере

import Editor from "@monaco-editor/react"

interface SqlEditorProps {
    value: string
    onChange: (value: string) => void
}

export default function SqlEditor({ value, onChange }: SqlEditorProps) {
    return (
        <div className="h-full w-full border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
            <Editor
                height="100%"
                defaultLanguage="sql"
                value={value}
                onChange={(val) => onChange(val || "")}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false }, // Отключаем мини-карту для экономии места
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    automaticLayout: true, // Чтобы редактор подстраивался под размер окна
                    wordWrap: "on",
                }}
            />
        </div>
    )
}