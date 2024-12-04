import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as path from 'path';
import * as fs from 'fs';

// Gunakan path yang lebih aman
const tmpPath = path.join(process.cwd(), '.hardhat_tmp');

// Pastikan direktori dibuat dengan izin yang benar
if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath, { recursive: true, mode: 0o777 });
}

const config: HardhatUserConfig = {
  solidity: '0.8.27',
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
      forking: undefined,
    },
  },
  paths: {
    artifacts: path.join(tmpPath, 'artifacts'),
    cache: path.join(tmpPath, 'cache'),
    sources: path.join(tmpPath, 'contracts'),
    ignition: path.join(tmpPath, 'ignition'),
  },
  defaultNetwork: 'hardhat',
  typechain: {
    outDir: 'tmp/hardhat/typechain-types',
    target: 'ethers-v6',
  },
};

// Set environment variable untuk direktori global Hardhat
process.env.HARDHAT_GLOBAL_DIR = tmpPath;

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
