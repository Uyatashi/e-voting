import {generateKeyPair, setupParameters, H, ecPointToString, generateVoterList} from './lib/voterFunctions';
import BN from 'bn.js';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import XMLHttpRequest  from 'xmlhttprequest';
import PrivateKey from '../node_modules/ot-ring-signatures/dist/index';


//Vote for candidate
//candidateKeyPairs = [[a,A],[b,B]]
//***B should be derived from the candidate's name(string)
export function voteForCandidate(candidateKeyPairs, params) {
  const ec = params[0];
  const G = params[1];

  //Voter computes a random key
  const randomKeyPair = generateKeyPair('voterrandomsecret', params); //Must introduce randomness here
  //Voter computes the Stealth Address of the candidate
  const SA = ec.g.mul(new BN(H(candidateKeyPairs[0][1].mul(randomKeyPair[0]).encode('hex')))).add(candidateKeyPairs[1][1]).encode('hex');

  //The vote before signing
  const vote = [SA, randomKeyPair[1]] // (SA,R)
  return vote;
};

//Returns JUST the signature
export function signVote(vote, voterPrivateKey, voterListPublicKeys) {
  //Concatenate SA and R before signing
  const msg = vote[0] + ecPointToString(vote[1]);
  const signature = voterPrivateKey.sign(msg, voterListPublicKeys);
  return signature;
};


//Setup
const params = setupParameters();

//Generate the key pairs for the voters
const voterKeyPairs = [];
for (let i=0; i<10; i++) {
  voterKeyPairs.push(generateKeyPair('voter' + i, params));
};
console.log(voterKeyPairs);

//Add the voter public keys to the voter list
function initWeb3(provider) {
  const web3 = new Web3(provider);
  return web3;
};

const web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = initWeb3(web3Provider);
console.log(web3);

function loadJSON(callback) {
   var xobj = new XMLHttpRequest.XMLHttpRequest();
   //xobj.overrideMimeType("application/json");
   xobj.open('GET', 'Election_PoC.json', true); // Replace 'my_data' with the path to your file
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}

// const Election_PoC = TruffleContract(loadJSON("Election_PoC.json"));
// Election_PoC.setProvider(web3Provider);
//
// console.log(Election_PoC.deployed().then())
// Election_PoC.deployed().then(function(instance) {
//   console.log(instance);
// }).catch(function(err) {
//   console.log(err);
// })
// let instance = Election_PoC.deployed();
// console.log(instance.then());
