## BlockchainStore

A [Smart Contract](https://github.com/brakmic/BlockchainStore/blob/master/contracts/Store.sol) that runs on [Ethereum](https://www.ethereum.org/)

### Retail Test

This smart contract is written in [Solidity](https://solidity.readthedocs.io/en/develop/) and mimics a retail store. It supports customer and product registrations. A customer owns a simple cart to collect products before checking out.

### DApp

In this early version there's no proper web interface available and you'll have to use `truffle console` to interact with the contract. In future I'll provide a proper app (maybe written in Angular 4.x as I don't like the default web-app environment provided by truffle).

### Usage

First, activate a local test-blockchain with `testrpc`. If you don't have it just type `npm install -g ethereumjs-testrpc` and let NPM install it for you.

Second, go into the root of this project and execute `truffle compile` and `truffle migrate` (when changing the code during live-testing use `truffle migrate --reset` instead).

Third, jump into truffle's console with `truffle console`. Now you can use the local Blockchain to play with the Store :smile:

### Testing Store's Functionality

I've created this project to learn a bit about Solidity & Ethereum. Expect no sophisticated code here. *And lots of bugs.*

**Here's how I interact with it:**

First, we'll need two addresses: a **customer** and a **seller**. By default *testrpc* registers ten Ethereum accounts at our disposal.

*For more information about the namespace web3.eth consult [truffle docs](http://truffleframework.com/docs/) and also Ethereum [JavaScript API](https://github.com/ethereum/wiki/wiki/JavaScript-API).*

> `var seller = web3.eth.accounts[0];`

> `var customer = web3.eth.accounts[1];`

We also need a reference to our Store.

> `var store;`

We get this reference asynchronously by executing this snippet.

> `Store.deployed().then(d => store = d);`

Now we register a new Customer with a certain amount of money. The original signature of [registerCustomer](https://github.com/brakmic/BlockchainStore/blob/master/contracts/Store.sol#L98) in Solidity differs a bit from the one used below. This is because we want to execute this API from our `seller` account. All available API calls can be expanded by using similar options that let Ethereum know which account should pay for the execution of the code. As you already know the **smart contracts** don't get executed for free. You have to pay the miners. You can also set the amount of `gas` that can be used. More information regarding these options can be found [here](http://truffleframework.com/docs/getting_started/contracts).

> `store.registerCustomer(customer, "Harris", 100, {from: seller});`

Our customers will hopefully buy some of our products. Now let's register one by using `registerProduct`. Note that I'm not using `{from: seller}` here. By default **truffle** executes transactions under the first available account address. Only when we explicitely want to have a transaction being executed under a different address, like in the **shopping cart checkout** below, we'll have to provide it.

> `store.registerProduct(0, "t-shirt", "lacoste", 40, 1);`

Now, as a customer we take a T-Shirt with id == 0 and put it into our cart.

> `store.insertProductIntoCart(0, {from: customer});`

Let's see what's in the cart. Note that we don't execute a **transaction** here. A transaction would try to change the state on the blockchain that makes no sense in this case. Instead we execute a *.call()* that returns the product ids and total sum.

> `store.getCart.call({from: customer});`

We also want to take care of proper event handling...

> `var allStoreEvents = store.allEvents().watch({}, '');`

...by registering an event handler that'll siphon them all.

> `allStoreEvents.watch(function(err, res) { console.log("Error: " + err); console.log("Event: " + res.event); });`

Let's try to **check out**. :smile:

> `store.checkoutCart({from: customer});`

Finally, let's see our balance after the checkout.

> `store.getBalance.call({from: customer});`

### Thanks

Many thanks to the nice Ethereum community from [reddit](https://www.reddit.com/r/ethereum/comments/6ik0yb/learning_solidity_a_simple_storesmartcontract/).

Special thanks to [cintix](https://www.reddit.com/user/cintix) for the advice regarding [unbounded iterations](https://www.reddit.com/r/ethereum/comments/6ik0yb/learning_solidity_a_simple_storesmartcontract/dj70kww/).

### License

[MIT](https://github.com/brakmic/BlockchainStore/blob/master/LICENSE)
