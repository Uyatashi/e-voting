import BN from 'bn.js';
import elliptic from 'elliptic';
import keccakHash from 'keccak';
import Prng from '../../node_modules/ot-ring-signatures/dist/index';
import Hasher from '../../node_modules/ot-ring-signatures/dist/index';
import PrivateKey from '../../node_modules/ot-ring-signatures/dist/index';
import PublicKey from '../../node_modules/ot-ring-signatures/dist/index';
import Signature from '../../node_modules/ot-ring-signatures/dist/index';

export function setupParameters() {
  //Setup (Needs to be the same for everyone)
  const ECurve = new elliptic.eddsa('ed25519'); // Elliptic Curve
  const G = [ECurve.g.x,ECurve.g.y]; //Base point
  const hasher  = new Hasher.Hasher();
  const prng = new Prng.Prng();

  return [ECurve, G, hasher, prng];
};

export function generateKeyPair(secret, params) {
  const ec = params[0];
  const KeyPair = ec.keyFromSecret(secret); //Constructing key pairs this way might not be the best way
  return [KeyPair.priv(), KeyPair.pub()];
};

//Hash function
export function H(input){
  return keccakHash('keccak256').update(input).digest('hex');
};

export function ecPointToString(ecPoint) {
  return (ecPoint.x.toString() + ecPoint.y.toString() + ecPoint.z.toString())
};

//Just for testing purposes
export function generateVoterList(numberOfVoters) {
  const prng = new Prng.Prng();
  const hasher = new Hasher.Hasher();
  const voterList = [];

  for (let i=0; i < numberOfVoters; i++) {
    voterList.push(new PrivateKey.PrivateKey(prng.random,hasher).public_key);
  }
  return voterList;
};
