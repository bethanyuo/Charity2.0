import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class DappService {

  constructor(private web3Service: Web3Service) { }

  public async createRequest(charityName: string, charityID: string, request: string, members: number, primaryContact: string, urgent: boolean, requestType: Category, currentAddress: string): Promise<any> {
    console.log("CREATE CLIENT");
    try {
      return await this.web3Service.contract.methods.addRequest(charityName, charityID, request, members, primaryContact, urgent, requestType).send({ from: currentAddress, gas: 3000000 });
    } catch (err) {
      console.log('ClientService.createClient(): failed:', err);
      alert('ClientService.createClient(): failed:' + err);
      return err;
    }
  }

  public async createContractor(supplierName: string, supplierID: string, members: number, primaryContact: string, category: Category, currentAddress: string): Promise<any> {
    console.log("CREATE CONTRACTOR");
    try {
      return await this.web3Service.contract.methods.addSupplier(supplierName, supplierID, members, primaryContact, category).send({ from: currentAddress, gas: 3000000 });
    } catch (err) {
      console.log('SelectService.selectCharity(): failed:', err);
      alert('SelectService.selectCharity(): failed:' + err);
      return err;
    }
  }

  public async callContractor(supplierName: string): Promise<any> {
    console.log("CALL CONTRACTOR");
    try {
      //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
      //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
      //let owner: string = this.web3Service.owner;
      return await this.web3Service.contract.methods.getSupplier(supplierName).call();
    } catch (err) {
      console.log('SelectService.selectCharity(): failed:', err);
      alert('SelectService.selectCharity(): failed:' + err);
      return err;
    }
  }

  public async getContractor(charityName: string): Promise<string> {
    console.log("CALL CONTRACTOR");
    try {
      return await this.web3Service.contract.methods.getPair(charityName).call();
    } catch (err) {
      console.log('DappService.getPair(): failed:' + err);
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

  public async loadRequests(): Promise<any> {
    try {
      const count = await this.web3Service.contract.methods.requestCount().call();
      const requests = [];
      for (let i = 0; i < count; i++) {
        const charity = await this.web3Service.contract.methods.getRequest(i).call();
        const request = await this.web3Service.contract.methods.getCharity(charity).call();
        const decodedRequest = this.decodeRequest(charity, request);
        requests.push(decodedRequest);
      }
      return requests;
    } catch (err) {
      console.log('MEGA ERROR ', err);
    }
  }

  public async getCharityInfo(charityName: string): Promise<any> {
    console.log("GET CLIENT");
    try {
      let rVal = await this.web3Service.contract.methods.getCharity(charityName).call();
      const decodedRequest = this.decodeRequest(charityName, rVal);
      return decodedRequest;
    } catch (err) {
      throw err;
    }
  }

  public async searchInfo(name: string): Promise<any> {
    console.log("GET CLIENT");
    try {
      let rVal = await this.web3Service.contract.methods.searchInfo(name).call();
      return rVal;
    } catch (err) {
      throw err;
    }
  }

  public async getRequestCount(): Promise<number> {
    const count = await this.web3Service.contract.methods.requestCount().call();
    return count;
  }

  // public async setCharityInfo(charityName: string): Promise<any> {
  //   console.log("GET CLIENT");
  //   try {
  //     //let owner: string = await this.web3Service.contract.methods.getCurrentOwner().call();
  //     //let owner: string = "0x81E0ABF825FA3DF39E2EF2B063504C344B9702D3A".toUpperCase();
  //     const accounts = await this.web3Service.web3.eth.getAccounts();
  //     const from = accounts[0];
  //     //let owner: string = this.web3Service.owner;
  //     let rVal = await this.web3Service.contract.methods.getCharityInfo(charityName).send({ from: from, gas: 3000000 });
  //     return rVal;
  //   } catch (err) {
  //     // console.log('SearchService.getCharityInfo(): failed:', err);
  //     // alert('SearchService.getCharityInfo(): failed:' + err);
  //     throw err;
  //     //return err;
  //   }
  // }
  
  public async selectCharity(charityName: string, supplierName: string, supplierID: string): Promise<boolean> {
    console.log("SELECT CLIENT");
    console.log("Charity name = " + charityName);
    try {
      return await this.web3Service.contract.methods.selectCharity(charityName, supplierName, supplierID).send({ from: supplierID, gas: 3000000 });
    } catch (err) {
      throw err;
    }
  }

  public decodeRequest(charity: string, request: any) {
    let urgent: boolean;
    let state: number;
    request.tokenReward > 2 ? urgent = true : urgent = false;
    request.isSelected = false ? state = 0 : state = 1;
    return {
      charity: charity,
      selected: request.isSelected,
      deadline: new Date(0).setUTCSeconds(+request.deadline),
      //address: this.web3Service.web3.utils.toUtf8(request.ID),
      address: request.ID,
      members: request.members,
      reward: request.tokenReward,
      request: request.request,
      contact: request.primaryContact,
      urgent: urgent,
      state: +state,
      category: +request.category,
      timestamp: new Date(0).setUTCSeconds(+request.timestamp)
    };
  }

  public decodeSupplier(contractor: string, info: any) {
    return {
      contractor: contractor,
      address: info.supplierID,
      members: info.members,
      contact: info.primaryContact,
      posRequests: +info.completedRequests,
      negRequests: +info.incompletedRequests,
      category: +info.category,
      timestamp: new Date(0).setUTCSeconds(+info.timestamp)
    };
  }

}
