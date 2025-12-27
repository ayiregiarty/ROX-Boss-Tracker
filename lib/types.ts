import { BossType } from "@/lib/bosses"

export type TrackedBoss = {
  id: string
  bossId: string
  bossName: string
  bossType: BossType
  timeInSeconds: number
  createdAt: number
}