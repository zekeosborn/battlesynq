'use client';

import * as bs from '@/lib/battleship';
import type {
  Cell,
  GameState,
  Orientation,
  Player,
  Position,
  ShipType,
} from '@/types/battleship';
import { useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { useStateTogether } from 'react-together';

export default function useBattleship() {
  const [player1, setPlayer1] = useStateTogether<Player | null>(
    'player1',
    null,
  );

  const [player2, setPlayer2] = useStateTogether<Player | null>(
    'player2',
    null,
  );

  const [gameState, setGameState] = useStateTogether<GameState | null>(
    'game-state',
    null,
  );

  // Get embedded wallet
  const { ready: walletsReady, wallets } = useWallets();
  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [orientation, setOrientation] = useState<Orientation>('horizontal');

  // Place ship on the active player's grid
  const placeShip = ({ position }: Cell) => {
    if (!selectedShip || !embeddedWallet || !player1 || !player2) return;

    const isPlayer1 = embeddedWallet.address === player1.address;
    const isPlayer2 = embeddedWallet.address === player2.address;
    const player = isPlayer1 ? player1 : isPlayer2 ? player2 : null;
    const setPlayer = isPlayer1 ? setPlayer1 : isPlayer2 ? setPlayer2 : null;

    if (!player || !setPlayer) return;

    const newGrid = bs.placeShip(
      player.grid,
      selectedShip,
      position,
      orientation,
    );

    if (!newGrid) return;

    setPlayer({ ...player, grid: newGrid });
    setSelectedShip(null);
  };

  // Reset grid for active player
  const resetGrid = () => {
    if (!embeddedWallet || !player1 || !player2) return;

    const isPlayer1 = embeddedWallet.address === player1.address;
    const isPlayer2 = embeddedWallet.address === player2.address;
    const player = isPlayer1 ? player1 : isPlayer2 ? player2 : null;
    const setPlayer = isPlayer1 ? setPlayer1 : isPlayer2 ? setPlayer2 : null;

    if (!player || !setPlayer) return;

    setPlayer({ ...player, grid: bs.createEmptyGrid(), isReady: false });
    setSelectedShip(null);
  };

  // Mark player as ready
  const setReady = () => {
    if (!embeddedWallet || !player1 || !player2) return;

    const isPlayer1 = embeddedWallet.address === player1.address;
    const isPlayer2 = embeddedWallet.address === player2.address;
    const player = isPlayer1 ? player1 : isPlayer2 ? player2 : null;
    const setPlayer = isPlayer1 ? setPlayer1 : isPlayer2 ? setPlayer2 : null;

    if (!player || !setPlayer) return;
    if (!bs.isPlayerReady(player.grid)) return;

    setPlayer({ ...player, isReady: true });

    // Check if both players are ready to start the game
    const otherPlayer = isPlayer1 ? player2 : player1;
    if (otherPlayer.isReady && bs.isPlayerReady(otherPlayer.grid)) {
      setGameState({ phase: 'playing', turn: 'player1' });
    }
  };

  // Fire shot at enemy grid
  const fireShot = (position: Position) => {
    if (!embeddedWallet || !player1 || !player2 || !gameState) return;
    if (gameState.phase !== 'playing') return;

    const isPlayer1 = embeddedWallet.address === player1.address;
    const isPlayer2 = embeddedWallet.address === player2.address;

    // Check if it's the current player's turn
    if (
      (isPlayer1 && gameState.turn !== 'player1') ||
      (isPlayer2 && gameState.turn !== 'player2')
    ) {
      return;
    }

    // Fire at the enemy's grid
    const enemyPlayer = isPlayer1 ? player2 : player1;
    const setEnemyPlayer = isPlayer1 ? setPlayer2 : setPlayer1;

    const newGrid = bs.fireShot(enemyPlayer.grid, position);
    if (!newGrid) return; // Invalid shot

    setEnemyPlayer({ ...enemyPlayer, grid: newGrid });

    // Check for game end
    if (bs.areAllShipsSunk(newGrid)) {
      setGameState({
        phase: 'ended',
        winner: isPlayer1 ? 'player1' : 'player2',
      });
      return;
    }

    // Switch turns
    setGameState({
      ...gameState,
      turn: gameState.turn === 'player1' ? 'player2' : 'player1',
    });
  };

  // Get current player info
  const getCurrentPlayer = () => {
    if (!embeddedWallet || !player1 || !player2) return null;

    const isPlayer1 = embeddedWallet.address === player1.address;
    return isPlayer1
      ? { player: player1, isPlayer1: true }
      : { player: player2, isPlayer1: false };
  };

  // Get enemy player info
  const getEnemyPlayer = () => {
    if (!embeddedWallet || !player1 || !player2) return null;

    const isPlayer1 = embeddedWallet.address === player1.address;
    return isPlayer1 ? player2 : player1;
  };

  return {
    player1,
    player2,
    gameState,
    selectedShip,
    orientation,
    setPlayer1,
    setPlayer2,
    setGameState,
    setSelectedShip,
    setOrientation,
    placeShip,
    resetGrid,
    setReady,
    fireShot,
    getCurrentPlayer,
    getEnemyPlayer,
  };
}
