import { Component, OnInit } from '@angular/core';
import { imageApi } from 'app/apis';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import store_artifacts from 'build/contracts/Store.json'

import { LogService } from 'app/services';

@Component({
    selector: 'bcs-app',
    templateUrl: './bcs.component.html',
    styleUrls: [
        './bcs.component.scss'
    ]
})
export class BcsComponent implements OnInit {

    public cashRegisterImage: string;
    public ethereumLogo: string;

    // The following code is simple to show off interacting with your contracts.
    // As your needs grow you will likely need to change its form and structure.
    // For application bootstrapping, check out window.addEventListener below.
    public accounts: any[] = [];
    public account: any;
    public account_balance: number;
    private _web3: any;
    // public _web3: any;
    // Store is our usable abstraction, which we'll use through the code below.
    public Store: any;
    // tslint:disable-next-line:no-empty
    constructor(private logger: LogService) { }

    // tslint:disable-next-line:no-trailing-whitespace
    // tslint:disable-next-line:no-empty
    public ngOnInit() {
       console.log('BCS component loaded');
       this.ethereumLogo = imageApi.getImageData('ethereum');
       this.cashRegisterImage = imageApi.getImageData('cash_register');
       this.initWeb3();
       this.initContracts();
    }

    public initWeb3() {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof (window as any).web3 !== 'undefined') {
        this.logger.logEx("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask", "BCS");
        // Use Mist/MetaMask's provider
        (window as any).web3 = new Web3(web3.currentProvider);
      } else {
        this.logger.logEx("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask", "BCS");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        (window as any).web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      }
    }

    public initContracts() {
      this.Store = contract(store_artifacts);
      // Bootstrap the MetaCoin abstraction for Use.
      this.Store.setProvider((window as any).web3.currentProvider);
      this._web3 = (window as any).web3;
      // Get the initial account balance so it can be displayed.
      this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
          }

          if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
          }

          this.accounts = accs;
          this.account = this.accounts[0];
          this.account_balance = this._web3.fromWei(this._web3.eth.getBalance(this.account), 'ether').toNumber();
      });
    }

}
