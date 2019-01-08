import {generateKeyPair, setupParameters, H, ecPointToString, generateVoterList} from './lib/voterFunctions';
import BN from 'bn.js';
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
for (let i=0; i<5; i++) {
  voterKeyPairs.push(generateKeyPair('voter' + i, params));
};

//Add the voter public keys to the voter list



console.log(voterKeyPairs);
const voterKeyPair = generateKeyPair('voterA', params);
const voterPrivateKey = new PrivateKey.PrivateKey(voterKeyPair[0], params[2]);

//The second key pair should be identity-based!
const candidateAKeyPairs = [generateKeyPair('candidateasecreta', params), generateKeyPair('candidateasecretb', params)];

//construct vote for candidateA
let vote = voteForCandidate(candidateAKeyPairs, params);
console.log(vote);

//Generate a sample voter list of 4 keys
const voterListPublicKeys = generateVoterList(5);

const signature = signVote(vote, voterPrivateKey, voterListPublicKeys);
console.log(signature);
//
// const transactionData = [vote, signature];
// //Make a transaction, sign it and send it to the contract
