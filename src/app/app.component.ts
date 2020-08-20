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
  
  constructor(private web3Service: Web3Service) {
    this.isWeb3Ready$ = this.web3Service.isWeb3Ready$;
  }
}
