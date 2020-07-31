import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Observable, BehaviorSubject } from 'rxjs';
import { IAccount } from '../models/account';

declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private REQUEST_CHAIN_ARTIFACTS = require('../../../build/contracts/RequestChain.json');
  public web3: Web3;
  public contract: any;
  private isWeb3Ready: BehaviorSubject<boolean>;
  public isWeb3Ready$: Observable<boolean>;
  private account: BehaviorSubject<IAccount>;
  public account$: Observable<IAccount>;
  private network: BehaviorSubject<string>;
  public network$: Observable<string>;
  public owner: string = '';

  private contractABI = this.REQUEST_CHAIN_ARTIFACTS;

  constructor() { 
    this.isWeb3Ready = new BehaviorSubject(false);
    this.isWeb3Ready$ = this.isWeb3Ready.asObservable();
    this.account = new BehaviorSubject(null);
    this.account$ = this.account.asObservable();
    // this.deliveryStream = new BehaviorSubject(null);
    // this.deliveryStream$ = this.deliveryStream.asObservable();
    this.network = new BehaviorSubject(null);
    this.network$ = this.network.asObservable();
    this.initContract();
  }

  private initContract() {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    this.initWeb3();
  }

  private initWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.ethereum.enable().then(async () => {
        let contractAddress = "0x03086332283cad3b7bec798a21cc72e8ce7d2b44"; //ropsten
        alert('Connecting to MetaMask');
        this.web3 = new Web3(window.ethereum);
        this.contract = new this.web3.eth.Contract(
          this.contractABI.abi,
          contractAddress
        );
        await this.updateAccounts();
        await this.listenToAccountsChanged();
        await this.getCurrentNetwork();
        this.initEventSubscriptions();
        this.isWeb3Ready.next(true);
      });
    } else {
      alert('No web3? You should consider trying MetaMask!');

      let contractAddress = "0x08a4e223D792D0cfb8cbC3B96a5878e6CfFC8BB0"; // ganache
      
      this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545')); // this allows for the allEvents to work.
      
      this.contract = new this.web3.eth.Contract(
        this.contractABI.abi,
        contractAddress
      );
      this.initEventSubscriptions();
      this.isWeb3Ready.next(true);
    }
  }

  private initEventSubscriptions(): void {
    this.contract.events.allEvents({ fromBlock: 'latest' }, async (error, event) => {
      console.log('event=', event);
      console.log('error=', error);
      if (!error) {
        alert(JSON.stringify(event));
      } else {
        alert(JSON.stringify(error))
      }
      // if (event.returnValues._deliveryHash) {
      //   const deliveryHash = event.returnValues._deliveryHash;
      //   const delivery = await this.getDelivery(deliveryHash);
      //   this.deliveryStream.next(delivery);
      // }
    });
  }

  private async listenToAccountsChanged(): Promise<void> {
    window.ethereum.on('accountsChanged', async () => {
      await this.updateAccounts();
    });
  }

  private async updateAccounts(): Promise<void> {
    const accounts = await this.web3.eth.getAccounts();
    const address = accounts[0];
    let balance = await this.web3.eth.getBalance(accounts[0]);
    balance = this.web3.utils.fromWei(balance, 'ether');
    this.account.next({address, balance});
  }

  private async getCurrentNetwork(): Promise<void> {
    const network = await this.web3.eth.net.getNetworkType();
    this.network.next(network);
  }
}