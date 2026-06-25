export const STELLAR_CONFIG = {
  NETWORK_PASSPHRASE: import.meta.env.VITE_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  HORIZON_URL: import.meta.env.VITE_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  RPC_URL: import.meta.env.VITE_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org',
  CONTRACT_ID: import.meta.env.VITE_PUBLIC_CONTRACT_ID || 'CCSJJFN2GRTNPGDYM7XPVEFCQ6NHRE7P7NVR4KAR2UISXQTWPIB6EYSB',
  NETWORK: import.meta.env.VITE_PUBLIC_NETWORK || 'TESTNET',
} as const;
