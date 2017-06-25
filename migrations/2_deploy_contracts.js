var Store = artifacts.require("./Store.sol");
var BaseStoreToken = artifacts.require("./Tokens/BaseStoreToken.sol");

module.exports = function(deployer) {
  deployer.deploy(BaseStoreToken);
  deployer.deploy(Store);
};
