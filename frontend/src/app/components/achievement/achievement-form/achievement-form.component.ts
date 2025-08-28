import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Achievement, AchievementRequest } from '../../../models/achievement.model';
import { AchievementService } from '../../../services/achievement.service';
import { ToastService } from '../../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { achievementsDateValidator } from '../../club/club-form/validators';

export interface AchievementForm {
  readonly name: FormControl<string | null>;
  readonly date: FormControl<string | null>;
  readonly description: FormControl<string | null>;
}

@Component({
  selector: 'app-achievement-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './achievement-form.component.html',
  styleUrl: './achievement-form.component.scss'
})
export class AchievementFormComponent {
  protected achievementForm: FormGroup<AchievementForm>;
  protected editing: boolean;
  protected clubId: string;
  protected achievement?: Achievement;
  protected errorMessage: string | null = null;

  public constructor(
    public dialogRef: MatDialogRef<AchievementFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clubId: string, editing: boolean, achievement?: Achievement, clubFoundedYear: number },
    private achievementService: AchievementService,
    private toastService: ToastService
  ) {
    this.clubId = data.clubId;
    this.editing = data.editing;
    this.achievement = data.achievement;

    this.achievementForm = new FormGroup<AchievementForm>({
      name: new FormControl(this.achievement?.name || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[\p{L}][\p{L}\p{N} .-]*$/u),
      ]),
      date: new FormControl(this.achievement?.date ? this.formatDateToYearMonthDay(new Date(this.achievement.date)) : null, [
        Validators.required,
        achievementsDateValidator(data.clubFoundedYear)
      ]),
      description: new FormControl(this.achievement?.description || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(500),
      ]),
    });
  }


  protected onSubmit(): void {
    if (!this.achievementForm.valid) {
      return;
    }

    const formValue = this.achievementForm.value;
    const achievementRequest: AchievementRequest = {
      name: formValue.name!,
      date: this.formatDateToYearMonthDay(new Date(formValue.date!)),
      description: formValue.description!,
    };

    if (this.editing && this.achievement) {
      this.achievementService.updateAchievement(this.clubId, this.achievement.achievementId, achievementRequest).subscribe({
        next: () => {
          this.toastService.showToast("Achievement updated successfully!");
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error, "updating");
        },
      });
    } else {
      this.achievementService.createAchievement(this.clubId, achievementRequest).subscribe({
        next: () => {
          this.toastService.showToast("Achievement added successfully!");
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error, "adding");
        },
      });
    }
  }

  private handleError(error: HttpErrorResponse, operation: string): void {
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      this.errorMessage = (error.error as { message: string }).message;
    } else {
      this.errorMessage = `An error occurred while ${operation} the achievement.`;
    }
    this.toastService.showToast(this.errorMessage);
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
  private formatDateToYearMonthDay(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
