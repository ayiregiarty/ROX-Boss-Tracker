"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { BossForm } from "@/components/BossForm"
import { BossList } from "@/components/BossList"
import { TrackedBoss } from "@/lib/types"
import { BossType } from "@/lib/bosses"
import { AttemptsLocal } from "@/components/attempts/attemptsLocal"

const STORAGE_KEY = "rox-tracked-bosses"
const CHANNEL_NAME = "rox-boss-sync"

export default function Page() {
  const [bosses, setBosses] = useState<TrackedBoss[]>([])
  const [showAttempts, setShowAttempts] = useState(false)

  const channelRef = useRef<BroadcastChannel | null>(null)
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setBosses(JSON.parse(raw))
      } catch {}
    }

    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel

    channel.onmessage = (event) => {
      if (event.data?.type === "SYNC") {
        setBosses(event.data.payload)
      }
    }

    return () => channel.close()
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bosses))

    channelRef.current?.postMessage({
      type: "SYNC",
      payload: bosses,
    })
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
        id: crypto.randomUUID(),
        ...data,
        createdAt: Date.now(),
      },
    ])
  }

  function removeBoss(id: string) {
    setBosses((prev) => prev.filter((b) => b.id !== id))
  }

  function createRoom() {
    const roomId = crypto.randomUUID()
    router.push(`/room/${roomId}`)
  }

  return (
    <main className="flex justify-center overflow-x-hidden">
      <div className="relative w-full max-w-md p-6 bg-white rounded-xl space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ROX Boss Tracker</h1>

          <button
            onClick={createRoom}
            className="px-3 py-1.5 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600"
          >
            Create Room
          </button>
        </div>

        <BossForm onAdd={addBoss} />

        <button
          onClick={() => setShowAttempts((v) => !v)}
          className="text-sm text-orange-500 underline self-start"
        >
          {showAttempts ? "Hide Attempts" : "View Attempts"}
        </button>

        {showAttempts && (
          <div className="absolute top-6 left-full ml-6 w-[360px]">
            <AttemptsLocal />
          </div>
        )}

        <BossList bosses={bosses} onExpire={removeBoss} />
      </div>
    </main>
  )
}