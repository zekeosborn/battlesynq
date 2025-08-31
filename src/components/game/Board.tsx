'use client';

import { cn } from '@/lib/utils';
import type { Cell, Grid } from '@/types/battleship';
import { Bomb, Ship, X } from 'lucide-react';

interface Props {
  grid: Grid;
  onClick?: (cell: Cell) => void;
  className?: string;
  showShips?: boolean;
}

export default function Board({
  grid,
  onClick,
  className,
  showShips = true,
}: Props) {
  return (
    <div
      className={cn(
        'grid w-full grid-cols-10 rounded-md border-t-2 border-l-2 border-sky-300 bg-sky-100',
        className,
      )}
    >
      {grid.cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const ship = grid.ships.find((ship) => ship.id === cell.shipId);

          // Determine what to show in the cell
          let cellContent = null;
          let cellBgClass = '';

          if (cell.isHit) {
            cellContent =
              ship && (ship.isSunk || showShips) ? (
                <Ship size={20} />
              ) : (
                <Bomb size={20} />
              );

            cellBgClass = 'bg-red-300';
          } else if (cell.isMiss) {
            cellContent = <X size={20} />;
            cellBgClass = 'bg-sky-200';
          } else if (ship && showShips) {
            cellContent = <Ship size={20} />;

            // Background color by ship type (only when showing ships)
            if (ship.type === 'carrier') cellBgClass = 'bg-purple-300';
            else if (ship.type === 'battleship') cellBgClass = 'bg-green-300';
            else if (ship.type === 'cruiser') cellBgClass = 'bg-yellow-200';
            else if (ship.type === 'submarine') cellBgClass = 'bg-orange-200';
            else if (ship.type === 'destroyer') cellBgClass = 'bg-red-200';
          }

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onClick?.(cell)}
              disabled={!onClick || cell.isHit || cell.isMiss}
              className={cn(
                {
                  // Base styling
                  'flex aspect-square cursor-pointer items-center justify-center border-r-2 border-b-2 border-sky-300': true,

                  // Rounded corners for grid edges
                  'rounded-tl-md': rowIndex === 0 && colIndex === 0,
                  'rounded-tr-md': rowIndex === 0 && colIndex === 9,
                  'rounded-bl-md': rowIndex === 9 && colIndex === 0,
                  'rounded-br-md': rowIndex === 9 && colIndex === 9,

                  // Enable hover when button is clickable
                  'hover:bg-sky-200': onClick && !cell.isHit && !cell.isMiss,

                  // Disable button on certain conditions
                  'cursor-not-allowed': !onClick || cell.isHit || cell.isMiss,
                },
                cellBgClass,
              )}
            >
              {cellContent}
            </button>
          );
        }),
      )}
    </div>
  );
}
