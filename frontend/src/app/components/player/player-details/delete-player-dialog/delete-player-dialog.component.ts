import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-player-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-player-dialog.component.html',
  styleUrl: './delete-player-dialog.component.scss'
})
export class DeletePlayerDialogComponent {
  public constructor(public dialogRef: MatDialogRef<DeletePlayerDialogComponent>) {}
  
  protected onConfirm(): void {
    this.dialogRef.close(true);
  }
  
  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
