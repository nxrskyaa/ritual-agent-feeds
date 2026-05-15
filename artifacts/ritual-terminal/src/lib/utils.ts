import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function timeAgo(timestamp: string | number, now: number = Date.now()): string {
  let thenMs: number

  if (typeof timestamp === 'number') {
    // If it looks like seconds (< year 2100 in ms), convert; otherwise use as-is
    thenMs = timestamp > 1e12 ? timestamp : timestamp * 1000
  } else {
    thenMs = new Date(timestamp).getTime()
  }

  if (isNaN(thenMs)) return 'unknown'

  const diff = Math.floor((now - thenMs) / 1000)

  if (diff < 0) return 'just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const GRADIENT_COLORS = [
  ['#39FF14', '#22C55E'],
  ['#22C55E', '#16A34A'],
  ['#86EFAC', '#39FF14'],
  ['#4ADE80', '#22C55E'],
  ['#39FF14', '#86EFAC'],
  ['#06B6D4', '#39FF14'],
  ['#A78BFA', '#39FF14'],
  ['#F472B6', '#22C55E'],
]

export function getExplorerUrl(baseUrl: string | undefined, path: string): string | null {
  if (!baseUrl) return null
  return `${baseUrl}${path}`
}

export function getAddressGradient(address: string): string {
  const index = parseInt(address.slice(2, 4), 16) % GRADIENT_COLORS.length
  const [from, to] = GRADIENT_COLORS[index]
  return `linear-gradient(135deg, ${from}, ${to})`
}
