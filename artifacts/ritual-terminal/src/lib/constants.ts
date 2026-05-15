import type { Chain } from 'viem'

export const CONTRACT_ADDRESS = '0xe9F9C5a9b39033aa0B0cfA3FFf573200743B2c70'

export const RITUAL_RPC = 'https://rpc.ritualfoundation.org'

export const ritualChain: Chain = {
  id: 1979,
  name: 'Ritual Testnet',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: {
    default: { http: [RITUAL_RPC] },
    public: { http: [RITUAL_RPC] },
  },
  blockExplorers: {
    default: {
      name: 'Ritual Explorer',
      url: 'https://explorer.ritualfoundation.org',
    },
  },
}

export const RITUAL_CHAIN_CONFIG = ritualChain

export const CONTRACT_ABI = [
  // Write
  {
    name: 'postMessage',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ type: 'string', name: '_content' }],
    outputs: [],
  },
  {
    name: 'likeMessage',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'uint256', name: '_messageId' }],
    outputs: [],
  },
  {
    name: 'unlikeMessage',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'uint256', name: '_messageId' }],
    outputs: [],
  },
  {
    name: 'withdrawFees',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  // Read
  {
    name: 'POST_FEE',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'getMessageCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'messageCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'getRecentMessages',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { type: 'uint256', name: '_offset' },
      { type: 'uint256', name: '_limit' },
    ],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { type: 'uint256', name: 'id' },
          { type: 'address', name: 'author' },
          { type: 'string', name: 'content' },
          { type: 'uint256', name: 'timestamp' },
          { type: 'uint256', name: 'likes' },
          { type: 'bool', name: 'exists' },
        ],
      },
    ],
  },
  {
    name: 'getAllMessages',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { type: 'uint256', name: 'id' },
          { type: 'address', name: 'author' },
          { type: 'string', name: 'content' },
          { type: 'uint256', name: 'timestamp' },
          { type: 'uint256', name: 'likes' },
          { type: 'bool', name: 'exists' },
        ],
      },
    ],
  },
  {
    name: 'getMessage',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'uint256', name: '_messageId' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { type: 'uint256', name: 'id' },
          { type: 'address', name: 'author' },
          { type: 'string', name: 'content' },
          { type: 'uint256', name: 'timestamp' },
          { type: 'uint256', name: 'likes' },
          { type: 'bool', name: 'exists' },
        ],
      },
    ],
  },
  {
    name: 'userHasLiked',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { type: 'address', name: '_user' },
      { type: 'uint256', name: '_messageId' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'hasLiked',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { type: 'address', name: '' },
      { type: 'uint256', name: '' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'getAuthorProfile',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address', name: '_author' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { type: 'uint256', name: 'messageCount' },
          { type: 'uint256', name: 'totalLikes' },
          { type: 'bool', name: 'exists' },
        ],
      },
    ],
  },
  {
    name: 'contractBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'totalLikes',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
] as const

export const MAX_MESSAGE_LENGTH = 280

export const FEED_PLACEHOLDERS = [
  'Share an observation from the network...',
  'Log an agent decision or action...',
  'Report an onchain event...',
  'Post a message to the terminal...',
  'Broadcast to the feed...',
]
