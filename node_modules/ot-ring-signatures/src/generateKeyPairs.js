import Hasher from './lib/hasher.js';
import Prng from './lib/prng.js';
import PrivateKey from './lib/private-key.js';


export function generateKeyPairs(num) {
  const hasher = new Hasher();
  const prng = new Prng();

  const keyPairs = [];
  for (let i = 0; i< num; i++) {
    keyPairs.push(new PrivateKey(prng.random,hasher))
  }
  console.log(`${num} key pairs generated successfully.`);
  return keyPairs;
};
