"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { AttemptsUI, AttemptRow } from "@/components/ViewAttempts"

export function AttemptsRoom({ roomId }: { roomId: string }) {
  const [rows, setRows] = useState<AttemptRow[]>([])

  useEffect(() => {
    if (!roomId) return

    supabase
      .from("attempts")
      .select("*")
      .eq("room_id", roomId)
      .order("attempt_at", { ascending: true })
      .then(({ data }) => {
        if (data) setRows(data)
      })
  }, [roomId])

  useEffect(() => {
    if (!roomId) return

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
        (payload) => {
          setRows((prev) => {
            if (payload.eventType === "INSERT") {
              return [...prev, payload.new as AttemptRow]
            }

            if (payload.eventType === "UPDATE") {
              return prev.map((r) =>
                r.id === payload.new.id
                  ? (payload.new as AttemptRow)
                  : r
              )
            }

            if (payload.eventType === "DELETE") {
              return prev.filter((r) => r.id !== payload.old.id)
            }

            return prev
          })
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
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )

    await supabase
      .from("attempts")
      .update({ [field]: value })
      .eq("id", id)
  }

  const remove = async (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
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