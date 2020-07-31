import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

@Injectable({
  providedIn: 'root'
})
export class DappService {

  constructor(private web3Service: Web3Service) { }

  
}
