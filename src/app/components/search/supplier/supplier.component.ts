import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DappService } from 'src/app/services/dapp.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements AfterViewInit {

  public isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public suppData: any,
    public dialogRef: MatDialogRef<SupplierComponent>,
    private dappService: DappService,
    public dialog: MatDialog
    //private dappService: DappService
  ) {
    this.closeDialog();
  }

  public ngAfterViewInit() {
    this.isLoading = false;
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }
}
