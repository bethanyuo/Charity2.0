import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IAccount } from 'src/app/models/account';
import { DappService } from 'src/app/services/dapp.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Web3Service } from 'src/app/services/web3.service';
import { Type } from 'src/app/models/type';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit {
  @Input() public control: FormControl;
  public currentAccount: IAccount;
  public contractorForm: FormGroup;
  public submitted = false;
  public isSending = false;
  private subscription = new Subscription();

  types: Type[] = [
    { value: 0, viewValue: 'Food' },
    { value: 1, viewValue: 'Clothing' },
    { value: 2, viewValue: 'Furniture' },
    { value: 3, viewValue: 'Education' },
    { value: 4, viewValue: 'Transport' },
    { value: 5, viewValue: 'Medical' },
    { value: 6, viewValue: 'Funding' }
  ];

  constructor(
    private zone: NgZone,
    private formBuilder: FormBuilder,
    private web3Service: Web3Service,
    private dappService: DappService,
    private notificationService: NotificationService,
    protected formDirective: FormGroupDirective
    ) {
    this.web3Service.isWeb3Ready$.subscribe(isReady => {
      if (isReady) {
        this.listenToAccountChanges();
      }
    });
  }

  public ngOnInit(): void {
    const supplierInfo = this.formBuilder.group({
      contractorName: ['', Validators.required],
      contactEmail: ['', Validators.required],
      members: ['', Validators.required],
      address: ['', Validators.required],
      type: ['', Validators.required]
    });
    this.contractorForm = this.formBuilder.group({
      supplierInfo
    });
  }

  public onSubmit(formDirective) {
    this.isSending = true;
    if (this.contractorForm.invalid) {
      return;
    }      
    console.log("Contractor Name is " + this.contractorForm.value.supplierInfo.contractorName);
    this.dappService.createContractor(this.contractorForm.value.supplierInfo.contractorName, this.contractorForm.value.supplierInfo.address, this.contractorForm.value.supplierInfo.members, this.contractorForm.value.supplierInfo.contactEmail, this.contractorForm.value.supplierInfo.type, this.currentAccount.address)
      .then(res => {
        this.notificationService.sendSuccess('contract successfully created!');
        this.dappService.setFilteredData(res);
        console.log("This is the contractor = " + res);
        return res;
      })
      .catch(err => this.notificationService.sendError('Something went wrong while creating contract'))
      .finally(() => this.isSending = false);
    this.resetForm(formDirective);
  }


  private resetForm(formDirective: FormGroupDirective) {
    this.contractorForm.reset();
    formDirective.resetForm();
  }

  private listenToAccountChanges(): void {
    const subscription = this.web3Service.account$.subscribe(account => {
      this.zone.run(() => {
        this.currentAccount = account;
      });
    });
    this.subscription.add(subscription);
  }

  //  

}
