import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public requestData: any,
    public dialogRef: MatDialogRef<SupplierComponent>,
    //private dappService: DappService
  ) {
    this.closeDialog();
  }

  ngOnInit(): void {
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }
}
