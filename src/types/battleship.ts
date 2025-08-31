export type Phase = 'setup' | 'playing' | 'ended';

export type ShipType =
  | 'carrier'
  | 'battleship'
  | 'cruiser'
  | 'submarine'
  | 'destroyer';

export type Orientation = 'horizontal' | 'vertical';

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  position: Position;
  hasShip: boolean;
  shipId?: string;
  isHit?: boolean;
  isMiss?: boolean;
}

export interface Ship {
  id: string;
  type: ShipType;
  size: number;
  positions: Position[];
  orientation: Orientation;
  hits: number;
  isSunk: boolean;
}

export interface Grid {
  cells: Cell[][];
  ships: Ship[];
}

export interface ShipConfig {
  type: ShipType;
  size: number;
}

export interface Player {
  address: string;
  grid: Grid;
  isReady: boolean;
}

export interface GameState {
  phase: Phase;
  turn?: 'player1' | 'player2';
  winner?: 'player1' | 'player2';
  nftMinted?: boolean;
}
