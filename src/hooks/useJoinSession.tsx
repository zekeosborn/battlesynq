'use client';

import { createEmptyGrid } from '@/lib/battleship';
import type { GameState, Player } from '@/types/battleship';
import { useWallets } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useLeaveSession } from 'react-together';

interface Props {
  player1: Player | null;
  player2: Player | null;
  setPlayer1: (player: Player | null) => void;
  setPlayer2: (player: Player | null) => void;
  setGameState: (gameState: GameState | null) => void;
}

export default function useJoinSession({
  player1,
  player2,
  setPlayer1,
  setPlayer2,
  setGameState,
}: Props) {
  const { ready: walletsReady, wallets } = useWallets();
  const leaveSession = useLeaveSession();

  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  useEffect(() => {
    if (!embeddedWallet) return;

    if (
      embeddedWallet.address === player1?.address ||
      embeddedWallet.address === player2?.address
    ) {
      return;
    }

    if (!player1) {
      setPlayer1({
        address: embeddedWallet.address,
        grid: createEmptyGrid(),
        isReady: false,
      });
      if (player2) setGameState({ phase: 'setup' });
      return;
    }

    if (!player2) {
      setPlayer2({
        address: embeddedWallet.address,
        grid: createEmptyGrid(),
        isReady: false,
      });
      if (player1) setGameState({ phase: 'setup' });
      return;
    }

    leaveSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embeddedWallet]);
}
