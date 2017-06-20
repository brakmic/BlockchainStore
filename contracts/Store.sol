pragma solidity ^0.4.8;

contract Store {

    address owner; // store owner's address
    string public name; // store name
    uint balance; // store's balance
    mapping (address => Customer) public customers;
    mapping (uint => Product) public products;
    event CustomerRegistered(address customer);
    event CartProductInserted(address customer, string prod_id);
    event CartProductRemoved(address customer, string prod_id);
    event CartCheckoutCompleted(address customer, uint paymentSum);
    event CartCheckoutFailed(address customer, uint paymentSum);

    modifier onlyStoreOwner {
        require(msg.sender == owner);
        _;
    }

    struct Customer {
        address adr;
        string name;
        uint balance;
        uint[] cart;
    }

    struct Product {
        uint id;
        string name;
        string description;
        uint price;
        uint default_amount;
    }

    struct Receipt {
        InvoiceLine[] lines;
        address customer_address;
    }

    struct InvoiceLine {
        string product_id;
        uint amount;
        uint product_price;
        uint total_price;
    }

    function Store() {
        owner = msg.sender;
        name = "retailtest";
    }

    function registerProduct(uint id, string name, string description,
                           uint price, uint default_amount) onlyStoreOwner returns (bool success) {
        var product = Product(id, name, description, price, default_amount);
        if (checkProductValidity(product)) {
            products[id] = product;
            return true;
        }
        return false;
    }

    function registerCustomer(string _name, uint _balance) returns (bool success) {
      customers[msg.sender] = Customer(msg.sender, _name, _balance, new uint[](0));
      return true;
    }

    function getProduct(uint id) returns (string, string, uint, uint) {
       return (products[id].name,
               products[id].description,
               products[id].price,
               products[id].default_amount);
    }

    function insertProductIntoCart(uint prodKey) returns (bool success) {
      customers[msg.sender].cart.push(products[prodKey].id);
      return true;
    }

    function getCart() returns (uint[] productIds) {
      Customer customer = customers[msg.sender];
      uint len = customer.cart.length;
      uint[] memory ids = new uint[](len);
      for(uint i = 0; i < len; i++) {
        ids[i] = products[i].id;
      }
      return ids;
    }

    function getPaymentSum() returns (uint sum) {
      Customer customer = customers[msg.sender];
      uint completeSum = 0;
      uint len = customer.cart.length;
      for(uint i = 0; i < len; i++) {
        uint prodId = customer.cart[i];
        completeSum += products[prodId].price;
      }
      return completeSum;
    }

    function checkoutCart() external returns (bool success) {
        Customer customer = customers[msg.sender];
        uint paymentSum = getPaymentSum();
        if (customer.balance < paymentSum) {
          CartCheckoutFailed(msg.sender, paymentSum);
          return false;
        } else {
          customer.balance -= paymentSum;
          customer.cart = new uint[](0);
          CartCheckoutCompleted(msg.sender, paymentSum);
          return true;
        }
    }

    function renameStoreTo(string new_store_name) onlyStoreOwner returns (bool success) {
        bytes memory a = bytes(new_store_name);
        if (a.length != 0) {
            name = new_store_name;
            return true;
        }
        return false;
    }

    function checkProductValidity(Product product) private returns (bool valid) {
       return (product.price > 0);
    }

    function() payable { }
}
