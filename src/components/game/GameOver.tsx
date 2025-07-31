import nftAbi from '@/lib/blockchain/nftAbi';
import { cn, shortenAddress } from '@/lib/utils';
import type { GameState, Player } from '@/types/battleship';
import type { ConnectedWallet } from '@privy-io/react-auth';
import { LoaderCircle, PartyPopper, Skull } from 'lucide-react';
import { useEffect } from 'react';
import { type Address, decodeEventLog } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Button } from '../ui/button';

interface Props {
  embeddedWallet: ConnectedWallet;
  gameState: GameState;
  player1: Player;
  player2: Player;
  onNftMinted: () => void;
}

const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS as Address;
if (!nftAddress) throw new Error('NEXT_PUBLIC_NFT_ADDRESS is not set');

export default function GameOver({
  embeddedWallet,
  gameState,
  player1,
  player2,
  onNftMinted,
}: Props) {
  const isWinner =
    (gameState.winner === 'player1' &&
      embeddedWallet.address === player1.address) ||
    (gameState.winner === 'player2' &&
      embeddedWallet.address === player2.address);

  const { data: hash, writeContract, isPending } = useWriteContract();

  const mintNFT = () => {
    if (!isWinner || gameState.nftMinted) return;

    writeContract({
      abi: nftAbi,
      address: nftAddress,
      functionName: 'publicMint',
      gas: 500_000n,
      maxFeePerGas: 100_000_000_000n,
      maxPriorityFeePerGas: 5_000_000_000n,
    });
  };

  const { data: receipt, isLoading } = useWaitForTransactionReceipt({ hash });
  const isPendingOrLoading = isPending || isLoading;

  useEffect(() => {
    if (!receipt) return;

    receipt.logs.forEach((log) => {
      const decoded = decodeEventLog({
        abi: nftAbi,
        data: log.data,
        topics: log.topics,
      });

      if (decoded.eventName === 'Minted') {
        alert('NFT Minted Successfully!');
        onNftMinted();
      }
    });
  }, [onNftMinted, receipt]);

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
              <span className="text-4xl font-bold">You Win!</span>
            </>
          ) : (
            <>
              <Skull size="40" className="mr-2" />
              <span className="text-4xl font-bold">You Lose!</span>
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

        {isWinner && (
          <Button
            onClick={mintNFT}
            disabled={!isWinner || gameState.nftMinted || isPendingOrLoading}
          >
            {isPendingOrLoading && (
              <LoaderCircle className="size-[22px] animate-spin text-white" />
            )}
            Claim NFT
          </Button>
        )}
      </div>
    </div>
  );
}
