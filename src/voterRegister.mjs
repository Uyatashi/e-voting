//Voter needs to authenticate in the contract in order to get in to the voter voterList
import {setupParameters, generateKeyPair} from './lib/voterFunctions';

//0: Setup
const params = setupParameters();

//1: Generate his keypair
const keyPair = generateKeyPair('voterAA', params);
console.log(keyPair);
