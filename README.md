ROX Boss Hunt Tracker

A boss hunt tracker for Ragnarok X: Next Generation, built with Next.js, Tailwind CSS, and
shadcn/ui.
Tracks MVP & Mini bosses with countdown timers and persistent attempts using localStorage.

Features
- Track MVP and Mini bosses
- Live countdown timers
- Auto-remove boss when timer reaches 00:00:00
- Attempts tracker (MVP / Mini)
- Data persists after refresh

Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm

Prerequisites
- Node.js 18+
- pnpm

Getting Started
1. Clone repository
2. Run pnpm install
3. Run pnpm dev
4. Open http://localhost:3000

Project Structure
src/app - pages and layout
src/components - UI components
src/lib - helpers and boss data
public - static assets

Persistence
Boss timers and attempts are saved in localStorage. No backend required.

Commands
pnpm dev - start dev server
pnpm build - build production
pnpm start - run production build

Notes
Client-side only application. Timers depend on system time.

Credits
Built for Ragnarok X: Next Generation players.