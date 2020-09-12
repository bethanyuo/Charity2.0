import { Component, Inject, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Web3Service } from 'src/app/services/web3.service';
import { DappService } from 'src/app/services/dapp.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionState } from 'src/app/models/selectionState';
import { MatStepper } from '@angular/material/stepper';
import { NotificationService } from 'src/app/services/notification.service';
import { IAccount } from 'src/app/models/account';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-charity-info',
  templateUrl: './charity-info.component.html',
  styleUrls: ['./charity-info.component.scss']
})
export class CharityInfoComponent implements AfterViewInit {
  public contractor: any;
  public supplier: any;
  public isWeb3Ready = false;
  public requestState = SelectionState;
  public currentAccount: IAccount;
  private subscription = new Subscription();
  public steps = [];
  public isLoading = true;
  public isSending = false;
  public applicationForm: FormGroup;
  public timer = { days: null, hours: null, minutes: null, seconds: null };
  public deadlineExceeded = false;
  //private contractor: any;
  //public applicationDisabled: boolean;
  public startDeliveryDisabled: boolean;
  public markDeliveryDisabled: boolean;
  public startDeliveryTooltipText: string;
  public markDeliveryTooltipText: string;
  @ViewChild('stepper') stepper: MatStepper;

  types = [
    { value: true, viewValue: 'YES' },
    { value: false, viewValue: 'NO' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public requestData: any,
    public dialogRef: MatDialogRef<CharityInfoComponent>,
    private formBuilder: FormBuilder,
    private web3Service: Web3Service,
    private dappService: DappService,
    private notificationService: NotificationService,
    private zone: NgZone
    ) {
      this.listenToIsWeb3Ready();
      this.initSteps();
      this.initApplicationForm();
      this.setStartDeliveryDisabled();
      this.setCompleteDeliveryDisabled();
      this.initTimer();
  }

  private listenToIsWeb3Ready(): void {
    this.web3Service.isWeb3Ready$.subscribe(isReady => {
      if (isReady) {
        this.isWeb3Ready = isReady;
        this.listenToAccountChanges();
      }
    });
  }

  private listenToAccountChanges(): void {
    const subscription = this.web3Service.account$.subscribe(account => {
      this.zone.run(() => {
        this.currentAccount = account;
        console.log(this.currentAccount.address);
      });
    });
    this.subscription.add(subscription);
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.stepper.selectedIndex = this.requestData.isSelected = false ? 0 : 1;
      this.steps.forEach((step, index: number) => {
        if (index <= this.stepper.selectedIndex) {
          step.completed = true;
        }
      });
      this.isLoading = false;
      //console.log(this.steps.length);
    }, 1000);
  }


  private initSteps(): void {
    for (const state in SelectionState) {
      if (isNaN(Number(state)) && state !== 'ENDED') {
          this.steps.push({ id: SelectionState[state], completed: false });
      }
    }
  }

  public onApplyToRequest(): void {
    this.isSending = true;
    this.dappService.selectCharity(this.requestData.charity, this.applicationForm.value.name, this.applicationForm.value.address)
      .then(async () => {
        this.notificationService.sendSuccess('Congrats, you just applied to this delivery!');
        this.requestData = await this.dappService.getCharityInfo(this.requestData.charity);
      })
      .catch(err => this.notificationService.sendError('Something went wrong during the application'))
      .finally(() => {
        this.isSending = false;
        this.closeDialog();
      });
  }

  public onCompleteDelivery(): void {
    this.isSending = true;
    this.dappService.completeDelivery(this.requestData.charity, this.supplier, this.contractor.supplierID)
      .then(async () => {
        this.notificationService.sendSuccess('Congrats, you just completed this request to this delivery! Your tokens will be reflected in your account shortly.');
        this.requestData = await this.dappService.getCharityInfo(this.requestData.charity);
      })
      .catch(err => this.notificationService.sendError('Something went wrong during the application'))
      .finally(() => {
        this.isSending = false;
        this.closeDialog();
      });
  }

  private setStartDeliveryDisabled(): void {
    this.startDeliveryDisabled = this.applicationForm.value.address !== this.currentAccount.address;
    if (this.startDeliveryDisabled) {
      this.startDeliveryTooltipText = `Only sender with address ${this.currentAccount.address} can start this delivery`;
    } else {
      this.startDeliveryTooltipText = `Hi sender, you can start this delivery whenever you want!`;
    }
  }

  private setCompleteDeliveryDisabled(): void {
    this.dappService.getContractor(this.requestData.charity)
      .then(async contractor => {
        this.supplier = contractor;
        this.contractor = await this.dappService.callContractor(contractor);
        console.log('Contractor Info: ', this.contractor);
        console.log('Contractor ID: ', this.contractor.supplierID);
        this.markDeliveryDisabled = this.contractor.supplierID !== this.currentAccount.address;
        if (this.markDeliveryDisabled) {
          this.markDeliveryTooltipText = `Only contractor with address ${this.contractor.supplierID} can start this delivery`;
        } else {
          this.markDeliveryTooltipText = `Hi contractor, you can mark this delivery as COMPLETE whenever you want!`;
        }
      })
      .catch(err => this.notificationService.sendError('Something went wrong while fetching contractor data'));
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }

  private initApplicationForm(): void {
    this.applicationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  private initTimer(): void {
    const countDownDate = new Date(this.requestData.deadline).getTime();
    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      this.timer.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.timer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.timer.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.timer.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(x);
        this.deadlineExceeded = true;
      }
    }, 1000);
  }

}
