import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-achievement-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-achievement-dialog.component.html',
  styleUrl: './delete-achievement-dialog.component.scss'
})
export class DeleteAchievementDialogComponent {
  public constructor(public dialogRef: MatDialogRef<DeleteAchievementDialogComponent>) {}

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
