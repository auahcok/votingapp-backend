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
    artifacts: 'temp/hardhat/artifacts',
    cache: 'temp/hardhat/cache',
    sources: 'temp/hardhat/contracts',
    ignition: 'temp/hardhat/ignition',
  },
  defaultNetwork: 'hardhat',
  typechain: {
    outDir: 'temp/hardhat/typechain-types',
    target: 'ethers-v6',
  },
};

export default config;

// paths: {
//   artifacts: './src/artifacts',
//   cache: './src/cache',
//   sources: './src/contracts',
//   ignition: './src/ignition',
// },
// defaultNetwork: 'hardhat',
// typechain: {
//   outDir: 'typechain-types',
//   target: 'ethers-v6',
// },

// solidity: '0.8.27',
//   networks: {
//     hardhat: {
//       chainId: 1337,
//       // accounts: [
//       //   {
//       //     privateKey: process.env.PRIVATE_KEY || '',
//       //     balance: '1000000000000000000000',
//       //   },
//       // ],
//     },
//   },
//   paths: {
//     artifacts: 'tmp/hardhat/artifacts',
//     cache: 'tmp/hardhat/cache',
//     sources: 'tmp/hardhat/contracts',
//     ignition: 'tmp/hardhat/ignition',
//   },
//   defaultNetwork: 'localhost',
//   typechain: {
//     outDir: 'tmp/hardhat/typechain-types',
//     target: 'ethers-v6',
//   },
