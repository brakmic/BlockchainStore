pragma solidity ^0.4.8;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Store.sol";

contract TestStore {

  Store store;
  address defaultOwner;
  address dummy;
  address customerAddress;

  function beforeAll() {
    store = new Store();
    defaultOwner = address(this);
    dummy = address(0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDEADBEEF);
    customerAddress = address(0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFAA);
    store.registerProduct(0, "default test product", "default description",
                                                                        50, 1);
    store.registerProduct(55, "default test product 55", "default desc 55",
                                                                        55, 1);
  }

  function testInitialBalanceUsingDeployedContract() {

    Store _store = Store(DeployedAddresses.Store());

    uint expected = 0;

    Assert.equal(_store.getBalance(), expected,
                                      "Store should have 0 in initial balance");
  }

  function testRenameStore() {
     bool expected = true;

     bool result = store.renameStoreTo("myTestStore");

     Assert.equal(result, expected, "Store name should be changeable");
  }

  function testRegisterProduct() {
    bool expected = true;

    bool result = store.registerProduct(99, "t-shirt", "lacoste", 40, 1);

    Assert.equal(result, expected, "Store should register a product");
  }

  function testDeregisterProduct() {
    bool expected = true;

    bool result = store.deregisterProduct(99);

    Assert.equal(result, expected, "Store should de-register a product");
  }

  function testRegisterCustomer() {
    address customer = address(customerAddress);
    bool expected = true;

    bool result = store.registerCustomer(customer, "Harris", 100);

    Assert.equal(result, expected, "Store should register a customer");
  }

  function testDeregisterCustomer() {
    address customer = address(customerAddress);
    bool expected = true;

    bool result = store.deregisterCustomer(customer);

    Assert.equal(result, expected, "Store should de-register a customer");
  }

  function testReturnsProductInformation() {
    bytes32 prod_name = bytes32("default test product");
    bytes32 prod_desc = bytes32("default description");
    uint prod_price  = 50;
    uint prod_default_amount = 1;

    var (_name, _desc, _price, _amount) = store.getProduct(0);

    bool stringsEqual = (sha3(_name) == sha3(prod_name)) && (sha3(_desc) ==
                                                               sha3(prod_desc));
    bool numsEqual = (_price == prod_price) && (_amount == prod_default_amount);
    bool allOk = stringsEqual && numsEqual;

    Assert.isTrue(allOk, "Store should return a previously registered product");
  }

  function testInsertProductIntoCart() {
    address customer = address(this);
    Store _store = new Store();
    // switch to a dummy-owner because a seller can't be its own customer
    _store.changeOwner(dummy);
    // we can now register ourselves as "customer"
    var _regOk = _store.delegatecall(
              bytes4(sha3("registerCustomer(address, bytes, uint)")),customer,
                                                        "DummyCustomer1", 100);
    var _insertOk = _store.call(
                              bytes4(sha3("insertProductIntoCart(uint)")), 55);
    Assert.isTrue(_insertOk && _regOk,
              "Customer should be able to insert a product into shopping cart");
  }

  function testRemoveProductFromCart() {
    // switch to a dummy-owner because a seller can't be its own customer
    address customer = address(this);
    Store _store = new Store();
    _store.changeOwner(dummy);
    var _regOk = _store.delegatecall(
              bytes4(sha3("registerCustomer(address, bytes, uint)")),customer,
                                                        "DummyCustomer1", 100);
    var _insertOk = _store.call(
                              bytes4(sha3("insertProductIntoCart(uint)")), 55);
    bool _removeOk = _store.call(bytes4(sha3("removeProductFromCart(uint)")), 0);
    bool _cartEmpty = _store.call(bytes4(sha3("getCart()")));
    bool allOk = _regOk && _removeOk && _insertOk && _cartEmpty;
    Assert.isTrue(allOk,
               "Customer should be able to remove products from shopping cart");
  }

  function testCheckoutCart() {
    // switch to a dummy-owner because a seller can't be its own customer
    address customer = address(this);
    Store _store = new Store();
    _store.changeOwner(dummy);
    var _regOk = _store.delegatecall(
              bytes4(sha3("registerCustomer(address, bytes, uint)")),customer,
                                                        "DummyCustomer1", 100);
    var _insertOk = _store.call(
                              bytes4(sha3("insertProductIntoCart(uint)")), 55);
    // let's try to check out
    bool _chkOutOk = _store.call(bytes4(sha3("checkoutCart()")));
    bool allOk = _regOk && _insertOk && _chkOutOk;
    Assert.isTrue(allOk, "Customer should be able to check out shopping cart");

  }

  function testEmptyCart() {
    // switch to a dummy-owner because a seller can't be its own customer
    address customer = address(this);
    Store _store = new Store();
    _store.changeOwner(dummy);
    var _regOk = _store.delegatecall(
              bytes4(sha3("registerCustomer(address, bytes, uint)")),customer,
                                                        "DummyCustomer1", 100);
    var _insertOk = _store.call(
                              bytes4(sha3("insertProductIntoCart(uint)")), 55);
    // let's try to check out
    bool _chkOutOk = _store.call(bytes4(sha3("emptyCart()")));
    bool allOk = _regOk && _insertOk && _chkOutOk;
    Assert.isTrue(allOk, "Customer should be able to empty its shopping cart");
  }

}
