// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const VotingModule = buildModule('VotingModule', (m) => {
  // Deploy Voting contract without any constructor parameters
  const voting = m.contract('Voting', []);

  return { voting };
});

export default VotingModule;
