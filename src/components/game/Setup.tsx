'use client';

import { getAvailableShips } from '@/lib/battleship';
import type { Cell, Orientation, Player, ShipType } from '@/types/battleship';
import { useWallets } from '@privy-io/react-auth';
import Board from './Board';
import { LobbyStatus } from './GameStatus';
import ShipSelector from './ShipSelector';

interface Props {
  player1: Player | null;
  player2: Player | null;
  selectedShip: ShipType | null;
  orientation: Orientation;
  onSelectShip: (ship: ShipType | null) => void;
  onOrientationChange: (orientation: Orientation) => void;
  placeShip: (cell: Cell) => void;
  resetGrid: () => void;
  setReady: () => void;
}

export default function Setup({
  player1,
  player2,
  selectedShip,
  orientation,
  onSelectShip,
  onOrientationChange,
  placeShip,
  resetGrid,
  setReady,
}: Props) {
  const { ready: walletsReady, wallets } = useWallets();
  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  if (!embeddedWallet || !player1 || !player2) return null;

  const isPlayer1 = embeddedWallet.address === player1.address;
  const isPlayer2 = embeddedWallet.address === player2.address;
  const player = isPlayer1 ? player1 : isPlayer2 ? player2 : null;

  if (!player) return null;

  const availableShips = getAvailableShips().filter(
    (shipConfig) =>
      !player.grid.ships.some((ship) => ship.type === shipConfig.type),
  );

  return (
    <div className="container mx-auto mt-8 mb-14 px-6 lg:mt-[calc(((100svh-400px)/2)-80px)] lg:w-fit">
      <div className="flex flex-col-reverse gap-8 lg:flex-row">
        <ShipSelector
          availableShips={availableShips}
          selectedShip={selectedShip}
          orientation={orientation}
          onSelectShip={onSelectShip}
          onOrientationChange={onOrientationChange}
        />

        <Board
          grid={player.grid}
          onClick={placeShip}
          className="lg:h-fit lg:w-[400px]"
        />

        <LobbyStatus
          player1={player1}
          player2={player2}
          availableShips={availableShips}
          onResetGrid={resetGrid}
          onReady={setReady}
        />
      </div>
    </div>
  );
}
