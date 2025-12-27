"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { BOSSES, BossType } from "@/lib/bosses"

type BossFormProps = {
  onAdd: (data: {
    bossId: string
    bossName: string
    bossType: BossType
    timeInSeconds: number
  }) => void
}

export function BossForm({ onAdd }: BossFormProps) {
  const [filter, setFilter] = useState<BossType>("MVP")
  const [bossId, setBossId] = useState("")
  const [hour, setHour] = useState("")
  const [minute, setMinute] = useState("")
  const [second, setSecond] = useState("")

  const filteredBosses = useMemo(
    () => BOSSES.filter((b) => b.type === filter),
    [filter]
  )

  const selectedBoss = BOSSES.find((b) => b.id === bossId)

  const handleSubmit = () => {
    if (!selectedBoss) return

    const timeInSeconds =
      Number(hour || 0) * 3600 +
      Number(minute || 0) * 60 +
      Number(second || 0)

    onAdd({
      bossId: selectedBoss.id,
      bossName: selectedBoss.name,
      bossType: selectedBoss.type,
      timeInSeconds,
    })

    setBossId("")
    setHour("")
    setMinute("")
    setSecond("")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-[40%]">
            <Select value={filter} onValueChange={(v) => setFilter(v as BossType)}>
            <SelectTrigger className="h-11 w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="MVP">MVP</SelectItem>
                <SelectItem value="Mini">Mini</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className="w-[60%]">
            <Select value={bossId} onValueChange={setBossId}>
            <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Pilih Boss" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>{filter}</SelectLabel>
                {filteredBosses.map((boss) => (
                    <SelectItem key={boss.id} value={boss.id}>
                    {boss.name}
                    </SelectItem>
                ))}
                </SelectGroup>
            </SelectContent>
            </Select>
        </div>
        </div>

      {/* Time Inputs */}
      <div className="grid grid-cols-3 gap-3">
        <Input
          type="number"
          min={0}
          placeholder="jam"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        />
        <Input
          type="number"
          min={0}
          max={59}
          placeholder="menit"
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
        />
        <Input
          type="number"
          min={0}
          max={59}
          placeholder="detik"
          value={second}
          onChange={(e) => setSecond(e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        disabled={!bossId}
        onClick={handleSubmit}
      >
        Menambahkan
      </Button>
    </div>
  )
}