'use client';

import { useWallets } from '@privy-io/react-auth';
import { useSetActiveWallet } from '@privy-io/wagmi';
import { useEffect, useMemo } from 'react';

export default function useEmbeddedWallet() {
  const { ready: walletsReady, wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();

  // Get the embedded wallet
  const embeddedWallet = useMemo(() => {
    if (!walletsReady) return;
    return wallets.find((wallet) => wallet.walletClientType === 'privy');
  }, [walletsReady, wallets]);

  // Set the embedded wallet as the active wallet
  useEffect(() => {
    if (!embeddedWallet) return;

    const activateEmbeddedWallet = async () => {
      try {
        await setActiveWallet(embeddedWallet);
      } catch (err) {
        console.error('Failed to set embedded wallet as active wallet:', err);
      }
    };

    activateEmbeddedWallet();
  }, [embeddedWallet, setActiveWallet]);
}
