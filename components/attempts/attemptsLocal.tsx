"use client"

import { useEffect, useState } from "react"
import { AttemptsUI, AttemptRow } from "@/components/ViewAttempts"

const STORAGE_KEY = "local-attempts"

export function AttemptsLocal() {
  const [rows, setRows] = useState<AttemptRow[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setRows(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  }, [rows])

  const add = () => {
    setRows((r) => [
      ...r,
      {
        id: crypto.randomUUID(),
        character_name: "",
        mvp: 3,
        mini: 3,
      },
    ])
  }

  const update = (
    id: string,
    field: "character_name" | "mvp" | "mini",
    value: string | number
  ) => {
    setRows((r) =>
      r.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    )
  }

  const remove = (id: string) => {
    setRows((r) => r.filter((row) => row.id !== id))
  }

  return (
    <AttemptsUI
      rows={rows}
      onAdd={add}
      onUpdate={update}
      onRemove={remove}
    />
  )
}