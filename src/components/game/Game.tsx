'use client';

import type { Cell, GameState, Player, Position } from '@/types/battleship';
import { useWallets } from '@privy-io/react-auth';
import Board from './Board';
import GameOver from './GameOver';
import { GameStatus } from './GameStatus';

interface Props {
  player1: Player | null;
  player2: Player | null;
  gameState: GameState;
  fireShot: (position: Position) => void;
  getCurrentPlayer: () => { player: Player; isPlayer1: boolean } | null;
  getEnemyPlayer: () => Player | null;
  onNftMinted: () => void;
}

export default function Game({
  player1,
  player2,
  gameState,
  fireShot,
  getCurrentPlayer,
  getEnemyPlayer,
  onNftMinted,
}: Props) {
  const { ready: walletsReady, wallets } = useWallets();
  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  const currentPlayer = getCurrentPlayer();
  const enemyPlayer = getEnemyPlayer();

  if (
    !embeddedWallet ||
    !player1 ||
    !player2 ||
    !currentPlayer ||
    !enemyPlayer
  ) {
    return (
      <div className="mt-[calc(((100svh-24px)/2)-80px)]">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

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
    return (
      <GameOver
        embeddedWallet={embeddedWallet}
        gameState={gameState}
        player1={player1}
        player2={player2}
        onNftMinted={onNftMinted}
      />
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
