'use client';

import { shortenAddress } from '@/lib/utils';
import type { GameState, Player } from '@/types/battleship';
import { useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { useJoinUrl } from 'react-together';
import { Button } from '../ui/button';

interface Props {
  player1: Player | null;
  player2: Player | null;
  setGameState?: (gameState: GameState | null) => void;
}

export default function Lobby({ player1, player2, setGameState }: Props) {
  const [joinUrlCopied, setJoinUrlCopied] = useState(false);
  const { ready: walletsReady, wallets } = useWallets();
  const joinUrl = useJoinUrl();

  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  const copyJoinUrl = async () => {
    if (!joinUrl || joinUrlCopied) return;

    try {
      await navigator.clipboard.writeText(joinUrl);
      setJoinUrlCopied(true);
      setTimeout(() => setJoinUrlCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy join URL: ', err);
    }
  };

  const canStartSetup = player1 && player2;
  const startSetup = () => {
    if (!setGameState || !canStartSetup) return;
    setGameState({ phase: 'setup' });
  };

  return (
    <div className="mt-[calc(((100svh-168px)/2)-80px)] px-6">
      <div className="mx-auto w-xs space-y-6 rounded-md border-2 border-sky-300 bg-sky-100 p-6">
        <div className="space-y-2">
          {/* Display Player 1 info */}
          <p>
            <span className="font-bold">Player 1:</span>&nbsp;
            {player1 ? shortenAddress(player1.address) : '...'}&nbsp;
            {embeddedWallet && embeddedWallet?.address === player1?.address && (
              <span className="font-bold">(You)</span>
            )}
          </p>

          {/* Display Player 2 info */}
          <p>
            <span className="font-bold">Player 2:</span>&nbsp;
            {player2 ? shortenAddress(player2.address) : '...'}&nbsp;
            {embeddedWallet && embeddedWallet?.address === player2?.address && (
              <span className="font-bold">(You)</span>
            )}
          </p>
        </div>

        {/* Copy Join URL button */}
        <Button onClick={copyJoinUrl} className="w-full">
          {joinUrlCopied ? 'Copied' : 'Copy Join URL'}
        </Button>

        {/* Start Setup button (when both players joined) */}
        {canStartSetup && setGameState && (
          <Button onClick={startSetup} className="w-full">
            Start Game Setup
          </Button>
        )}
      </div>
    </div>
  );
}
