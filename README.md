## Retail Store on Blockchain

### About

This is a [Smart Contract](https://github.com/brakmic/BlockchainStore/blob/master/contracts/Store.sol) that runs on [Ethereum](https://www.ethereum.org/)

It is written in [Solidity](https://solidity.readthedocs.io/en/develop/) and represents a retail store. It supports customer and product registrations. Every registered customer owns a shopping cart to collect products before checking out.

### Dapp

In this early version there's no proper web interface available and you'll have to use `truffle console` to access the contract. In future I'll provide a web-app written in Angular 4.x. The ultimate goal is to not only produce a web-site but a complete **web-platform** behind it. *Embedding* a real-world business model into something like a DApp implies certain functionalities:

* **database** [*you certainly don't want to store your customers personal data on the blockchain*]

* **error handling** [*there's no error-handling in Ethereum but your business isn't Ethereum*]

* **transactions** [*Ethereum transactions aren't your business transactions*]

* **unavoidable updates** [*no code is eternal*]

* **automatic backups** [*I'm repeating myself...see databases above*]

* **backend APIs** [*for example: detailed product infos, currency conversions, geo-locations etc.*]

...and many other things.

Giving customers an interface where they can add or remove products to/from their shopping carts is important but not the ultimate goal. The shopping experience on the UI **and** a sophisticated business logic in the backend must both exist to support each other. As long as we can't put a *non-public & fast* database on Ethereum we'll have to maintain it somewhere else. And to achieve this goal our Dapp will rely on backend APIs.

Currently, a simple demo to play around with [web3](https://github.com/ethereum/wiki/wiki/JavaScript-API)-API is available. To get the above demo working please follow these steps:

* Compile the contracts with `truffle compile`
* Then move the newly created *build* folder to *src*
* Now you can boot the app via `npm run start:hmr`

### Tokens

Store [Tokens](https://github.com/brakmic/BlockchainStore/blob/master/contracts/Tokens/BaseStoreToken.sol#L9) will soon be supported. One could use them to purchase goods in the store or for *initial coin offerings*. For example: you're planning to open a store that deals with certain popular goods but you're unsure how many potential customers are out there. Now you could simply buy some ethers or other coins to finance your store (to pay goods in advance, hire a dev to code a proper Dapp for your customers etc.). Now everything depends on how successful your business will be. You may or may not be able to sustain it.

As we all know there are always certain risks to take care of and that's why people try to convince other people to support their business ideas. So, you decide to sell shares of your nascent business to interested parties. You create a proper business info material, for example a web-site that describes your business, how it should look like, what are potential risks etc. You generate a certain amount of tokens based on a price that could be fixed or not. Let's say you sell *1 MyStoreToken* for *0.001 ETH*. Additionally you can determine certain limits and how long your ICO will last. Of course there's no obligation to create all of your tokens in advance. You could easily define a dynamic token supply that depends on incoming ETHs.

Until the first working version gets out you can test the current development in `truffle console`:

Declare a reference variable for deployed token contract.

> `var token;`

Get its reference via JS Promise.

> `BaseStoreToken.deployed().then(d => token = d);`

Display initial token supply.

> `token.initialSupply();`

Transfer 10 tokens from default address to web3.eth.accounts[1]

> `token.transfer(web3.eth.accounts[1], 10);`

### API

| Name  | Group  | Signature  | Usage  | Returns |
|:-|:-|:-|:-|:---|
| **transferOwnership**  | owner  | address   | store.transferOwnership(new_owner_address)  |   |
| **registerProduct**   | owner  | uint256, bytes32, bytes32, uint, uint   | store.registerProduct(id, name, description, price, default_amount)   | **bool** |
| **deregisterProduct**   | owner   | uint256   | store.deregisterProduct(id)   | **bool**  |
| **getProduct**  | customer  | uint256  | store.getProduct(id)  | (**bytes32** *name*, **bytes32** *description*, **uint256** *price*, **uint256** *default_amount*)  |
| **registerCustomer**  | owner   | address, bytes32, uint256  | store.registerCustomer(cust_address, cust_name, cust_balance)  |  **bool**  |
| **deregisterCustomer**  | owner   | address   | store.deregisterCustomer(cust_address)  | **bool**   |
| **insertProductIntoCart**  | customer  | uint256  | store.insertProductIntoCart(prod_id)  | (**bool** *success*, **uint256** *position_in_prod_mapping*)  |
| **removeProductFromCart**  | customer  | uint  | store.removeProductFromCart(prod_position_in_mapping)  | *fires an event on successful removal* |
| **getCart**  | customer  |   | store.getCart()  | (**uint256[] memory** *product_ids*, **uint256** *completeSum*)  |
| **checkoutCart**  | customer  |   | store.checkoutCart()  | **bool**  |
| **emptyCart** | customer | | store.emptyCart() | **bool** |
| **getBalance**  | customer  |   | store.getBalance()  | **uint256** |
| **renameStoreTo**  | owner  | bytes32  | store.renameStoreTo(new_store_name)  | **bool**  |

### Usage

First, activate a local test-blockchain with `testrpc`. If you don't have it just type `npm install -g ethereumjs-testrpc` and let NPM install it for you.

Second, go into the root of this project and execute `truffle compile` and `truffle migrate` (when changing the code during live-testing use `truffle migrate --reset` instead).

Third, jump into truffle's console with `truffle console`. Now you can use the local Blockchain to play with the Store :smile:

### Interactive Testing

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

Now we register a new Customer with a certain amount of money. The original signature of [registerCustomer](https://github.com/brakmic/BlockchainStore/blob/master/contracts/Store.sol#L158) in Solidity differs a bit from the one used below. This is because we want to execute this API from our `seller` account. All available API calls can be expanded by using similar options that let Ethereum know which account should pay for the execution of the code. As you already know the **smart contracts** don't get executed for free. You have to pay the miners. You can also set the amount of `gas` that can be used. More information regarding these options can be found [here](http://truffleframework.com/docs/getting_started/contracts).

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

### Automatic Testing

The [tests](https://github.com/brakmic/BlockchainStore/blob/master/test/TestStore.sol#L7) are written in Solidity. Simply enter `truffle test` in your console.


### Thanks

Many thanks to the nice Ethereum community from [reddit](https://www.reddit.com/r/ethereum/comments/6ik0yb/learning_solidity_a_simple_storesmartcontract/).

Special thanks to [cintix](https://www.reddit.com/user/cintix) for the advice regarding [unbounded iterations](https://www.reddit.com/r/ethereum/comments/6ik0yb/learning_solidity_a_simple_storesmartcontract/dj70kww/).

### List of used images

[Cash Register](https://pixabay.com/en/cash-register-register-retail-sale-576181/) - CC0 Public Domain

[Ethereum Logo](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/a2bcf4f8-9a5d-4f85-873b-cf94ce537eb0.png) - free for non-commercial use via Google Filter Settings

### License

[MIT](https://github.com/brakmic/BlockchainStore/blob/master/LICENSE)
