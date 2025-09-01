import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';

interface EditUserForm {
  readonly firstName: FormControl<string | null>;
  readonly lastName: FormControl<string | null>;
  readonly email: FormControl<string | null>;
}

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent implements OnInit {
  protected editUserForm: FormGroup<EditUserForm>;

  public constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
    this.editUserForm = new FormGroup<EditUserForm>({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40),
        Validators.pattern(/^[\p{Lu}][\p{L} -]*[\p{L}]$/u)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40),
        Validators.pattern(/^(?![ -])[\p{L} -]*[\p{L}]$/u)
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  public ngOnInit(): void {
    this.editUserForm.patchValue({
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      email: this.data.email,
    });
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected onSave(): void {
    if (this.editUserForm.valid) {
      const formValue = this.editUserForm.value;
      const updatedUser: Partial<User> = {
        firstName: formValue.firstName ?? '',
        lastName: formValue.lastName ?? '',
        email: formValue.email ?? '',
      };
      this.dialogRef.close(updatedUser);
    }
  }
}
