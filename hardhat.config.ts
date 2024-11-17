import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.27',
  networks: {
    hardhat: {
      chainId: 1337,
      // accounts: [
      //   {
      //     privateKey: process.env.PRIVATE_KEY || '',
      //     balance: '1000000000000000000000',
      //   },
      // ],
    },
  },
  paths: {
    artifacts: './src/artifacts',
    cache: './src/cache',
    sources: './src/contracts',
    ignition: './src/ignition',
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
  },
};

export default config;
