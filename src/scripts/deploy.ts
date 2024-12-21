// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ethers } from 'hardhat';

async function main() {
  const Voting = await ethers.getContractFactory('Voting');
  const voting = await Voting.deploy();

  // Tunggu sampai contract deployed
  await voting.waitForDeployment();

  // Get contract address
  const address = await voting.getAddress();
  console.log('Voting contract deployed to:', address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
