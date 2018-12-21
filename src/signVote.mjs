import BN from 'bn.js';
import elliptic from 'elliptic';
import keccakHash from 'keccak';
import Prng from '../node_modules/ot-ring-signatures/dist/index';
import Hasher from '../node_modules/ot-ring-signatures/dist/index';
import PrivateKey from '../node_modules/ot-ring-signatures/dist/index';
import PublicKey from '../node_modules/ot-ring-signatures/dist/index';
import Signature from '../node_modules/ot-ring-signatures/dist/index';

export function generateKeyPair(secret, params) {
  const ec = params[0];
  const KeyPair = ec.keyFromSecret(secret); //Constructing key pairs this way might not be the best way
  return [KeyPair.priv(), KeyPair.pub()];
};

export function setupParameters() {
  //Setup (Needs to be the same for everyone)
  const ECurve = new elliptic.eddsa('ed25519'); // Elliptic Curve
  const G = [ECurve.g.x,ECurve.g.y]; //Base point
  const hasher  = new Hasher.Hasher();
  const prng = new Prng.Prng();

  return [ECurve, G, hasher, prng];
};

//Hash function
export function H(input){
  return keccakHash('keccak256').update(input).digest('hex');
};

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

function ecPointToString(ecPoint) {
  return (ecPoint.x.toString() + ecPoint.y.toString() + ecPoint.z.toString())
};

//Returns JUST the signature
export function signVote(vote, voterPrivateKey, voterListPublicKeys) {
  //Concatenate SA and R before signing
  const msg = vote[0] + ecPointToString(vote[1]);
  const signature = voterPrivateKey.sign(msg, voterListPublicKeys);
  return signature;
};

//Just for testing purposes
function generateVoterList(numberOfVoters) {
  const prng = new Prng.Prng();
  const hasher = new Hasher.Hasher();
  const voterList = [];

  for (let i=0; i < numberOfVoters; i++) {
    voterList.push(new PrivateKey.PrivateKey(prng.random,hasher).public_key);
  }
  return voterList;
};

//Setup
const params = setupParameters();

//Generate a key pair for the voter for test purposes
const voterKeyPair = generateKeyPair('voterA', params);
const voterPrivateKey = new PrivateKey.PrivateKey(voterKeyPair[0], params[2]);

//The second key pair should be identity-based!
const candidateAKeyPairs = [generateKeyPair('candidateasecreta', params), generateKeyPair('candidateasecretb', params)];

//construct vote for candidateA
let vote = voteForCandidate(candidateAKeyPairs, params);

//Generate a sample voter list of 4 keys
const voterListPublicKeys = generateVoterList(5);

const signature = signVote(vote, voterPrivateKey, voterListPublicKeys);
console.log(signature);

const transactionData = [vote, signature];
//Make a transaction, sign it and send it to the contract
