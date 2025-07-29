'use client';

import Gateway from '@/components/game/Gateway';
import { Button } from '@/components/ui/button';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCreateRandomSession, useJoinUrl } from 'react-together';

export default function Home() {
  const router = useRouter();
  const { ready: privyReady, authenticated } = usePrivy();
  const { ready: walletsReady, wallets } = useWallets();
  const createRandomSession = useCreateRandomSession();
  const joinUrl = useJoinUrl();

  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  useEffect(() => {
    if (!joinUrl) return;
    router.replace(joinUrl);
  }, [joinUrl]);

  if (!privyReady) return null;

  if (!authenticated) {
    return (
      <div className="mt-[calc(((100svh-24px)/2)-80px)] px-6">
        <p className="mx-auto w-fit">Log in to play</p>
      </div>
    );
  }

  if (joinUrl) return <Gateway />;

  return (
    <div className="mt-[calc(((100svh-36px)/2)-80px)] px-6">
      <Button
        onClick={createRandomSession}
        disabled={!embeddedWallet}
        className="mx-auto flex"
      >
        Play Game
      </Button>
    </div>
  );
}
