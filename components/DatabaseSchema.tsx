// components/DatabaseSchema.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Database, Table2, Columns, Eye } from "lucide-react"

interface Column {
    name: string
    type: string
}

interface TableData {
    name: string
    columns: Column[]
    sampleData: any[]
}

interface DatabaseSchemaProps {
    tables: TableData[]
}

export default function DatabaseSchema({ tables }: DatabaseSchemaProps) {
    const [selectedTable, setSelectedTable] = useState<string | null>(tables[0]?.name || null)
    const [showSampleData, setShowSampleData] = useState(false)

    const currentTable = tables.find(t => t.name === selectedTable)

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase">
                    <Database className="h-4 w-4" />
                    Таблицы ({tables.length})
                </div>
                <div className="flex flex-wrap gap-2">
                    {tables.map((table) => (
                        <button
                            key={table.name}
                            onClick={() => setSelectedTable(table.name)}
                            className={`
                px-3 py-1.5 rounded-lg border text-sm font-mono transition-all
                ${selectedTable === table.name
                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                                }
              `}
                        >
                            <Table2 className="inline h-3 w-3 mr-1" />
                            {table.name}
                        </button>
                    ))}
                </div>
            </div>

            {currentTable && (
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-emerald-400 text-base flex items-center gap-2">
                                <Table2 className="h-4 w-4" />
                                {currentTable.name}
                            </CardTitle>
                            <button
                                onClick={() => setShowSampleData(!showSampleData)}
                                className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                            >
                                <Eye className="h-3 w-3" />
                                {showSampleData ? "Скрыть данные" : "Показать данные"}
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase">
                                <Columns className="h-3 w-3" />
                                Колонки ({currentTable.columns.length})
                            </div>
                            <div className="grid gap-1">
                                {currentTable.columns.map((col) => (
                                    <div
                                        key={col.name}
                                        className="flex items-center justify-between px-3 py-2 bg-zinc-900/50 rounded border border-zinc-800/50"
                                    >
                                        <span className="font-mono text-sm text-zinc-200">{col.name}</span>
                                        <Badge variant="outline" className="text-xs font-mono border-blue-500/50 text-blue-400">
                                            {col.type}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {showSampleData && currentTable.sampleData.length > 0 && (
                            <div className="space-y-2 pt-4 border-t border-zinc-800">
                                <div className="text-xs font-semibold text-zinc-500 uppercase">
                                    Примеры данных (первые {Math.min(3, currentTable.sampleData.length)} строки)
                                </div>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                                {currentTable.columns.map((col) => (
                                                    <TableHead key={col.name} className="text-zinc-400 font-mono text-xs">
                                                        {col.name}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentTable.sampleData.slice(0, 3).map((row, idx) => (
                                                <TableRow key={idx} className="border-zinc-800 hover:bg-zinc-800/50">
                                                    {currentTable.columns.map((col) => (
                                                        <TableCell key={col.name} className="font-mono text-xs text-zinc-300">
                                                            {String(row[col.name])}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}