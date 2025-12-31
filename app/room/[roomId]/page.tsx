"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { BossForm } from "@/components/BossForm"
import { BossList } from "@/components/BossList"
import { BossType } from "@/lib/bosses"
import { TrackedBoss } from "@/lib/types"
import { AttemptsRoom } from "@/components/attempts/attemptsRoom"


type DbBoss = {
  id: string
  room_id: string
  boss_id: string
  boss_name: string
  boss_type: BossType
  time_in_seconds: number
  created_at: string
}

function mapDbBoss(b: DbBoss): TrackedBoss {
  return {
    id: b.id,
    bossId: b.boss_id,
    bossName: b.boss_name,
    bossType: b.boss_type,
    timeInSeconds: b.time_in_seconds,
    createdAt: new Date(b.created_at).getTime(),
  }
}

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()

  const [mounted, setMounted] = useState(false)
  const [bosses, setBosses] = useState<TrackedBoss[]>([])
  const [showAttempts, setShowAttempts] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !roomId) return

    supabase
      .from("boss_tracks")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
          return
        }
        if (data) setBosses(data.map(mapDbBoss))
      })
  }, [mounted, roomId])

  useEffect(() => {
    if (!mounted || !roomId) return

    const channel = supabase
      .channel(`boss-tracks-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "boss_tracks",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setBosses((prev) => {
            if (prev.some((b) => b.id === payload.new.id)) return prev
            return [...prev, mapDbBoss(payload.new as DbBoss)]
          })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "boss_tracks",
        },
        (payload) => {
          setBosses((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mounted, roomId])

  async function addBoss(data: {
    bossId: string
    bossName: string
    bossType: BossType
    timeInSeconds: number
  }) {
    if (!roomId) return

    const { data: inserted, error } = await supabase
      .from("boss_tracks")
      .insert({
        room_id: roomId,
        boss_id: data.bossId,
        boss_name: data.bossName,
        boss_type: data.bossType,
        time_in_seconds: data.timeInSeconds,
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    setBosses((prev) => {
      if (prev.some((b) => b.id === inserted.id)) return prev
      return [...prev, mapDbBoss(inserted)]
    })
  }

  async function removeBoss(id: string) {
    await supabase.from("boss_tracks").delete().eq("id", id)
  }

  if (!mounted || !roomId) {
    return null
  }

  return (
    <div className="relative max-w-md mx-4 p-6 space-y-4 bg-white rounded-xl">
      <h1 className="text-2xl font-bold">ROX Boss Tracker</h1>

      <BossForm onAdd={addBoss} />

      <button
        onClick={() => setShowAttempts((v) => !v)}
        className="text-sm text-orange-500 underline"
      >
        {showAttempts ? "Hide Attempts" : "View Attempts"}
      </button>

      <BossList bosses={bosses} onExpire={removeBoss} />

      {showAttempts && (
        <div className="absolute top-0 left-full ml-2 w-[400px]">
          <AttemptsRoom roomId={roomId} />
        </div>
      )}
    </div>
  )
}