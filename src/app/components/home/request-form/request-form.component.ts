import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
//import { Type } from '../models/type';
import { MatStepper } from '@angular/material/stepper';
import { IAccount } from 'src/app/models/account';
import { FormGroup, FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Web3Service } from 'src/app/services/web3.service';
import { DappService } from 'src/app/services/dapp.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Type } from 'src/app/models/type';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  public currentAccount: IAccount;
  public creationForm: FormGroup;
  public submitted = false;
  public isSending = false;
  private subscription = new Subscription();

  selectedValue: number;
  urgent: boolean;

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
    const charityInfo = this.formBuilder.group({
      charityName: ['', Validators.required],
      contactEmail: ['', Validators.required],
      members: ['', Validators.required],
      ID: ['', Validators.required]
    });

    const requestInfo = this.formBuilder.group({
      request: ['', [Validators.required]],
      urgent: ['', [Validators.required]],
      type: ['', Validators.required]
    });

    this.creationForm = this.formBuilder.group({
      charityInfo,
      requestInfo
    });
  }

  public onSubmit(formDirective: FormGroupDirective) {
    this.isSending = true;
    if (this.creationForm.invalid) {
      return;
    }      
    console.log(this.creationForm.value);
    const format = this.formatForm(this.creationForm.value);
    console.log(this.currentAccount.address);
    this.dappService.createRequest(format.charityName, format.charityID, format.request, format.members, format.primaryContact, format.urgent, format.requestType, this.currentAccount.address)
      .then(res => {
        this.notificationService.sendSuccess('Request successfully created!');
        this.stepper.reset();
      })
      .catch(err => this.notificationService.sendError('Something went wrong while creating your request'))
      .finally(() => this.isSending = false);
    this.resetForm(formDirective);
  }

  private resetForm(formDirective: FormGroupDirective) {
    this.creationForm.reset();
    formDirective.resetForm();
  }

  private formatForm(request: any): any {
    return {
      charityName: request.charityInfo.charityName,
      charityID: request.charityInfo.ID,
      request: request.requestInfo.request,
      members: request.charityInfo.members,
      primaryContact: request.charityInfo.contactEmail,
      urgent: request.requestInfo.urgent,
      requestType: request.requestInfo.type,
    };
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
