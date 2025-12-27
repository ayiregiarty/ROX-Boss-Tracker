"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { AttemptsUI, AttemptRow } from "@/components/ViewAttempts"

export function AttemptsRoom({ roomId }: { roomId: string }) {
  const [rows, setRows] = useState<AttemptRow[]>([])

  useEffect(() => {
    supabase
      .from("attempts")
      .select("*")
      .eq("room_id", roomId)
      .order("attempt_at", { ascending: true })
      .then(({ data }) => data && setRows(data))
  }, [roomId])

  useEffect(() => {
    const channel = supabase
      .channel(`attempts-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attempts",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          supabase
            .from("attempts")
            .select("*")
            .eq("room_id", roomId)
            .then(({ data }) => data && setRows(data))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const add = async () => {
    await supabase.from("attempts").insert({
      room_id: roomId,
      character_name: "",
      mvp: 3,
      mini: 3,
    })
  }

  const update = async (
    id: string,
    field: "character_name" | "mvp" | "mini",
    value: string | number
  ) => {
    await supabase.from("attempts").update({ [field]: value }).eq("id", id)
  }

  const remove = async (id: string) => {
    await supabase.from("attempts").delete().eq("id", id)
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