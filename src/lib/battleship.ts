import type {
  Grid,
  Orientation,
  Position,
  Ship,
  ShipConfig,
  ShipType,
} from '@/types/battleship';

/**
 * Constants
 */

const gridSize = 10;

// Configuration for each ship type
export const shipConfigs: Record<ShipType, ShipConfig> = {
  carrier: { type: 'carrier', size: 5 },
  battleship: { type: 'battleship', size: 4 },
  cruiser: { type: 'cruiser', size: 3 },
  submarine: { type: 'submarine', size: 3 },
  destroyer: { type: 'destroyer', size: 2 },
};

/**
 * Helper Functions
 */

// Create a deep copy of the grid state
const cloneGrid = (grid: Grid): Grid => ({
  cells: grid.cells.map((row) => row.map((cell) => ({ ...cell }))),
  ships: [...grid.ships],
});

// Check if position is within the grid boundaries
function isValidPosition({ row, col }: Position) {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}

// Generate all positions a ship would occupy
function getShipPositions(
  { row, col }: Position,
  size: number,
  orientation: Orientation,
): Position[] {
  return Array.from({ length: size }, (_, i) =>
    orientation === 'horizontal'
      ? { row, col: col + i }
      : { row: row + i, col },
  );
}

// Check if a ship can be placed at a starting position
function canPlaceShip(
  grid: Grid,
  startPos: Position,
  size: number,
  orientation: Orientation,
) {
  const positions = getShipPositions(startPos, size, orientation);

  // Each position must be valid, empty, and not adjacent to other ships
  const canPlaceShip = positions.every((position) => {
    return (
      isValidPosition(position) &&
      !grid.cells[position.row][position.col].hasShip &&
      !hasAdjacentShips(grid, position, positions)
    );
  });

  return canPlaceShip;
}

// Check if there are any ships adjacent to a given position
function hasAdjacentShips(
  grid: Grid,
  targetPosition: Position,
  currentPositions: Position[],
): boolean {
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      const adjacentPosition = {
        row: targetPosition.row + rowOffset,
        col: targetPosition.col + colOffset,
      };

      const hasAdjacentShip =
        isValidPosition(adjacentPosition) &&
        grid.cells[adjacentPosition.row][adjacentPosition.col].hasShip;

      const isNotPartOfCurrentShip = !currentPositions.some(
        (existing) =>
          existing.row === adjacentPosition.row &&
          existing.col === adjacentPosition.col,
      );

      if (hasAdjacentShip && isNotPartOfCurrentShip) return true;
    }
  }

  return false;
}

// Get all available ship configurations
export function getAvailableShips() {
  return Object.values(shipConfigs);
}

/**
 * Core Functions
 */

// Create an empty grid with no ships
export function createEmptyGrid(): Grid {
  const emptyGrid = {
    cells: Array.from({ length: gridSize }, (_, row) =>
      Array.from({ length: gridSize }, (_, col) => ({
        position: { row, col },
        hasShip: false,
      })),
    ),
    ships: [],
  };

  return emptyGrid;
}

// Attempt to place a ship on the grid
export function placeShip(
  grid: Grid,
  shipType: ShipType,
  startPos: Position,
  orientation: Orientation,
): Grid | null {
  const { size } = shipConfigs[shipType];

  // Validate if the ship can be placed
  if (!canPlaceShip(grid, startPos, size, orientation)) return null;

  const newGrid = cloneGrid(grid);
  const positions = getShipPositions(startPos, size, orientation);
  const shipId = `${shipType}-${Date.now()}`;

  // Create ship object
  const ship: Ship = {
    id: shipId,
    type: shipType,
    size,
    positions,
    orientation,
    hits: 0,
    isSunk: false,
  };

  // Mark cells with ship placement
  positions.forEach(({ row, col }) => {
    newGrid.cells[row][col] = {
      ...newGrid.cells[row][col],
      hasShip: true,
      shipId,
    };
  });

  newGrid.ships.push(ship);
  return newGrid;
}

// Fire a shot at a specific position on the enemy grid
export function fireShot(grid: Grid, position: Position): Grid | null {
  const { row, col } = position;

  // Check if position is valid
  if (!isValidPosition(position)) return null;

  const cell = grid.cells[row][col];

  // Check if position has already been fired upon
  if (cell.isHit || cell.isMiss) return null;

  const newGrid = cloneGrid(grid);
  const newCell = newGrid.cells[row][col];

  if (cell.hasShip && cell.shipId) {
    // Hit!
    newCell.isHit = true;

    // Update ship hit count
    const ship = newGrid.ships.find((s) => s.id === cell.shipId);
    if (ship) {
      ship.hits += 1;
      // Check if ship is sunk
      if (ship.hits >= ship.size) {
        ship.isSunk = true;
      }
    }
  } else {
    // Miss!
    newCell.isMiss = true;
  }

  return newGrid;
}

// Check if all ships on a grid are sunk
export function areAllShipsSunk(grid: Grid): boolean {
  return grid.ships.length > 0 && grid.ships.every((ship) => ship.isSunk);
}

// Check if a player is ready (all ships placed)
export function isPlayerReady(grid: Grid): boolean {
  const requiredShips = Object.keys(shipConfigs).length;
  return grid.ships.length === requiredShips;
}
