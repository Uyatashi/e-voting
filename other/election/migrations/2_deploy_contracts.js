//var Election = artifacts.require("./Election.sol");
var Election_PoC = artifacts.require("./Election_PoC.sol");

module.exports = function(deployer) {
  //deployer.deploy(Election);
  deployer.deploy(Election_PoC);
};
