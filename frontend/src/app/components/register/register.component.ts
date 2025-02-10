import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../services/toast.service';

interface RegisterForm {
  readonly firstName: FormControl<string | null>;
  readonly lastName: FormControl<string | null>;
  readonly email: FormControl<string | null>;
  readonly password: FormControl<string | null>;
  readonly confirmPassword: FormControl<string | null>;
}

interface ApiError {
  readonly status: number;
  readonly error: {
    message: string;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  protected registerForm: FormGroup<RegisterForm>;
  protected registrationFailed?: string;
  
  protected passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password') as FormControl<string | null>;
    const confirmPassword = control.get('confirmPassword') as FormControl<string | null>;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  public constructor(private router: Router, private authService: AuthService, private toastService: ToastService) {
    this.registerForm = new FormGroup<RegisterForm>({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  public ngOnInit(): void {
    this.authService.logout();
  }

  protected onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const user: User = {
        id: uuidv4(),
        firstName: formValue.firstName ?? '',
        lastName: formValue.lastName ?? '',
        email: formValue.email ?? '',
        password: formValue.password ?? '',
      };
      
      this.authService.register(user).subscribe({
        next: () => {
          this.toastService.showToast(`Successfully registered as ${user.email}`);
          this.router.navigate([`/main`]);
        },
        error: (err: ApiError) => {
          if (typeof err.error.message === 'string') {
            this.registrationFailed = err.error.message;
            this.toastService.showToast(`${err.error.message}`);
          } else {
            this.registrationFailed = 'An error occurred. Please try again later.';
            this.toastService.showToast('An error occurred. Please try again later.');
          }
        }
      });
    }
  }

  protected goToHome(): void {
    this.router.navigate(['/']);
  }

  protected goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
