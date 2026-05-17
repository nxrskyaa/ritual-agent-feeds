import { create } from 'zustand'
import { createWalletClient, custom, publicActions } from 'viem'
import { RITUAL_CHAIN_CONFIG } from '@/lib/constants'

interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<string | null>
  disconnect: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnected: false,
  isConnecting: false,

  connect: async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet detected. Please install MetaMask.')
    }

    set({ isConnecting: true })
    try {
      const walletClient = createWalletClient({
        chain: RITUAL_CHAIN_CONFIG,
        transport: custom(window.ethereum),
      }).extend(publicActions)

      const [account] = await walletClient.requestAddresses()

      // Try to switch to Ritual chain — wrapped separately so user rejection doesn't kill the whole flow
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${RITUAL_CHAIN_CONFIG.id.toString(16)}` }],
        })
      } catch (switchError: unknown) {
        const code = (switchError as { code: number }).code
        // 4902 = chain not added, -32603 = internal error, 4001 = user rejected
        if (code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${RITUAL_CHAIN_CONFIG.id.toString(16)}`,
                  chainName: RITUAL_CHAIN_CONFIG.name,
                  nativeCurrency: RITUAL_CHAIN_CONFIG.nativeCurrency,
                  rpcUrls: RITUAL_CHAIN_CONFIG.rpcUrls.default.http,
                  ...(RITUAL_CHAIN_CONFIG.blockExplorers && {
                    blockExplorerUrls: [RITUAL_CHAIN_CONFIG.blockExplorers.default.url],
                  }),
                },
              ],
            })
          } catch (addErr) {
            // User rejected chain add — still connected, just on wrong chain
            console.warn('User declined to add Ritual chain:', addErr)
          }
        } else if (code === 4001) {
          // User rejected chain switch — still connected, just on wrong chain
          console.warn('User declined chain switch')
        } else {
          console.warn('Chain switch error:', switchError)
        }
      }

      set({ address: account, isConnected: true, isConnecting: false })
      return account
    } catch (err) {
      console.error('Wallet connect error:', err)
      set({ isConnecting: false })
      throw err // Re-throw so callers can handle it
    }
  },

  disconnect: () => {
    set({ address: null, isConnected: false })
  },
}))
