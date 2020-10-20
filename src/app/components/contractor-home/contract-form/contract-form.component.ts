import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
    this.contractorForm = this.formBuilder.group({
      contractorName: ['', Validators.required],
      contactEmail: ['', Validators.required],
      members: ['', Validators.required],
      address: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  public onSubmit(formDirective: FormGroupDirective) {
    this.isSending = true;
    if (this.contractorForm.invalid) {
      return;
    }      
    console.log(this.contractorForm.value);
    this.dappService.createContractor(this.contractorForm.value.contractorForm, this.contractorForm.value.address,this.contractorForm.value.members, this.contractorForm.value.primaryContact, this.contractorForm.value.type, this.currentAccount.address)
      .then(res => {
        this.notificationService.sendSuccess('Delivery successfully created!');
      })
      .catch(err => this.notificationService.sendError('Something went wrong while creating delivery'))
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
}
