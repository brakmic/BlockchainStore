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

  function xtestInsertProductIntoCart() {
    bool allOk = true;
    address customer = address(this);

    /*Store _store = new Store();*/
    // switch to a dummy-owner because a seller can't be its own customer
    store.changeOwner(dummy);
    // we can now register ourselves as "customers"
    store.registerCustomer(customer, "DummyCustomer1", 100);
    // switching back to seller's address as store owner
    var (result, prod_mapping_position) = store.insertProductIntoCart(55);
    store.changeOwner(defaultOwner);
    allOk = result && (prod_mapping_position == 0);
    Assert.isTrue(allOk,
              "Customer should be able to insert a product into shopping cart");
  }

  function xtestCheckoutCart() {
    // switch to a dummy-owner because a seller can't be its own customer
    store.changeOwner(dummy);
    bool expect = true;
    // let's try to check out
    bool result = store.checkoutCart();
    // switching back to seller's address as store owner
    store.changeOwner(defaultOwner);
    Assert.equal(result, expect,
                          "Customer should be able to check out shopping cart");

  }

  function xtestRemoveProductFromCart() {
    // switch to a dummy-owner because a seller can't be its own customer
    store.changeOwner(dummy);
    var (result, prod_mapping_position) = store.insertProductIntoCart(0);
    store.removeProductFromCart(prod_mapping_position);
    var (productIds, completeSum) = store.getCart();
    // switching back to seller's address as store owner
    store.changeOwner(defaultOwner);
    Assert.equal(completeSum, 0,
               "Customer should be able to remove products from shopping cart");
  }

}
