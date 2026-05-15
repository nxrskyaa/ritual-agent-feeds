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
      alert('No wallet detected. Please install MetaMask.')
      return null
    }

    set({ isConnecting: true })
    try {
      const walletClient = createWalletClient({
        chain: RITUAL_CHAIN_CONFIG,
        transport: custom(window.ethereum),
      }).extend(publicActions)

      const [account] = await walletClient.requestAddresses()

      // Try to switch to Ritual chain
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${RITUAL_CHAIN_CONFIG.id.toString(16)}` }],
        })
      } catch (switchError: unknown) {
        // Chain not added yet, add it
        if ((switchError as { code: number }).code === 4902) {
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
        }
      }

      set({ address: account, isConnected: true, isConnecting: false })
      return account
    } catch (err) {
      console.error('Wallet connect error:', err)
      set({ isConnecting: false })
      return null
    }
  },

  disconnect: () => {
    set({ address: null, isConnected: false })
  },
}))
