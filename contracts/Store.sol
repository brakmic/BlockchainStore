pragma solidity ^0.4.8;

// This contract implements a simple store that can interact with
// registered customers. Every customer has its own shopping cart.
// @title Contract Store
// @author Harris Brakmic
contract Store {

    /* Store internals */
    address owner;      // store owner's address
    bytes32 public name; // store name
    uint balance;       // store's balance

    mapping (address => Customer) customers;
    mapping (uint => Product) products;

    /* Store Events */
    event CustomerRegistered(address customer);
    event CustomerRegistrationFailed(address customer);
    event CustomerDeregistered(address customer);
    event CustomerDeregistrationFailed(address customer);

    event ProductRegistered(uint productId);
    event ProductDeregistered(uint productId);
    event ProductRegistrationFailed(uint productId);
    event ProductDeregistrationFaled(uint productId);

    event CartProductInserted(address customer, uint prodId);
    event CartProductInsertionFailed(address customer, uint prodId);
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
        bytes name;
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
        bytes32 name;
        bytes32 description;
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
        bytes product_id;
        uint amount;
        uint product_price;
        uint total_price;
    }
    /**
          @dev Default constructor
    */
    function Store() {
        owner = msg.sender;
        name = "retailtest";
    }

    /**
          @dev Changes the address of the store owner

          @param  new_owner Address of the new Store Owner
          @return success

    */
    function changeOwner(address new_owner) onlyStoreOwner
                                                        returns (bool success) {
      if (new_owner != owner) {
        owner = new_owner;
        return true;
      }
      return false;
    }

    /**
          @dev Register a single product

          @param id Product ID
          @param name Product Name
          @param description Product Description
          @param price Product Price
          @param default_amount Default amount of items in a single product

          @return success
    */
    function registerProduct(uint id, bytes32 name, bytes32 description,
                             uint price, uint default_amount)
                                         onlyStoreOwner returns (bool success) {
        var product = Product(id, name, description, price, default_amount);
        if (checkProductValidity(product)) {
            products[id] = product;
            ProductRegistered(id);
            return true;
        }
        ProductRegistrationFailed(id);
        return false;
    }

    /**
          @dev Removes a product from the list

          @param productId Product ID
          @return success
    */
    function deregisterProduct(uint productId) onlyStoreOwner
                                                        returns (bool success) {
      Product product = products[productId];
      if (product.id == productId) {
        delete products[productId];
        ProductDeregistered(productId);
        return true;
      }
      ProductDeregistrationFaled(productId);
      return false;
    }

    /**
          @dev Returns a elements describing a product
          @param id Product ID
          @return (prod_name, prod_desc, prod_price, prod_default_amount)
    */
    function getProduct(uint id) constant returns (bytes32 prod_name,
                                                   bytes32 prod_desc,
                                                   uint prod_price,
                                                   uint prod_default_amount) {
       return (products[id].name,
               products[id].description,
               products[id].price,
               products[id].default_amount);
    }

    /**
          @dev Registers a new customer (only store owners)

          @param _address Customer's address
          @param _name Customer's name
          @param _balance Customer's balance
          @return success
    */
    function registerCustomer(address _address, bytes _name, uint _balance)
                                        onlyStoreOwner returns (bool success) {
      if (_address != owner) {
        customers[_address] = Customer(_address, _name, _balance,
                                                        Cart(new uint[](0), 0));
        CustomerRegistered(_address);
        return true;
      }
      CustomerRegistrationFailed(_address);
      return false;
    }

    /**
        @dev Removes a customer (only store owners)

        @param _address Customer'S address
        @return success
    */
    function deregisterCustomer(address _address) onlyStoreOwner
                                                        returns (bool success) {
      Customer customer = customers[_address];
      if (customer.adr != address(0)) {
        delete customers[_address];
        CustomerDeregistered(_address);
        return true;
      }
      CustomerDeregistrationFailed(_address);
      return false;
    }

    /**
        @dev Inserts a product into the shopping cart.
            This function returns a boolean and the position of the
            inserted product.
            The positional information can later be used to directly reference
            the product within the mapping. Solidity mappings aren't interable.

        @param prodId Product ID
        @return (success, position)
    */
    function insertProductIntoCart(uint prodId) returns (bool success,
                                                         uint position) {
      /*if (msg.sender != owner) {*/
        customers[msg.sender].cart.products.push(prodId);
        customers[msg.sender].cart.completeSum += products[prodId].price;
        CartProductInserted(msg.sender, prodId);
        return (true, customers[msg.sender].cart.products.length - 1);
      /*}*/
      /*CartProductInsertionFailed(msg.sender, prodId);*/
      /*return (false, 0);*/
    }

    /**
        @dev Removes a product entry from the shopping cart

        @param prodPosition Product's position in the internal mapping
    */
    function removeProductFromCart(uint prodPosition) {
      if (msg.sender != owner) {
        uint[] memory new_product_list = new uint[](customers[msg.sender]
                                                    .cart.products.length - 1);
        var customerProds = customers[msg.sender].cart.products;
        for (uint i = 0; i < customerProds.length; i++) {
          if (i != prodPosition) {
            new_product_list[i] = customerProds[i];
          } else {
            customers[msg.sender].cart.completeSum -=
                                               products[customerProds[i]].price;
            CartProductRemoved(msg.sender, customerProds[i]);
          }
        }
        customers[msg.sender].cart.products = new_product_list;
      }
    }

    /**
        @dev Returns a list of product ids and a complete sum.
        The caller address must be a registered customer.

        @return (productIds, completeSum)
    */
    function getCart() constant returns (uint[] productIds, uint completeSum) {
      Customer customer = customers[msg.sender];
      uint len = customer.cart.products.length;
      uint[] memory ids = new uint[](len);
      for (uint i = 0; i < len; i++) {
        ids[i] = products[i].id;
      }
      return (ids, customer.cart.completeSum);
    }

    /**
          @dev Returns customer's balance
    */
    function getBalance() constant returns (uint _balance) {
      return customers[msg.sender].balance;
    }

    /**
        @dev Invokes a checkout process that'll use the current shopping cart to
        transfer balances between the current customer and the store

        @return success
    */
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

    /**
          @dev Changes the name of the store

          @param new_store_name New store name
          @return success
    */
    function renameStoreTo(bytes32 new_store_name) onlyStoreOwner
                                                        returns (bool success) {
        if (new_store_name.length != 0 &&
            new_store_name.length <= 32) {
            name = new_store_name;
            return true;
        }
        return false;
    }

    /**
          @dev Checks product validity

          @param product Product struct
          @return valid
    */
    function checkProductValidity(Product product) private
                                                          returns (bool valid) {
       return (product.price > 0);
    }

    /**
          @dev Payable fallback
    */
    function() payable { }
}
