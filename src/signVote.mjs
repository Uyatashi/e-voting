import BN from 'bn.js';
//import eddsa from '../node_modules/elliptic/lib/elliptic.mjs';
//import {eddsa as EdDSA} from 'elliptic';
//import elliptic from 'elliptic';
import eddsa from 'elliptic';
import crypto from 'crypto';
import keccakHash from 'keccak';
import utils from 'ethereumjs-util'

export function generateKeyPair(secret) {
  const KeyPair = ec.keyFromSecret(secret);
  return (KeyPair.priv(), KeyPair.pub());
};

export function setupParameters() {
  //Setup (Needs to be the same for everyone)
  const ec = new eddsa('ed25519'); // Elliptic Curve
  const G = [ec.g.x,ec.g.y]; //Base point
  return (ec, G);
};

//Vote for candidate. candidateKeyPairs is a
//candidateKeyPairs = [(a,A),(b,B)]
export function voteForCandidate(candidateKeyPairs, params) {
  const ec = params[0];
  const G = params[1];

  //Voter computes a random key
  const randomKeyPair = generateKeyPair('voterrandomsecret'); //Must introduce randomness here
  //Voter computes the Stealth Address of the candidate
  const SA = ec.g.mul(new BN(H(candidateKeyPairs[0][1].mul(randomKeyPair[0]).encode('hex')))).add(candidateKeyPairs[1][1]).encode('hex');

  //Final vote before signing
  const vote = (SA, randomKeyPair[1]) // (SA,R)
  console.log(`Vote: ${vote}`);

  //Make a transaction, sign it and send it to the contract
};

const params = setupParameters();
const candidateAKeyPairs = [generateKeyPair('candidateasecreta'), generateKeyPair('candidateasecretb')]
voteForCandidate(candidateAKeyPairs, params);
// //Example Run for 2 candidates A and B
// //Setup
// const ec, G = setupParameters();
// //Candidate 1
// const candidateAKeyPairs = [generateKeyPair('candidateasecreta'), generateKeyPair('candidateasecretb')]
// //Candidate 2
// const candidateBKeyPairs = [generateKeyPair('candidatebsecreta'), generateKeyPair('candidatebsecretb')]
// //Voter computes a random key
// const randomKeyPair = generateKeyPair('voterrandomsecret');
// //Voter computes SA with Candidate B's public keys
// const candidatePubKeyA = candidateBKeyPairs[0][1];
// const candidatePubKeyB = candidateBKeyPairs[1][1];
// const SA = ec.g.mul(new BN(H(candidatePubKeyA.mul(randomKeyPair[0]).encode('hex')))).add(candidatePubKeyB).encode('hex');
// //Final vote before signing
// const vote = (SA, randomKeyPair[1]) // (SA,R)
