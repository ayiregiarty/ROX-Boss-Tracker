"use client"

import { useEffect, useState } from "react"
import { BossForm } from "@/components/BossForm"
import { BossList } from "@/components/BossList"
import { AttemptsCard } from "@/components/ViewAttempts"
import { BossType } from "@/lib/bosses"

type TrackedBoss = {
  bossId: string
  bossName: string
  bossType: BossType
  timeInSeconds: number
  createdAt: number
}

const STORAGE_KEY = "rox-tracked-bosses"

export default function Page() {
  const [bosses, setBosses] = useState<TrackedBoss[]>([])
  const [showAttempts, setShowAttempts] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      setBosses(JSON.parse(raw))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bosses))
  }, [bosses])

  function addBoss(data: {
    bossId: string
    bossName: string
    bossType: BossType
    timeInSeconds: number
  }) {
    setBosses((prev) => [
      ...prev,
      {
        ...data,
        createdAt: Date.now(),
      },
    ])
  }

  function removeBoss(key: string) {
    setBosses((prev) =>
      prev.filter((b) => `${b.bossId}-${b.createdAt}` !== key)
    )
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-6 bg-white rounded-xl">
      <div className="flex flex-row justify-between items-end">
        <h1 className="text-2xl font-bold">ROX Boss Tracker</h1>
        <button
          onClick={() => setShowAttempts((v) => !v)}
          className="text-sm underline text-orange-500 hover:cursor-pointer"
        >
          View Attemps
        </button>
      </div>

      <BossForm onAdd={addBoss} />
      <BossList bosses={bosses} onExpire={removeBoss} />

      {showAttempts && <AttemptsCard />}
    </main>
  )
}