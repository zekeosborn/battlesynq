import {
  addRpcUrlOverrideToChain,
  type PrivyClientConfig,
} from '@privy-io/react-auth';
import { monadTestnet } from 'viem/chains';

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
const defaultRpcUrl = 'https://testnet-rpc.monad.xyz';

const monadTestnetOverride = addRpcUrlOverrideToChain(
  monadTestnet,
  rpcUrl || defaultRpcUrl,
);

const privyConfig: PrivyClientConfig = {
  defaultChain: monadTestnetOverride,
  supportedChains: [monadTestnetOverride],
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'all-users',
    },
  },
};

export default privyConfig;
