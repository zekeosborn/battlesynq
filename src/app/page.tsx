'use client';

import Gateway from '@/components/game/Gateway';
import { Button } from '@/components/ui/button';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import {
  useCreateRandomSession,
  useIsTogether,
  useJoinUrl,
} from 'react-together';

export default function Home() {
  const [storedJoinUrl, setStoredJoinUrl] = useState<string | null>(null);
  const { authenticated } = usePrivy();
  const { ready: walletsReady, wallets } = useWallets();
  const createRandomSession = useCreateRandomSession();
  const isTogether = useIsTogether();
  const joinUrl = useJoinUrl();

  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  // Load saved join URL on mount
  useEffect(() => {
    const savedJoinUrl = localStorage.getItem('join-url');
    if (savedJoinUrl) setStoredJoinUrl(savedJoinUrl);
  }, []);

  // Save new join URL if changed
  useEffect(() => {
    if (!joinUrl || joinUrl === storedJoinUrl) return;
    localStorage.setItem('join-url', joinUrl);
    setStoredJoinUrl(joinUrl);
  }, [joinUrl, storedJoinUrl]);

  const resumeGame = () => {
    if (storedJoinUrl) window.location.href = storedJoinUrl;
  };

  if (!authenticated) {
    return (
      <div className="mt-[calc(((100svh-24px)/2)-80px)] px-6">
        <p className="mx-auto w-fit">Log in to play</p>
      </div>
    );
  }

  if (isTogether) return <Gateway />;

  return (
    <div className="mt-[calc(((100svh-88px)/2)-80px)] sm:mt-[calc(((100svh-36px)/2)-80px)]">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          onClick={createRandomSession}
          disabled={!embeddedWallet}
          className="w-fit"
        >
          Play Game
        </Button>

        <Button
          onClick={resumeGame}
          disabled={!storedJoinUrl || !embeddedWallet}
          className="w-fit"
        >
          Resume Game
        </Button>
      </div>
    </div>
  );
}
