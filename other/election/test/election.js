var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  // it("initializes with two candidates", function() {
  //   return Election.deployed().then(function(instance) {
  //     return instance.candidatesCount();
  //   }).then(function(count) {
  //     assert.equal(count, 2);
  //   });
  // });

  it("check if owner address is correct", function() {
    return Election.deployed().then(function(instance) {
      return instance.ownerAddress();
    }).then(function(ownerAddress) {
      assert.equal(ownerAddress, accounts[0], "ownerAddress set correctly");
    })
  });

  
});
