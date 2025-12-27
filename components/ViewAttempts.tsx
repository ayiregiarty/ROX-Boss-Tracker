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
    value: string | number
  ) => void
  onRemove: (id: string) => void
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
        <Button size="sm" onClick={onAdd}>+ Add</Button>
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
            <Input
              type="number"
              className="w-20 text-center"
              value={r.mvp}
              onChange={(e) =>
                onUpdate(r.id, "mvp", Number(e.target.value))
              }
            />
            <Input
              type="number"
              className="w-20 text-center"
              value={r.mini}
              onChange={(e) =>
                onUpdate(r.id, "mini", Number(e.target.value))
              }
            />
            <Button variant="ghost" onClick={() => onRemove(r.id)}>
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