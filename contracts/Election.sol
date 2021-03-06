pragma solidity ^0.5.0;

// contract.sol --combined-json abi,asm,ast,bin,bin-runtime,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
//Sample contract used for testing purposes

contract Election {

  struct Voter {
    bool voted;  // if true, that person already voted
    uint vote;   // index of the voted proposal
    string publicKey;
  }

  //Needs to be turned to private
  address public ownerAddress;

  string[] public voterList;

  //Constructor
  constructor() public {
      ownerAddress = msg.sender;
  }

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
