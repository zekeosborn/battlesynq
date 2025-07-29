'use client';

import * as bs from '@/lib/battleship';
import { cn, shortenAddress } from '@/lib/utils';
import type { GameState, Player, ShipConfig } from '@/types/battleship';
import { type ConnectedWallet, useWallets } from '@privy-io/react-auth';
import { Button } from '../ui/button';

interface GameStatusProps {
  embeddedWallet: ConnectedWallet;
  player1: Player;
  player2: Player;
  gameState: GameState;
  className?: string;
}

export function GameStatus({
  embeddedWallet,
  player1,
  player2,
  gameState,
  className,
}: GameStatusProps) {
  return (
    <div
      className={cn(
        'w-full space-y-6 rounded-md border-2 border-sky-300 bg-sky-100 p-6 lg:h-fit lg:w-[300px]',
        className,
      )}
    >
      <div className="space-y-2">
        <p>
          <span className="font-bold">Player 1: </span>
          {shortenAddress(player1.address)}
          {embeddedWallet.address === player1.address && (
            <span className="font-bold"> (You)</span>
          )}
        </p>

        <p>
          <span className="font-bold">Player 2: </span>
          {shortenAddress(player2.address)}
          {embeddedWallet.address === player2.address && (
            <span className="font-bold"> (You)</span>
          )}
        </p>

        <p>
          <span className="font-bold">Current Turn: </span>
          {gameState.turn === 'player1' ? (
            <span
              className={cn({
                'font-bold text-green-500':
                  embeddedWallet.address === player1.address,
              })}
            >
              Player 1
            </span>
          ) : (
            <span
              className={cn({
                'font-bold text-green-500':
                  embeddedWallet.address === player2.address,
              })}
            >
              Player 2
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

interface LobbyStatusProps {
  player1: Player | null;
  player2: Player | null;
  availableShips: ShipConfig[];
  onResetGrid?: () => void;
  onReady?: () => void;
}

export function LobbyStatus({
  player1,
  player2,
  availableShips,
  onResetGrid,
  onReady,
}: LobbyStatusProps) {
  const { ready: walletsReady, wallets } = useWallets();
  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  if (!embeddedWallet || !player1 || !player2) return null;

  const maxShips = Object.entries(bs.shipConfigs).length;
  const isPlayer1 = embeddedWallet.address === player1.address;
  const currentPlayer = isPlayer1 ? player1 : player2;

  return (
    <div className="w-full space-y-6 rounded-md border-2 border-sky-300 bg-sky-100 p-6 lg:h-fit lg:w-[300px]">
      {/* Display current game status for each player */}
      <div className="space-y-2">
        <p>
          <span className="font-bold">Player 1</span>
          {player1.isReady ? ' is ready! ' : ' is setting up... '}
          {isPlayer1 && <span className="font-bold">(You)</span>}
        </p>

        <p>
          <span className="font-bold">Player 2</span>
          {player2.isReady ? ' is ready! ' : ' is setting up... '}
          {!isPlayer1 && <span className="font-bold">(You)</span>}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onReady}
          disabled={availableShips.length > 0 || currentPlayer.isReady}
          className="flex-1"
        >
          Ready
        </Button>

        <Button
          onClick={onResetGrid}
          disabled={availableShips.length === maxShips}
          className="flex-1"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
