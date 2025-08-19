import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../services/toast.service';

interface LoginForm {
  readonly login: FormControl<string | null>;
  readonly password: FormControl<string | null>;
}

interface ApiError {
  readonly status: number;
  readonly error: {
    message: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  protected loginForm: FormGroup<LoginForm>;
  protected loginFailed?: string;

  public constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {
    this.loginForm = new FormGroup<LoginForm>({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  public ngOnInit(): void {
    this.authService.logout();
  }

  protected login(): void {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value as { login: string; password: string };
      this.authService.login({ login, password }).subscribe({
        next: () => {
          this.toastService.showToast(`Successfully logged in as ${login}`);
          this.router.navigate(['/main']);
        },
        error: (err: ApiError) => {
          if (typeof err.error.message === 'string') {
            this.toastService.showToast(`${err.error.message}`);
            this.loginFailed = err.error.message;
          } else {
            this.toastService.showToast('Invalid credentials or server error. Please try again.');
            this.loginFailed = 'Invalid credentials or server error. Please try again.';
          }
        },
      });
    }
  }

  protected goToHome(): void {
    this.router.navigate(['/']);
  }

  protected goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
