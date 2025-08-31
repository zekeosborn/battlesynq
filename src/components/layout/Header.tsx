'use client';

import { Button } from '@/components/ui/button';
import useEmbeddedWallet from '@/hooks/useEmbeddedWallet';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { useLeaveSession } from 'react-together';
import AvatarMenu from './AvatarMenu';

export default function Header() {
  const { ready: privyReady, authenticated } = usePrivy();
  const { login } = useLogin();
  const leaveSession = useLeaveSession();
  useEmbeddedWallet();

  return (
    <header className="container mx-auto flex h-20 items-center justify-between px-6">
      <Link href="/" onClick={leaveSession} className="cursor-pointer">
        <h1 className="font-bebas-neue text-2xl font-bold md:text-3xl">
          BattleSynq
        </h1>
      </Link>

      {!privyReady ? (
        <Button disabled>Log In</Button>
      ) : authenticated ? (
        <AvatarMenu />
      ) : (
        <Button onClick={login}>Log In</Button>
      )}
    </header>
  );
}
