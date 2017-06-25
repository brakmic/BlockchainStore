pragma solidity ^0.4.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Tokens/BaseStoreToken.sol";


contract TestBaseStoreToken {

  BaseStoreToken token;
  BaseStoreToken deployedToken;

  function beforeAll () {
    token = new BaseStoreToken();
    deployedToken = BaseStoreToken(DeployedAddresses.BaseStoreToken());
  }

  function testBaseStoreTokenUsingDeployedContract() {
    Assert.isTrue(address(deployedToken) != 0, "BaseStoreToken should be initializable");
  }

  function xtestTransferToken() {
    bool expected = true;
    address recipient = address(this);
    bool success = deployedToken.transfer(recipient, 10);
    Assert.equal(success, expected, "BaseStoreToken should be transferable");
  }

}
