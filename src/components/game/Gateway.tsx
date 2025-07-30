'use client';

import useBattleship from '@/hooks/useBattleship';
import useJoinSession from '@/hooks/useJoinSession';
import { useCallback } from 'react';
import Game from './Game';
import Lobby from './Lobby';
import Setup from './Setup';

export default function Gateway() {
  const {
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
    resetGrid,
    placeShip,
    setReady,
    fireShot,
    getCurrentPlayer,
    getEnemyPlayer,
  } = useBattleship();

  useJoinSession({ player1, player2, setPlayer1, setPlayer2, setGameState });

  const markNftMinted = useCallback(() => {
    setGameState((prev) => (prev ? { ...prev, nftMinted: true } : prev));
  }, [setGameState]);

  if (gameState?.phase === 'setup')
    return (
      <Setup
        player1={player1}
        player2={player2}
        selectedShip={selectedShip}
        orientation={orientation}
        onSelectShip={setSelectedShip}
        onOrientationChange={setOrientation}
        placeShip={placeShip}
        resetGrid={resetGrid}
        setReady={setReady}
      />
    );

  if (gameState?.phase === 'playing' || gameState?.phase === 'ended')
    return (
      <Game
        player1={player1}
        player2={player2}
        gameState={gameState}
        fireShot={fireShot}
        onNftMinted={markNftMinted}
        getCurrentPlayer={getCurrentPlayer}
        getEnemyPlayer={getEnemyPlayer}
      />
    );

  return (
    <Lobby player1={player1} player2={player2} setGameState={setGameState} />
  );
}
