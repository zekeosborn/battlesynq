import { createConfig } from '@privy-io/wagmi';
import { monadTestnet } from 'viem/chains';
import { http } from 'wagmi';

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(rpcUrl),
  },
});

export default wagmiConfig;
