"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type AttemptRow = {
  id: string
  character_name: string
  mvp: number
  mini: number
}

type Props = {
  rows: AttemptRow[]
  onAdd: () => void
  onUpdate: (
    id: string,
    field: "character_name" | "mvp" | "mini",
    value: number | string
  ) => void
  onRemove: (id: string) => void
}

const Counter = ({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) => {
  const inc = () => value < 3 && onChange(value + 1)
  const dec = () => value > 0 && onChange(value - 1)

  return (
    <div className="flex items-center justify-between w-[88px] h-[36px] border rounded-md px-1">
      <button
        type="button"
        onClick={dec}
        disabled={value === 0}
        className="w-6 h-6 flex items-center justify-center text-sm disabled:opacity-40"
      >
        −
      </button>

      <span className="text-sm font-medium w-4 text-center">
        {value}
      </span>

      <button
        type="button"
        onClick={inc}
        disabled={value === 3}
        className="w-6 h-6 flex items-center justify-center text-sm disabled:opacity-40"
      >
        +
      </button>
    </div>
  )
}

export function AttemptsUI({
  rows,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="rounded-xl border p-4 bg-white shadow">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">Attempts</h3>
        <Button size="sm" onClick={onAdd}>
          + Add
        </Button>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex gap-2 items-center">
            <Input
              placeholder="Character"
              value={r.character_name}
              onChange={(e) =>
                onUpdate(r.id, "character_name", e.target.value)
              }
            />

            <Counter
              value={r.mvp}
              onChange={(v) => onUpdate(r.id, "mvp", v)}
            />

            <Counter
              value={r.mini}
              onChange={(v) => onUpdate(r.id, "mini", v)}
            />

            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={() => onRemove(r.id)}
            >
              ✕
            </Button>
          </div>
        ))}

        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No attempts yet
          </p>
        )}
      </div>
    </div>
  )
}