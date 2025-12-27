"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { formatTime } from "@/lib/time"

type Boss = {
  type: string
  seconds: number
}

export function BossCard({ boss }: { boss: Boss }) {
  const [remain, setRemain] = useState<number>(boss.seconds)

  useEffect(() => {
    if (remain <= 0) return

    const interval = setInterval(() => {
      setRemain((v: number) => v - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [remain])

  return (
    <Card>
      <CardContent className="flex justify-between py-4">
        <span className="font-semibold">{boss.type}</span>
        <span>{formatTime(remain)}</span>
      </CardContent>
    </Card>
  )
}