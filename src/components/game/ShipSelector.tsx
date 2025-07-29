'use client';

import { capitalize, cn } from '@/lib/utils';
import type { Orientation, ShipConfig, ShipType } from '@/types/battleship';
import { Ship } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  availableShips: ShipConfig[];
  selectedShip: ShipType | null;
  orientation: Orientation;
  onSelectShip: (ship: ShipType | null) => void;
  onOrientationChange: (orientation: Orientation) => void;
}

export default function ShipSelector({
  availableShips,
  selectedShip,
  orientation,
  onSelectShip,
  onOrientationChange,
}: Props) {
  return (
    <div className="w-full space-y-6 rounded-md border-2 border-sky-300 bg-sky-100 p-6 lg:h-fit lg:w-[300px]">
      {availableShips.length > 0 ? (
        <>
          {/* Render list of available ships */}
          <div className="space-y-4">
            <h2 className="font-bold">Available Ships</h2>
            <div className="space-y-4">
              {availableShips.map(({ type, size }) => (
                <Button
                  key={type}
                  variant="ghost"
                  onClick={() => onSelectShip(type)}
                  className={cn({
                    // Base styling
                    'w-full justify-start': true,

                    // Background color by ship type
                    'bg-purple-300 hover:bg-purple-200': type === 'carrier',
                    'bg-green-300 hover:bg-green-200': type === 'battleship',
                    'bg-yellow-200 hover:bg-yellow-100': type === 'cruiser',
                    'bg-orange-200 hover:bg-orange-100': type === 'submarine',
                    'bg-red-200 hover:bg-red-100': type === 'destroyer',

                    // Highlight selected ship
                    'border-2 border-sky-300': selectedShip === type,
                  })}
                >
                  <Ship /> {capitalize(type)} ({size} blocks)
                </Button>
              ))}
            </div>
          </div>

          {/* Orientation selector shown only when a ship is selected */}
          {selectedShip && (
            <div className="space-y-4">
              <h2 className="font-bold">Orientation</h2>
              <div className="flex gap-3">
                <Button
                  variant={orientation === 'horizontal' ? 'default' : 'outline'}
                  onClick={() => onOrientationChange('horizontal')}
                  className="flex-1"
                >
                  Horizontal
                </Button>

                <Button
                  variant={orientation === 'vertical' ? 'default' : 'outline'}
                  onClick={() => onOrientationChange('vertical')}
                  className="flex-1"
                >
                  Vertical
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <p>All ship has been deployed!</p>
          <p>Ready for battle!</p>
        </div>
      )}
    </div>
  );
}
