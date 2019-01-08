pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract Election1 {

  // Model a candidate
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  event votedEvent(uint indexed _candidateId);

  //Read/write candidate
  mapping(uint => Candidate) public candidates;

  //Store accounts that have voted
  mapping(address => bool) public voters;

  //Store Candidates count
  uint public candidatesCount;

  //Constructor
  constructor() public {
    addCandidate("Candidate 1");
    addCandidate("Candidate 2");

  }

  function addCandidate(string memory _name) private {
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);

  }

  function vote (uint _candidateId) public {
    //require that they haven't voted before
    require(!voters[msg.sender]);

    //require a valid candidate
    require(_candidateId > 0 && _candidateId <= candidatesCount);

    //record that voter has voted
    voters[msg.sender] = true;

    //update candidate vote count
    candidates[_candidateId].voteCount++;

    // trigger voted event
    emit votedEvent(_candidateId);

  }
}

contract Election {

  struct Voter {
    bool authenticated;
    bytes32 passwordHash;
    string publicKey;
    uint vote;   // index of the voted proposal
  }

  mapping(uint => Voter) public userCreds; //MAKE PRIVATE AGAIN

  //Maps ethereum address to the voter
  mapping(address => Voter) public voterList;

  //Needs to be turned to private
  address public ownerAddress;

  //string[] public voterList;

  //Constructor
  constructor() public {
      ownerAddress = msg.sender;

      //userCreds['uyatashi'] = keccak256('123');
      //userCreds['yuping'] = keccak256('456');
      //userCreds[1] = keccak256('antonis');
      userCreds[1] = Voter(false, keccak256('antonis'), '', 0);
  }

  // //Adds the voters public keys to the voters list
  // function addVotersToVoterList(voterPublicKeys) public {
  //
  // }

  // function compare(string memory _a, string memory _b) private returns (int) {
  //     bytes memory a = bytes(_a);
  //     bytes memory b = bytes(_b);
  //     uint minLength = a.length;
  //     if (b.length < minLength) minLength = b.length;
  //     //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
  //     for (uint i = 0; i < minLength; i ++)
  //         if (a[i] < b[i])
  //             return -1;
  //         else if (a[i] > b[i])
  //             return 1;
  //     if (a.length < b.length)
  //         return -1;
  //     else if (a.length > b.length)
  //         return 1;
  //     else
  //         return 0;
  // }
  //
  // function equal(string memory _a, string memory _b) private returns (bool) {
  //   return compare(_a, _b) == 0;
  // }

  // function authenticate(string memory username, bytes32 password) public returns (bool) {
  //   //if (equal(userCreds[username],password)) {
  //   //if (password == userCreds[username]) {
  //   if (password == userCreds[1].passwordHash) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

  // //Authenticate and add voter's public key in the voter's list
  // function joinVoterList() public {
  //   //Authenticate the voter
  //
  // }
  //
  // //Returns the list of candidates for the election with their public keys
  // function getCandidateList() public {
  //
  // }

}

contract Election_PoC {

  address public ownerAddress;
  string[] public voterPublicKeys;

  constructor() public {
      ownerAddress = msg.sender;
      //Add 2 candidates
  }

  //Adds the voters public keys to the voters list
  function addVotersToVoterList(string[] memory voterPubKeys) public {
    for (uint i=0; i<voterPubKeys.length; i++) {
      voterPublicKeys.push(voterPubKeys[i]);
    }
  }

}
