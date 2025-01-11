import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

interface ApiError {
  error: {
    message: string;
  };
  status: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected loginForm: FormGroup<LoginForm>;
  protected loginFailed?: string;

  public constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup<LoginForm>({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  protected login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value as { email: string; password: string };
      this.authService.login(email, password).subscribe({
        next: () => {
          console.log("User logged in!");
          this.router.navigate(['/main']);
        },
        error: (err: ApiError) => {
          if (typeof err.error.message === 'string') {
            this.loginFailed = err.error.message;
          } else {
            this.loginFailed = 'Invalid credentials or server error. Please try again.';
          }
        },
      });
    }
  }
}
