"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AttemptRow = {
  id: string
  name: string
  mvp: number
  mini: number
}

const STORAGE_KEY = "rox-attempts"

export function AttemptsCard() {
  const [rows, setRows] = useState<AttemptRow[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      mvp: 3,
      mini: 3,
    },
  ])
  
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRows(parsed)
        }
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  }, [rows])

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        mvp: 3,
        mini: 3,
      },
    ])
  }

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const updateRow = (
    id: string,
    field: keyof AttemptRow,
    value: string | number
  ) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  return (
    <div className="mt-4 rounded-xl border bg-background p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Attempts</h3>
        <Button size="sm" onClick={addRow}>
          + Add Name
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Character</TableHead>
            <TableHead className="w-[80px] text-center">MVP</TableHead>
            <TableHead className="w-[80px] text-center">Mini</TableHead>
            <TableHead className="w-[40px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Input
                  value={row.name}
                  placeholder="Name"
                  onChange={(e) =>
                    updateRow(row.id, "name", e.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  className="text-center"
                  value={row.mvp}
                  onChange={(e) =>
                    updateRow(row.id, "mvp", Number(e.target.value))
                  }
                />
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  className="text-center"
                  value={row.mini}
                  onChange={(e) =>
                    updateRow(row.id, "mini", Number(e.target.value))
                  }
                />
              </TableCell>

              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(row.id)}
                  className="text-red-500 hover:bg-red-50"
                >
                  ✕
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}