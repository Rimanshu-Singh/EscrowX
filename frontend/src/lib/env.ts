function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required public environment variable: ${name}`);
  }

  return value;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export const PUBLIC_ENV = {
  API_URL: trimTrailingSlash(requirePublicEnv('VITE_PUBLIC_API_URL', import.meta.env.VITE_PUBLIC_API_URL)),
  SOCKET_URL: trimTrailingSlash(
    import.meta.env.VITE_PUBLIC_SOCKET_URL || requirePublicEnv('VITE_PUBLIC_API_URL', import.meta.env.VITE_PUBLIC_API_URL)
  ),
  NETWORK_PASSPHRASE: requirePublicEnv(
    'VITE_PUBLIC_NETWORK_PASSPHRASE',
    import.meta.env.VITE_PUBLIC_NETWORK_PASSPHRASE
  ),
  HORIZON_URL: requirePublicEnv('VITE_PUBLIC_HORIZON_URL', import.meta.env.VITE_PUBLIC_HORIZON_URL),
  RPC_URL: requirePublicEnv('VITE_PUBLIC_RPC_URL', import.meta.env.VITE_PUBLIC_RPC_URL),
  CONTRACT_ID: requirePublicEnv('VITE_PUBLIC_CONTRACT_ID', import.meta.env.VITE_PUBLIC_CONTRACT_ID),
  ESCROWX_CONTRACT_ID: requirePublicEnv(
    'VITE_PUBLIC_ESCROWX_CONTRACT_ID',
    import.meta.env.VITE_PUBLIC_ESCROWX_CONTRACT_ID
  ),
  XLM_TOKEN_ADDRESS: requirePublicEnv('VITE_PUBLIC_XLM_TOKEN_ADDRESS', import.meta.env.VITE_PUBLIC_XLM_TOKEN_ADDRESS),
  NETWORK: requirePublicEnv('VITE_PUBLIC_NETWORK', import.meta.env.VITE_PUBLIC_NETWORK),
  STELLAR_EXPERT_BASE_URL: trimTrailingSlash(
    requirePublicEnv('VITE_PUBLIC_STELLAR_EXPERT_BASE_URL', import.meta.env.VITE_PUBLIC_STELLAR_EXPERT_BASE_URL)
  ),
} as const;

export const API_BASE_URL = `${PUBLIC_ENV.API_URL}/api`;

export function stellarExplorerUrl(path = ''): string {
  return path ? `${PUBLIC_ENV.STELLAR_EXPERT_BASE_URL}/${path.replace(/^\/+/, '')}` : PUBLIC_ENV.STELLAR_EXPERT_BASE_URL;
}
