import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class DappService {

  constructor(private web3Service: Web3Service) { }

  public async createClient(charityName: string, charityID: string, request: string, members: number, primaryContact: string, urgent: boolean, requestType: Category): Promise<any> {
    console.log("CREATE CLIENT");
    try {
      return await this.web3Service.contract.methods.addCharity(charityName, charityID, request, members, primaryContact, urgent, requestType).send({ from: charityID, gas: 3000000 });
    } catch (err) {
      console.log('ClientService.createClient(): failed:', err);
      alert('ClientService.createClient(): failed:' + err);
      return err;
    }
  }

  public async createContractor(supplierName: string, supplierID: string, members: number, primaryContact: string, category: Category): Promise<string> {
    console.log("CREATE CONTRACTOR");
    try {
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
      // const accounts = await this.web3Service.web3.eth.getAccounts();
      // const from = accounts[0];
      //let owner: string = this.web3Service.owner;
      return await this.web3Service.contract.methods.addSupplier(supplierName, supplierID, members, primaryContact, category).send({ from: supplierID, gas: 3000000 });
    } catch (err) {
      console.log('SelectService.selectCharity(): failed:', err);
      alert('SelectService.selectCharity(): failed:' + err);
      return err;
    }
  }

  public async callContractor(supplierName: string, supplierID: string, members: number, primaryContact: string, category: Category): Promise<string> {
    console.log("CALL CONTRACTOR");
    try {
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
      //let owner: string = this.web3Service.owner;
      return await this.web3Service.contract.methods.addSupplier(supplierName, supplierID, members, primaryContact, category).call();
    } catch (err) {
      console.log('SelectService.selectCharity(): failed:', err);
      alert('SelectService.selectCharity(): failed:' + err);
      return err;
    }
  }

  public async completeDelivery(charityName: string, supplierName: string, supplierID: string): Promise<boolean> {
    console.log("SELECT CLIENT");
    console.log("Charity name = " + charityName);
    try {
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
      // const accounts = await this.web3Service.web3.eth.getAccounts();
      // const from = accounts[0];
      //let owner: string = this.web3Service.owner;
      return await this.web3Service.contract.methods.deliverRequest(charityName, supplierName, supplierID).send({ from: supplierID, gas: 3000000 });
    } catch (err) {
      console.log('SelectService.selectCharity(): failed:', err);
      alert('SelectService.selectCharity(): failed:' + err);
      return err;
    }
  }

  public async getCharityInfo(charityName: string): Promise<any> {
    console.log("GET CLIENT");
    try {
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
      //let owner: string = this.web3Service.owner;
      let rVal = await this.web3Service.contract.methods.getCharityInfo(charityName).call();
      return rVal;
    } catch (err) {
      // console.log('SearchService.getCharityInfo(): failed:', err);
      // alert('SearchService.getCharityInfo(): failed:' + err);
      throw err;
      //return err;
    }
  }

  public async setCharityInfo(charityName: string): Promise<any> {
    console.log("GET CLIENT");
    try {
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
      const accounts = await this.web3Service.web3.eth.getAccounts();
      const from = accounts[0];
      //let owner: string = this.web3Service.owner;
      let rVal = await this.web3Service.contract.methods.getCharityInfo(charityName).send({ from: from, gas: 3000000 });
      return rVal;
    } catch (err) {
      // console.log('SearchService.getCharityInfo(): failed:', err);
      // alert('SearchService.getCharityInfo(): failed:' + err);
      throw err;
      //return err;
    }
  }
  
  public async selectCharity(charityName: string, supplierName: string, supplierID: string): Promise<boolean> {
    console.log("SELECT CLIENT");
    console.log("Charity name = " + charityName);
    try {
      //console.log("Charity name = " + charityName);
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
      //let owner: string = this.web3Service.owner;
      return await this.web3Service.contract.methods.selectCharity(charityName, supplierName, supplierID).send({ from: supplierID, gas: 3000000 });
    } catch (err) {
      // console.log('SelectService.selectCharity(): failed:', err);
      // alert('SelectService.selectCharity(): failed:' + err);
      throw err;
    }
  }

}
