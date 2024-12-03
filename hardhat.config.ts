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
    artifacts: '/tmp/hardhat/artifacts',
    cache: '/tmp/hardhat/cache',
    sources: '/tmp/hardhat/contracts',
    ignition: '/tmp/hardhat/ignition',
  },
  defaultNetwork: 'hardhat',
  typechain: {
    outDir: '/tmp/hardhat/typechain-types',
    target: 'ethers-v6',
  },
};

export default config;
