import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationFailed?: string;

  constructor(private router: Router, private authService: AuthService) {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const user: User = {
        id: uuidv4(),
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
      };

      
      this.authService.register(user).subscribe({
        next: () => {
          console.log("User registered!");
          this.router.navigate([`/club/main`]);
        },
        error: (err) => {
          console.error("Registration error:", err);
          this.registrationFailed = this.registrationFailed = err.error?.message || 'An error occurred. Please try again later.';
        }
      });
    }
  }
}
