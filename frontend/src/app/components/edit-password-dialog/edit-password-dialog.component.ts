import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface EditPasswordForm {
  readonly oldPassword: FormControl<string | null>;
  readonly newPassword: FormControl<string | null>;
  readonly confirmNewPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-edit-password-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-password-dialog.component.html',
  styleUrls: ['./edit-password-dialog.component.scss']
})
export class EditPasswordDialogComponent {
  protected passwordForm: FormGroup<EditPasswordForm>;

  protected passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword') as FormControl<string | null>;
    const confirmNewPassword = control.get('confirmNewPassword') as FormControl<string | null>;

    return newPassword.value === confirmNewPassword.value ? null : { mismatch: true };
  };

  public constructor(
    public dialogRef: MatDialogRef<EditPasswordDialogComponent>
  ) {
    this.passwordForm = new FormGroup<EditPasswordForm>({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{8,}$/)
      ]),
      confirmNewPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected onSaveClick(): void {
    if (this.passwordForm.valid) {
      this.dialogRef.close(this.passwordForm.value);
    }
  }
}