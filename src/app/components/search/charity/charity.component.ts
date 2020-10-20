import { AfterViewInit, Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DappService } from 'src/app/services/dapp.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { CharityInfoComponent } from '../../charity-info/charity-info.component';
import { SelectionState } from 'src/app/models/selectionState';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss']
})
export class CharityComponent implements AfterViewInit {
  public requestState = SelectionState;
  public isSending = false;
  public isLoading = true;
  public timer = { days: null, hours: null, minutes: null, seconds: null };
  public deadlineExceeded = false;

  types = [
    { value: true, viewValue: 'YES' },
    { value: false, viewValue: 'NO' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public requestData: any,
    public dialogRef: MatDialogRef<CharityComponent>,
    private router: Router,
    private dappService: DappService,
    public dialog: MatDialog
    //private dappService: DappService
  ) {
    this.initTimer();
  }

  public ngAfterViewInit() {
    this.isLoading = false;
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }

  public navApply(charity: string) {
    // Pass along the hero id if available
    // so that the HeroList component can select that item.
    this.isSending = true;
    console.log("Application is now sending: " + this.isSending)
    console.log("11111111111111111111111111111")
    setTimeout(() => {
      this.router.navigate(['/']);
      this.dappService.getCharityInfo(charity).then(request => {
        this.dialog.open(CharityInfoComponent, {
          data: {charity, request}
        });
      });
      this.isSending = false;
      console.log("Application is sending: " + this.isSending)
      console.log("2222222222222222222222222222222")
    }, 2500);
    console.log("Application is still sending: " + this.isSending);
    this.closeDialog();
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
