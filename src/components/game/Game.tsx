'use client';

import { cn, shortenAddress } from '@/lib/utils';
import type { Cell, GameState, Player, Position } from '@/types/battleship';
import { useWallets } from '@privy-io/react-auth';
import { PartyPopper, Skull } from 'lucide-react';
import { Button } from '../ui/button';
import Board from './Board';
import { GameStatus } from './GameStatus';

interface Props {
  player1: Player | null;
  player2: Player | null;
  gameState: GameState;
  fireShot: (position: Position) => void;
  getCurrentPlayer: () => { player: Player; isPlayer1: boolean } | null;
  getEnemyPlayer: () => Player | null;
}

export default function Game({
  player1,
  player2,
  gameState,
  fireShot,
  getCurrentPlayer,
  getEnemyPlayer,
}: Props) {
  const { ready: walletsReady, wallets } = useWallets();
  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  if (!embeddedWallet || !player1 || !player2) return null;

  const currentPlayer = getCurrentPlayer();
  const enemyPlayer = getEnemyPlayer();

  if (!currentPlayer || !enemyPlayer) return null;

  const isMyTurn =
    (gameState.turn === 'player1' &&
      embeddedWallet.address === player1.address) ||
    (gameState.turn === 'player2' &&
      embeddedWallet.address === player2.address);

  const handleCellClick = (cell: Cell) => {
    if (!isMyTurn) return;
    if (cell.isHit || cell.isMiss) return; // Already fired at this position
    fireShot(cell.position);
  };

  if (gameState.phase === 'ended') {
    const isWinner =
      (gameState.winner === 'player1' &&
        embeddedWallet.address === player1.address) ||
      (gameState.winner === 'player2' &&
        embeddedWallet.address === player2.address);

    return (
      <div
        className={cn('px-6', {
          'mt-[calc(((100svh-150px)/2)-80px)]': isWinner,
          'mt-[calc(((100svh-100px)/2)-80px)]': !isWinner,
        })}
      >
        <div className="mx-auto w-fit space-y-8 text-center">
          <h1 className="flex items-center justify-center">
            {isWinner ? (
              <>
                <PartyPopper size="40" className="mr-4" />
                <span className="text-4xl font-bold">You Won!</span>
              </>
            ) : (
              <>
                <Skull size="40" className="mr-2" />
                <span className="text-4xl font-bold">You Lost!</span>
              </>
            )}
          </h1>

          <p className="text-lg">
            <span>
              {gameState.winner === 'player1' ? 'Player 1 ' : 'Player 2 '}
            </span>

            <span>
              (
              {shortenAddress(
                gameState.winner === 'player1'
                  ? player1.address
                  : player2.address,
              )}
              )
            </span>

            <span> wins the battle!</span>
          </p>

          {isWinner && <Button disabled>Claim NFT</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 mb-14 px-6 lg:mt-[calc(((100svh-400px)/2)-80px)] lg:w-fit">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Game Status */}
        <GameStatus
          embeddedWallet={embeddedWallet}
          gameState={gameState}
          player1={player1}
          player2={player2}
          className="lg:order-2"
        />

        {/* Your Grid */}
        <div className="space-y-4 lg:order-1">
          <h2 className="text-center text-xl font-bold">Your Fleet</h2>
          <Board
            grid={currentPlayer.player.grid}
            className="lg:h-fit lg:w-[400px]"
            showShips={true}
          />
        </div>

        {/* Enemy Grid */}
        <div className="space-y-4 lg:order-3">
          <h2 className="text-center text-xl font-bold">Enemy Waters</h2>
          <Board
            grid={enemyPlayer.grid}
            onClick={isMyTurn ? handleCellClick : undefined}
            className="lg:h-fit lg:w-[400px]"
            showShips={false}
          />
        </div>
      </div>
    </div>
  );
}
