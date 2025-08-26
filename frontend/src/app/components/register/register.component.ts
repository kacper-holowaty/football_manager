import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../services/toast.service';
import { UserRequest } from '../../models/user.model';

interface RegisterForm {
  readonly firstName: FormControl<string | null>;
  readonly lastName: FormControl<string | null>;
  readonly username: FormControl<string | null>;
  readonly email: FormControl<string | null>;
  readonly password: FormControl<string | null>;
  readonly confirmPassword: FormControl<string | null>;
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
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-z][A-Za-z0-9_]{2,29}$/)
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{8,}$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  public ngOnInit(): void {
    this.authService.logout();
  }

  protected onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const user: UserRequest = {
        firstName: formValue.firstName ?? '',
        lastName: formValue.lastName ?? '',
        username: formValue.username ?? '',
        email: formValue.email ?? '',
        password: formValue.password ?? '',
      };
      
      this.authService.register(user).subscribe({
        next: () => {
          this.toastService.showToast(`Successfully registered as ${user.username}`);
          this.router.navigate([`/main`]);
        },
        error: (err: HttpErrorResponse) => {
          if (err.error && typeof err.error === 'object' && 'message' in err.error) {
            const errorMessage = (err.error as { message: string }).message;
            this.registrationFailed = errorMessage;
            this.toastService.showToast(errorMessage);
          } else {
            const defaultMessage = 'An error occurred. Please try again later.';
            this.registrationFailed = defaultMessage;
            this.toastService.showToast(defaultMessage);
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
