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
  const [bosses, setBosses] = useState<TrackedBoss[]>([])
  const [showAttempts, setShowAttempts] = useState(false)

  useEffect(() => {
    if (!roomId) return

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
  }, [roomId])

  /* ---------- realtime sync ---------- */
  useEffect(() => {
    if (!roomId) return

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
            const exists = prev.some((b) => b.id === payload.new.id)
            if (exists) return prev
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
  }, [roomId])

  async function addBoss(data: {
    bossId: string
    bossName: string
    bossType: BossType
    timeInSeconds: number
  }) {
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
      const exists = prev.some((b) => b.id === inserted.id)
      if (exists) return prev
      return [...prev, mapDbBoss(inserted)]
    })
  }

  async function removeBoss(id: string) {
    await supabase.from("boss_tracks").delete().eq("id", id)
  }

  useEffect(() => {
    console.log("ROOM ID FROM URL:", roomId)
  
    supabase
      .from("boss_tracks")
      .select("*")
      .then((res) => {
        console.log("ALL boss_tracks:", res)
      })
  }, [roomId])

  return (
    <div className="relative max-w-md mx-auto p-6 space-y-4 bg-white rounded-xl">
      <h1 className="text-2xl font-bold">ROX Boss Tracker</h1>

      <BossForm onAdd={addBoss} />

      <button
        onClick={() => setShowAttempts((v) => !v)}
        className="text-sm text-orange-500 underline self-start"
      >
        {showAttempts ? "Hide Attempts" : "View Attempts"}
      </button>

      <BossList bosses={bosses} onExpire={removeBoss} />

      {showAttempts && (
        <div className="absolute top-6 left-full ml-6 w-[360px]">
          <AttemptsRoom roomId={roomId} />
        </div>
      )}
    </div>
  )
}