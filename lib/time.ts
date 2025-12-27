export function parseTime(time: string) {
    const [h, m, s] = time.split(":").map(Number)
    return h * 3600 + m * 60 + s
}

export function formatTime(sec: number) {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60

    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":")
}