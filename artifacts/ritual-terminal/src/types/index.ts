export interface FeedEntry {
  id: string
  address: string
  message: string
  timestamp: string
  type: 'user' | 'agent'
  status: 'confirmed' | 'pending' | 'failed'
  likes: number
  liked: boolean
  txHash?: string
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  txHash?: string
}

export interface Profile {
  name: string
  color?: string
  bio?: string
}
