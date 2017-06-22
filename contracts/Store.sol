pragma solidity ^0.4.8;

// This contract implements a simple store to interact with
// registered customers. Every customer has its own shopping cart.
contract Store {

    /* Store internals */
    address owner;      // store owner's address
    string public name; // store name
    uint balance;       // store's balance

    mapping (address => Customer) customers;
    mapping (uint => Product) products;

    /* Store Events */
    event CustomerRegistered(address customer);
    event CustomerDeregistered(address customer);

    event ProductRegistered(uint productId);
    event ProductDeregistered(uint productId);
    event ProductRegistrationFailed(uint productId);
    event ProductDeregistrationFaled(uint productId);

    event CartProductInserted(address customer, uint prodId);
    event CartProductRemoved(address customer, uint prodId);
    event CartCheckoutCompleted(address customer, uint paymentSum);
    event CartCheckoutFailed(address customer, uint paymentSum);

    modifier onlyStoreOwner {
        require(msg.sender == owner);
        _;
    }

    // every customer has an address, name,
    // balance and a shopping cart
    struct Customer {
        address adr;
        string name;
        uint balance;
        Cart cart;
    }
    // A shopping cart contains an array of product ids: @products
    // and a sum of product prices: @completeSum
    // The @completeSum gets automatically updated when customer
    // adds or removes products.
    struct Cart {
      uint[] products;
      uint completeSum;
    }
    // Represents a product:
    // Product id: @id
    // Product name: @name
    // Decription: @description
    // Amount of items in a single product: @default_amount
    struct Product {
        uint id;
        string name;
        string description;
        uint price;
        uint default_amount;
    }
    // Represents a receipt [NOT IN USE]
    struct Receipt {
        InvoiceLine[] lines;
        address customer_address;
    }
    // Represents a single entry describing a single product [NOT IN USE]
    struct InvoiceLine {
        string product_id;
        uint amount;
        uint product_price;
        uint total_price;
    }
    // Default constructor
    function Store() {
        owner = msg.sender;
        name = "retailtest";
    }
    // Register a single product (only store owners)
    function registerProduct(uint id, string name, string description,
                           uint price, uint default_amount) onlyStoreOwner returns (bool success) {
        var product = Product(id, name, description, price, default_amount);
        if (checkProductValidity(product)) {
            products[id] = product;
            ProductRegistered(id);
            return true;
        }
        ProductRegistrationFailed(id);
        return false;
    }
    // Removes a product from the list (only store owners)
    function deregisterProduct(uint productId) onlyStoreOwner returns (bool success) {
      delete products[productId];
      ProductDeregistered(productId);
      return true;
    }
    // Registers a new customer (only store owners)
    function registerCustomer(address _address, string _name, uint _balance) onlyStoreOwner returns (bool success) {
      customers[_address] = Customer(_address, _name, _balance, Cart(new uint[](0), 0));
      CustomerRegistered(_address);
      return true;
    }
    // Removes a customer (only store owners)
    function deregisterCustomer(address customerAddress) onlyStoreOwner returns (bool success) {
      delete customers[customerAddress];
      CustomerDeregistered(customerAddress);
      return true;
    }
    // Returns a elements describing a product
    function getProduct(uint id) returns (string prod_name, string prod_desc,
                                          uint prod_price, uint prod_default_amount) {
       return (products[id].name,
               products[id].description,
               products[id].price,
               products[id].default_amount);
    }
    // Inserts a product into the shopping cart (caller address must be a registered customer)
    function insertProductIntoCart(uint prodId) returns (bool success, uint position) {
      customers[msg.sender].cart.products.push(prodId);
      customers[msg.sender].cart.completeSum += products[prodId].price;
      CartProductInserted(msg.sender, prodId);
      return (true, customers[msg.sender].cart.products.length -1);
    }
    // Removes a product entry from the shopping cart (caller address must be a registered customer)
    function removeProductFromCart(uint prodPosition) returns (bool success) {
      uint[] memory new_product_list = new uint[](customers[msg.sender].cart.products.length - 1);
      var customerProds = customers[msg.sender].cart.products;
      for (uint i = 0; i < customerProds.length; i++) {
        if (i != prodPosition) {
          new_product_list[i] = customerProds[i];
        } else {
          customers[msg.sender].cart.completeSum -= products[customerProds[i]].price;
          CartProductRemoved(msg.sender, customerProds[i]);
        }
      }
      customers[msg.sender].cart.products = new_product_list;
      return true;
    }
    // Returns a list of product ids and a complete sum belonging to the current customer
    // The caller address must be a registered customer
    function getCart() returns (uint[] productIds, uint completeSum) {
      Customer customer = customers[msg.sender];
      uint len = customer.cart.products.length;
      uint[] memory ids = new uint[](len);
      for (uint i = 0; i < len; i++) {
        ids[i] = products[i].id;
      }
      return (ids, customer.cart.completeSum);
    }
    // Returns customer's balance
    function getBalance() returns (uint _balance) {
      return customers[msg.sender].balance;
    }
    // Invokes a checkout process that'll use the current shopping cart to
    // transfer balances between the current customer and the store
    function checkoutCart() returns (bool success) {
      if (msg.sender != owner) {
        Customer customer = customers[msg.sender];
        uint paymentSum = customer.cart.completeSum;
        if ((customer.balance >= paymentSum) &&
            customer.cart.products.length > 0) {
            customer.balance -= paymentSum;
            customer.cart = Cart(new uint[](0), 0);
            balance += paymentSum;
            CartCheckoutCompleted(msg.sender, paymentSum);
            return true;
        }
      }
      CartCheckoutFailed(msg.sender, paymentSum);
      return false;
    }
    // Changes the name of the store (only store owners)
    function renameStoreTo(string new_store_name) onlyStoreOwner returns (bool success) {
        bytes memory a = bytes(new_store_name);
        if (a.length != 0) {
            name = new_store_name;
            return true;
        }
        return false;
    }
    // Checks product validity (private function)
    function checkProductValidity(Product product) private returns (bool valid) {
       return (product.price > 0);
    }
    // Payable fallback
    function() payable { }
}
