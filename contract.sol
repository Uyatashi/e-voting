pragma solidity ^0.5.1;

// contract.sol --combined-json abi,asm,ast,bin,bin-runtime,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
//Sample contract used for testing purposes
contract Hello {

  string public message;

  constructor(string memory initialMessage) public {
    message = initialMessage;
  }

  function setMessage(string memory newMessage) public {
    message = newMessage;
  }
}

contract votingProtocol {

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

  //Authenticate and add voter's public key in the voter's list
  function joinVoterList() public {
    //Authenticate the voter

  }
}
