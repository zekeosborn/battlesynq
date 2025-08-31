import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatBalance, shortenAddress } from '@/lib/utils';
import { useLogout, usePrivy, useWallets } from '@privy-io/react-auth';
import Avatar from 'boring-avatars';
import { CircleDollarSign, KeyRound, LogOut, Wallet } from 'lucide-react';
import { useState } from 'react';
import type { Address } from 'viem';
import { useBalance } from 'wagmi';

// Avatar dropdown menu showing balance, embedded wallet
// as well as withdraw and logout actions
export default function AvatarMenu() {
  const [embeddedWalletCopied, setEmbeddedWalletCopied] = useState(false);
  const { logout } = useLogout();
  const { ready: walletsReady, wallets } = useWallets();
  const { ready: privyReady, exportWallet } = usePrivy();

  // Get the embedded wallet
  const embeddedWallet = walletsReady
    ? wallets.find((wallet) => wallet.walletClientType === 'privy')
    : undefined;

  // Get the embedded wallet balance
  const { data: balance } = useBalance({
    address: embeddedWallet?.address as Address,
    query: {
      enabled: !!embeddedWallet,
    },
  });

  // Copies the embedded wallet address to clipboard
  const copyEmbeddedWallet = async (event: Event) => {
    event.preventDefault();
    if (!embeddedWallet) return;

    try {
      await navigator.clipboard.writeText(embeddedWallet?.address);
      setEmbeddedWalletCopied(true);
      setTimeout(() => setEmbeddedWalletCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy embedded wallet: ', err);
    }
  };

  if (!embeddedWallet) {
    return <div className="size-10 rounded-full bg-sky-200" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar
          size={40}
          name={embeddedWallet.address}
          variant="ring"
          colors={['#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9']}
          className="cursor-pointer"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[225px] border-2">
        <DropdownMenuLabel className="text-base font-bold">
          Embedded Wallet
        </DropdownMenuLabel>

        {/* Balance */}
        <DropdownMenuItem className="focus:bg-transparent">
          <CircleDollarSign className="text-sky-800" />

          {balance ? (
            <span>
              {formatBalance(balance.value, balance.decimals)} {balance.symbol}
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </DropdownMenuItem>

        {/* Embedded Wallet Address*/}
        <DropdownMenuItem
          onSelect={copyEmbeddedWallet}
          className="flex cursor-pointer justify-between"
        >
          <div className="flex items-center gap-2">
            <Wallet className="text-sky-800" />
            <span>
              {embeddedWallet
                ? shortenAddress(embeddedWallet?.address)
                : 'Loading...'}
            </span>
          </div>

          <span>{embeddedWalletCopied ? 'Copied' : 'Copy'}</span>
        </DropdownMenuItem>

        {/* Export Private Key */}
        <DropdownMenuItem
          onSelect={() => privyReady && exportWallet()}
          className="cursor-pointer"
        >
          <KeyRound className="text-sky-800" />
          <span>Export Wallet</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="h-0.5" />

        {/* Logout */}
        <DropdownMenuItem onSelect={logout} className="cursor-pointer">
          <LogOut className="text-sky-800" /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
