import { Component, NgZone, OnDestroy } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { Subscription } from 'rxjs';
import { IAccount } from '../../models/account';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy {
  public isWeb3Ready = false;
  public currentAccount: IAccount;
  public currentNetwork: string;
  public currentbalance: string;
  public deliveryCount: number;
  private subscription = new Subscription();
  public a: string;
  public b: string;


  constructor(private zone: NgZone, private web3Service: Web3Service) {
    this.listenToIsWeb3Ready();
  }

  private listenToIsWeb3Ready(): void {
    this.web3Service.isWeb3Ready$.subscribe(isReady => {
      if (isReady) {
        this.isWeb3Ready = isReady;
        this.listenToAccountChanges();
        this.listenToNetworkChanges();
      }
    });
  }

  private listenToAccountChanges(): void {
    const subscription = this.web3Service.account$.subscribe(account => {
      this.zone.run(() => {
        this.currentAccount = account;
        console.log(this.currentAccount.address);
        this.newAccount(this.currentAccount.address, this.currentAccount.balance);
      });
    });
    this.subscription.add(subscription);
  }

  private newAccount(accountA: string, accountB: string): void {
    let var1 = accountA.slice(0, 6);
    let var2 = accountA.slice((accountA.length - 4), accountA.length);
    let var3 = `${var1}...${var2}`;
    
    let num = parseFloat(accountB);
    let num2 = num.toFixed(4);
    let num3 = num2.toString();
    this.a = var3;
    console.log("This is the address = " + this.a)
    this.b = num3;
  }

  private listenToNetworkChanges(): void {
    const subscription = this.web3Service.network$.subscribe(network => {
      this.zone.run(() => {
        this.currentNetwork = network;
      });
    });
    this.subscription.add(subscription);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
