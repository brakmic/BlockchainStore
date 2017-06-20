## BlockchainStore

A Smart Contract that runs on Ethereum 

### Retail Test

This smart contract is written in Solidity and mimics a retail store. It supports customer and product registrations. A customer owns a simple cart to collect its desired products before checking out. According to respective customer balances different events will be generated.

### DApp

In this early version there's no proper web interface available and you'll have to use `truffle console` to interact with the contract. In future I'll provide a proper app (maybe written in Angular 4.x as I don't like the default weba-app environment provided by truffle).

### Usage

First, activate a local test-blockchain with `testrpc`. If you don't have it just type `npm install -g ethereumjs-testrpc` and let NPM install it for you.

Second, go to where solidity sources are and execute `truffle compile` and `truffle migrate` (when changing the code during live-testing use `truffle migrate --reset`).

Third, jump into truffle's console with `truffle console`. Now you can use the local Blockchain and play with the Store :smile:

### Testing Store's Functionality

All this is just a test and I'm simply using it to learn Solidity / Ethereum / Blockchain etc. 

**Here's how I interact with it:**

This variable will hold the reference to our Store.

> `var store;` 

 We receive the needed Store reference asynchronously from Etherium.

> `Store.deployed().then(d => store = d);`

Now we register a new Customer with a certain amount of money (note the small-caps `store`).

> `store.registerCustomer("Harris", 100);` 

We also want to have something to sell to our customers: function signature is **(ID, NAME, DESC, PRICE, AMOUNT)**

> `store.registerProduct(0, "t-shirt", "lacoste", 40, 1);` 

We take a T-Shirt with id == 0 and put it into our cart *[the contract will automatically find the cart for current **msg.sender**]*

> `store.insertProductIntoCart(0);` 

Let's see what's in the cart? Note that here we don't use a **transaction** which'd try to change the state on the blockchain but instead just a *.call()* that simply returns the current values. 

> `store.getCart.call();` 

We take care of proper event handling. In this case we want to be informed about any failed cart checkouts.

> `var checkoutFailed = store.CartCheckoutFailed();` 

Therefore we register a proper event handler.

> `checkoutFailed.watch(function(err, res) { console.log(err); });` 

Let's try to check out. :smile:

> `store.checkoutCart();` 

### License

[MIT](https://github.com/brakmic/BlockchainStore/blob/master/LICENSE)
