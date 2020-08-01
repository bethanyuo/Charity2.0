import { Category } from './category';

export class Charity {
    public name: string;
    public ID: string;
    public members: number;
    public primaryContact: string;
    public request: string;
    public category: Category;
    public tokenReward: number;
    public selected: boolean;
    public supplierName: string;
    public supplierID: string;
    public charityList: string;
    public reqType: string;
    constructor() {
      //this.selected = true;
      this.reqType = '';
    }
  }
