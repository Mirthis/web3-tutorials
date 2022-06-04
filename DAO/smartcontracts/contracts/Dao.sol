// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

interface IDaoContract {
  function balanceOf(address, uint256) external view returns(uint256);
}

contract MoralisDAO {

  address public owner;
  uint256 nextProposal;
  uint256[] public validTokens;
  IDaoContract daoContract;

  constructor() {
    owner = msg.sender;
    nextProposal = 1;
    daoContract = IDaoContract(0x2953399124F0cBB46d2CbACD8A89cF0599974963);
    validTokens = [14328378809295534319370225206961000861370307333310313602431309575872399278180];
  }

  struct proposal {
    uint256 id;
    bool exists;
    string description;
    uint deadline;
    uint256 votesUp;
    uint256 votesDown;
    address[] canVote;
    uint256 maxVotes;
    mapping(address => bool) voteStatus;
    bool countConducted;
    bool passed;
  }

  mapping(uint256 => proposal) public Proposals;


    event proposalCreated(
        uint256 id,
        string description,
        uint256 maxVotes,
        address proposer
    );

    event newVote(
        uint256 votesUp,
        uint256 votesDown,
        address voter,
        uint256  proposal,
        bool votedFor
    );

  event proposalCount(
    uint256 id,
    bool passed
  );

  function checkProposalEligibility(address _proposalist) private view returns (bool) {
    for(uint256 i=0; i<validTokens.length; i++) {
      if(daoContract.balanceOf(_proposalist, validTokens[i]) >= 1) {
        return true;
      }
    }
    return false;
  }

  function checkVoteEligibility(uint256 _id, address _voter) private view returns(bool) {
    for(uint256 i = 0; i< Proposals[_id].canVote.length; i++) {
      if(Proposals[_id].canVote[i] == _voter) {
        return true;
      }
    }
    return false;
  }

  function createProposal(string memory _description, address[] memory _canVote) public {
    require(checkProposalEligibility(msg.sender), "Only NFT holders can submit a new proposal");
    proposal storage newProposal = Proposals[nextProposal];
    newProposal.id = nextProposal;
    newProposal.exists = true;
    newProposal.description = _description;
    newProposal.deadline = block.number + 100;
    newProposal.canVote = _canVote;
    newProposal.maxVotes = _canVote.length;    
    emit proposalCreated(nextProposal, _description, _canVote.length, msg.sender);
  }
}
