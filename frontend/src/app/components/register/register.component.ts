import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../services/auth.service';

interface RegisterForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

interface ApiError {
  error: {
    message: string;
  };
  status: number;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  protected registerForm: FormGroup<RegisterForm>;
  protected registrationFailed?: string;
  
  protected passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password') as FormControl<string | null>;
    const confirmPassword = control.get('confirmPassword') as FormControl<string | null>;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  public constructor(private router: Router, private authService: AuthService) {
    this.registerForm = new FormGroup<RegisterForm>({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
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
          console.log("User registered!");
          this.router.navigate([`/main`]);
        },
        error: (err: ApiError) => {
          if (typeof err.error.message === 'string') {
            this.registrationFailed = err.error.message;
          } else {
            this.registrationFailed = 'An error occurred. Please try again later.';
          }
        }
      });
    }
  }
}
