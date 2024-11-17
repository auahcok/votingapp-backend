/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Voting contract', function () {
  let Voting;
  let voting;

  beforeEach(async function () {
    Voting = await ethers.getContractFactory('Voting');
    voting = await Voting.deploy();
    await voting.waitForDeployment(); // Perubahan di sini
  });

  it('Should cast a vote successfully', async function () {
    console.log("5");
    const userId = 'user1';
    const eventId = 'event1';
    const candidateId = 'candidate1';

    await voting.castVote(userId, eventId, candidateId);

    const vote = await voting.getVote(userId, eventId, candidateId);
    expect(vote.userId).to.equal(userId);
    expect(vote.eventId).to.equal(eventId);
    expect(vote.candidateId).to.equal(candidateId);
  });

  it('Should not allow duplicate votes', async function () {
    const userId = 'user1';
    const eventId = 'event1';
    const candidateId = 'candidate1';

    await voting.castVote(userId, eventId, candidateId);

    await expect(
      voting.castVote(userId, eventId, candidateId)
    ).to.be.revertedWith('Vote already exists');
  });

  it('Should not allow a user to vote more than once in an event', async function () {
    const userId = 'user1';
    const eventId = 'event1';
    const candidateId1 = 'candidate1';
    const candidateId2 = 'candidate2';

    await voting.castVote(userId, eventId, candidateId1);

    await expect(
      voting.castVote(userId, eventId, candidateId2)
    ).to.be.revertedWith('User has already voted in this event');
  });
});
