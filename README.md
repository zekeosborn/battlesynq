# BattleSynq 🚢

Real-time multiplayer Battleship with blockchain integration. Connect your wallet, battle friends, and win NFTs!

## Features

- **Real-time Multiplayer** - Synchronized gameplay using Multisynq
- **Wallet Integration** - Connect with Privy authentication  
- **NFT Rewards** - Win commemorative NFTs on Monad testnet
- **Modern UI** - Clean interface built with Next.js and Tailwind CSS

## Quick Start

1. **Clone and install**
```bash
git clone https://github.com/zekeosborn/battlesynq.git
cd battlesynq
npm install
```

2. **Set up environment**  
Create `.env`:
```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_MULTISYNQ_APP_ID=your_multisynq_app_id  
NEXT_PUBLIC_MULTISYNQ_API_KEY=your_multisynq_api_key
NEXT_PUBLIC_RPC_URL=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_NFT_ADDRESS=your_nft_contract_address
```

3. **Run locally**
```bash
npm run dev
```
Open `http://localhost:3000`

## How to Play

1. Connect your wallet
2. Create/join a game session  
3. Place your ships on the grid
4. Take turns attacking opponent coordinates
5. First to sink all ships wins NFTs!
