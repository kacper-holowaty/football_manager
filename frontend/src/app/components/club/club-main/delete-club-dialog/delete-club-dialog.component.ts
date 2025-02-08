import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-club-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-club-dialog.component.html',
  styleUrl: './delete-club-dialog.component.scss'
})
export class DeleteClubDialogComponent {
  public constructor(public dialogRef: MatDialogRef<DeleteClubDialogComponent>) {}

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
