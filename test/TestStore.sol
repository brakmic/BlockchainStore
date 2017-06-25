pragma solidity ^0.4.10;

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
    uint256 expected = 0;
    Assert.equal(_store.getBalance(), expected,
                                      "Store should have 0 in initial balance");
  }

  function testRenameStore() {
     bool expected = true;

     bool result = store.renameStoreTo("myTestStore");

     Assert.equal(result, expected, "Store name should be changeable");
  }

  function testTransferOwnership() {
    Store _store = new Store();
    address previous_owner = _store.owner();
    _store.transferOwnership(dummy);
    bool owner_changed = (_store.owner() != previous_owner);
    Assert.isTrue(owner_changed, "Store owner should be changeable");
  }

  function testStoreBalanceAfterCheckout() {
    address owner = address(this);
    Store _store = new Store();
    _store.registerProduct(0, "t-shirt", "lacoste", 40, 1);
    var _regOk = _store.registerCustomer(owner, "DummyCustomer1", 100);

    var (_insertOk, _prod_pos) = _store.insertProductIntoCart(0);
    // let's try to check out
    bool _chkOutOk = _store.checkoutCart();
    uint256 balance = _store.getStoreBalance();
    bool allOk = _regOk && _insertOk && (_prod_pos == 0) &&
                                             _chkOutOk && (balance > 0);
    Assert.isTrue(allOk, "Store balance should increase after checkout");
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
    uint256 prod_price  = 50;
    uint256 prod_default_amount = 1;
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
    var _regOk = _store.registerCustomer(customer, "DummyCustomer1", 100);
    var (_insertOk, pos) = _store.insertProductIntoCart(55);
    Assert.isTrue(_insertOk && _regOk && (pos == 0),
              "Customer should be able to insert a product into shopping cart");
  }

  function testInsertMultipleProductsIntoCart() {
    address customer = address(this);
    Store _store = new Store();
    var _regOk = _store.registerCustomer(customer, "DummyCustomer1", 100);
    var (_insertOk, pos) = _store.insertProductIntoCart(55);
    var (_insertOk2, pos2) = _store.insertProductIntoCart(55);
    var (_insertOk3, pos3) = _store.insertProductIntoCart(55);
    var _allInserted = _insertOk && _insertOk2 && _insertOk3;
    Assert.isTrue(_allInserted && _regOk &&
                  (pos == 0 && pos2 == 1 && pos3 == 2),
      "Customer should be able to insert multiple products into shopping cart");
  }

  function testRemoveProductFromCart() {
    address customer = address(this);
    Store _store = new Store();
    var _regOk = _store.registerCustomer(customer, "DummyCustomer1", 100);
    var (_insertOk, _prod_pos) = _store.insertProductIntoCart(0);
    _store.removeProductFromCart(0);
    var (productIds, completeSum) = _store.getCart();
    bool allOk = _regOk && _insertOk && (_prod_pos == 0) && (completeSum == 0);
    Assert.isTrue(allOk,
               "Customer should be able to remove products from shopping cart");
  }

  function testCheckoutCart() {
    address customer = address(this);
    Store _store = new Store();
    var _regOk = _store.registerCustomer(customer, "DummyCustomer1", 100);
    var (_insertOk, _prod_pos) = _store.insertProductIntoCart(55);
    // let's try to check out
    bool _chkOutOk = _store.checkoutCart();
    bool allOk = _regOk && _insertOk && (_prod_pos == 0) && _chkOutOk;
    Assert.isTrue(allOk, "Customer should be able to check out shopping cart");

  }

  function testEmptyCart() {
    address customer = address(this);
    Store _store = new Store();
    var _regOk = _store.registerCustomer(customer, "DummyCustomer1", 100);
    var (_insertOk, _prod_pos) = _store.insertProductIntoCart(55);
    bool _chkOutOk = _store.emptyCart();
    bool allOk = _regOk && (_insertOk && _prod_pos == 0) && _chkOutOk;
    Assert.isTrue(allOk, "Customer should be able to empty its shopping cart");
  }

}
