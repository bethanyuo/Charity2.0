import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private snackBar: MatSnackBar) {}

  public sendError(message: string): void {
    this.openSnackBar(message, 'notification-error');
  }

  public sendSuccess(message: string): void {
    this.openSnackBar(message, 'notification-success');
  }

  private openSnackBar(message: string, panelClass: 'notification-error' | 'notification-success'): void {
    this.snackBar.open(message, null, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass
    });
  }

}