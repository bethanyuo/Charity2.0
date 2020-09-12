import { Component } from '@angular/core';
import { Web3Service } from './services/web3.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'charity2';
  public isWeb3Ready$: Observable<boolean>;
//  public isWeb3Ready: boolean;
  
  constructor(private web3Service: Web3Service) {
    this.isWeb3Ready$ = this.web3Service.isWeb3Ready$;
//    this.listenToIsWeb3Ready();

  }

  // private listenToIsWeb3Ready(): void {
  //   this.web3Service.isWeb3Ready$.subscribe(isReady => this.isWeb3Ready = isReady);
  // }
}
