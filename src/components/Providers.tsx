'use client';

import privyConfig from '@/lib/blockchain/privyConfig';
import wagmiConfig from '@/lib/blockchain/wagmiConfig';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';

const ReactTogether = dynamic(
  () => import('react-together').then((module) => module.ReactTogether),
  { ssr: false },
);

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const multisynqAppId = process.env.NEXT_PUBLIC_MULTISYNQ_APP_ID!;
const multisynqApiKey = process.env.NEXT_PUBLIC_MULTISYNQ_API_KEY!;

if (!privyAppId) throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
if (!multisynqAppId) throw new Error('NEXT_PUBLIC_MULTISYNQ_APP_ID is not set');
if (!multisynqApiKey)
  throw new Error('NEXT_PUBLIC_MULTISYNQ_API_KEY is not set');

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <PrivyProvider appId={privyAppId} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ReactTogether
            sessionParams={{
              appId: multisynqAppId,
              apiKey: multisynqApiKey,
            }}
          >
            {children}
          </ReactTogether>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
