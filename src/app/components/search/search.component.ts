import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { DappService } from 'src/app/services/dapp.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Type } from 'src/app/models/type';
import { MatDialog } from '@angular/material/dialog';
import { CharityComponent } from './charity/charity.component';
import { SupplierComponent } from './supplier/supplier.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private isSending = false;
  private isSubmitted = false;
  public searchForm: FormGroup;

  constructor(private zone: NgZone,
    private formBuilder: FormBuilder,
    private dappService: DappService,
    private notificationService: NotificationService,
    protected formDirective: FormGroupDirective,
    public dialog: MatDialog
  ) {
  }

  public ngOnInit(): void {
    const sForm = this.formBuilder.group({
      search: ['']
    });
    this.searchForm = this.formBuilder.group({
      sForm,
    });
  }

  public onSubmit(formDirective: FormGroupDirective) {
    this.isSending = true;
    if (this.searchForm.value.sForm.search = null || this.searchForm.invalid) {
      return;
    }
    //const format = this.formatForm(this.creationForm.value);
    this.dappService.searchInfo(this.searchForm.value.search)
      .then(res => {
        this.notificationService.sendSuccess('Information successfully retrieved!');
        if (res.deadline = null) {
          const requestInfo = this.dappService.decodeSupplier(this.searchForm.value.sForm.search, res);
          this.dialog.open(SupplierComponent, {
            data: requestInfo 
          })
        } else {
          const requestInfo = this.dappService.decodeRequest(this.searchForm.value.sForm.search, res);
          this.dialog.open(CharityComponent, {
            data: requestInfo 
          })
        } console.log("Searched Item: " + this.searchForm.value.sForm.search);
      })
      .catch(err => this.notificationService.sendError('Something went wrong while searching'))
      .finally(() => this.isSending = false);
    // this.resetForm(formDirective);
  }

  // private resetForm(formDirective: FormGroupDirective) {
  //   this.searchForm.reset();
  //   formDirective.resetForm();
  // }
}
