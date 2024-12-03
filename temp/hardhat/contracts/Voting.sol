// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Voting {
  struct Vote {
    string userId;
    string eventId;
    string candidateId;
  }

  mapping(bytes32 => Vote) public votes;
  mapping(bytes32 => bool) public hasVoted;

  function castVote(
    string memory userId,
    string memory eventId,
    string memory candidateId
  ) public {
    bytes32 voteHash = keccak256(
      abi.encodePacked(userId, eventId, candidateId)
    );
    bytes32 userEventHash = keccak256(
      abi.encodePacked(userId, eventId)
    );
    require(bytes(votes[voteHash].userId).length == 0, 'Vote already exists');
    require(!hasVoted[userEventHash], 'User has already voted in this event');

    votes[voteHash] = Vote(userId, eventId, candidateId);
    hasVoted[userEventHash] = true;

    // bytes32 voteHash = keccak256(
    //   abi.encodePacked(userId, eventId, candidateId)
    // );
    // require(bytes(votes[voteHash].userId).length == 0, 'Vote already exists');

    // votes[voteHash] = Vote(userId, eventId, candidateId);
  }

  function getVote(
    string memory userId,
    string memory eventId,
    string memory candidateId
  ) public view returns (Vote memory) {
    bytes32 voteHash = keccak256(
      abi.encodePacked(userId, eventId, candidateId)
    );
    return votes[voteHash];
  }
}
