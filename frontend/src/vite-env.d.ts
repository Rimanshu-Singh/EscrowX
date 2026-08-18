/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_API_URL: string;
  readonly VITE_PUBLIC_SOCKET_URL?: string;
  readonly VITE_PUBLIC_NETWORK_PASSPHRASE: string;
  readonly VITE_PUBLIC_HORIZON_URL: string;
  readonly VITE_PUBLIC_RPC_URL: string;
  readonly VITE_PUBLIC_CONTRACT_ID: string;
  readonly VITE_PUBLIC_ESCROWX_CONTRACT_ID: string;
  readonly VITE_PUBLIC_XLM_TOKEN_ADDRESS: string;
  readonly VITE_PUBLIC_NETWORK: string;
  readonly VITE_PUBLIC_STELLAR_EXPERT_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
