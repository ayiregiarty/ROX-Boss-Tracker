"use client"

import { useEffect, useState } from "react"
import { BossType } from "@/lib/bosses"

type TrackedBoss = {
  bossId: string
  bossName: string
  bossType: BossType
  timeInSeconds: number
  createdAt: number
}

type BossListProps = {
  bosses: TrackedBoss[]
  onExpire: (key: string) => void
}

function formatTime(seconds: number) {
  if (seconds <= 0) return "00:00:00"

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return [
    h.toString().padStart(2, "0"),
    m.toString().padStart(2, "0"),
    s.toString().padStart(2, "0"),
  ].join(":")
}

export function BossList({ bosses, onExpire }: BossListProps) {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((v) => v + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const now = Date.now()

  const visibleBosses = bosses
    .map((boss) => {
      const endTime = boss.createdAt + boss.timeInSeconds * 1000
      const remainingSeconds = Math.floor((endTime - now) / 1000)

      if (remainingSeconds <= 0) {
        onExpire(`${boss.bossId}-${boss.createdAt}`)
        return null
      }

      return {
        ...boss,
        remainingSeconds,
      }
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.remainingSeconds - b.remainingSeconds)

  return (
    <div className="space-y-3">
      {visibleBosses.map((boss: any) => (
        <div
          key={`${boss.bossId}-${boss.createdAt}`}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div>
            <div className="font-semibold">{boss.bossName}</div>
            <div className="text-xs text-muted-foreground">
              {boss.bossType}
            </div>
          </div>

          <div className="font-mono text-lg">
            {formatTime(boss.remainingSeconds)}
          </div>
        </div>
      ))}
    </div>
  )
}