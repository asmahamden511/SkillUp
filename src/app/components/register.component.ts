import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/interfaces';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <!-- Animated Background Elements -->
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>

      <!-- Registration Form Card -->
      <div class="register-card">
        <div class="card-header">
          <div class="logo-section">
            <div class="logo-icon">
              <mat-icon>school</mat-icon>
            </div>
            <h1 class="brand-title">SkillUp Platform</h1>
            <p class="brand-subtitle">Join the Next Generation of Learners</p>
          </div>
        </div>
        
        <div class="card-content">
          <div class="form-header">
            <h2>Create Your Account</h2>
            <p>Start your journey to professional excellence</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-group">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Full Name</mat-label>
                <input matInput type="text" formControlName="name" required placeholder="Enter your full name">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                  Full name is required
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-group">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="email" required placeholder="Enter your email">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                  Email address is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-group">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required placeholder="Create a strong password">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                  Password must be at least 6 characters long
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-group">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Confirm Password</mat-label>
                <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword" required placeholder="Confirm your password">
                <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
                  <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                  Please confirm your password
                </mat-error>
                <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                  Passwords do not match
                </mat-error>
              </mat-form-field>
            </div>
            
            <button mat-raised-button type="submit" 
                    class="register-button" 
                    [disabled]="registerForm.invalid || isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!isLoading">person_add</mat-icon>
              <span *ngIf="!isLoading">Create Account</span>
              <span *ngIf="isLoading">Creating Account...</span>
            </button>
          </form>
        </div>
        
        <div class="card-footer">
          <div class="login-prompt">
            <p>Already have an account? <a routerLink="/login" class="login-link">Sign In</a></p>
          </div>
          
          <div class="features-highlight">
            <div class="feature">
              <mat-icon>trending_up</mat-icon>
              <span>Skill Development</span>
            </div>
            <div class="feature">
              <mat-icon>psychology</mat-icon>
              <span>AI-Powered Learning</span>
            </div>
            <div class="feature">
              <mat-icon>workspace_premium</mat-icon>
              <span>Professional Growth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-gradient-start) 0%, var(--primary-gradient-end) 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .bg-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .shape {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 100px;
      height: 100px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 150px;
      height: 150px;
      top: 20%;
      right: 15%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    .shape-4 {
      width: 120px;
      height: 120px;
      bottom: 15%;
      right: 10%;
      animation-delay: 1s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }
    
    .register-card {
      width: 100%;
      max-width: 480px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      position: relative;
      z-index: 2;
      animation: slideUp 0.8s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .card-header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      padding: 3rem 2rem;
      text-align: center;
      color: white;
      position: relative;
    }

    .card-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }
    
    .logo-section {
      position: relative;
      z-index: 1;
    }

    .logo-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .logo-icon mat-icon {
      font-size: 40px;
      color: white;
    }
    
    .brand-title {
      margin: 0 0 0.5rem 0;
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
      font-weight: 300;
    }
    
    .card-content {
      padding: 2.5rem;
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
      font-size: 1.8rem;
      font-weight: 600;
    }

    .form-header p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      position: relative;
    }

    .form-field {
      width: 100%;
    }

    .form-field .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    .form-field .mat-mdc-text-field-wrapper {
      border-radius: 12px;
    }

    .form-field input {
      font-size: 1rem;
      padding: 1rem;
    }

    .form-field .mat-mdc-form-field-label {
      font-weight: 500;
    }
    
    .register-button {
      width: 100%;
      height: 56px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 28px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      border: none;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
      text-transform: none;
      letter-spacing: 0.02em;
    }

    .register-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }

    .register-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .button-spinner {
      margin-right: 0.5rem;
    }
    
    .card-footer {
      padding: 2rem;
      background: var(--surface-secondary);
      border-top: 1px solid var(--border-color);
    }

    .login-prompt {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-prompt p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .login-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .login-link:hover {
      color: var(--accent-color);
      text-decoration: underline;
    }

    .features-highlight {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease;
    }

    .feature:hover {
      transform: translateY(-2px);
    }

    .feature mat-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .feature span {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .register-container {
        padding: 1rem;
      }

      .register-card {
        max-width: 100%;
      }

      .card-header {
        padding: 2rem 1.5rem;
      }

      .brand-title {
        font-size: 1.8rem;
      }

      .card-content {
        padding: 2rem 1.5rem;
      }

      .features-highlight {
        flex-direction: column;
        gap: 0.5rem;
      }

      .feature {
        flex-direction: row;
        text-align: left;
        padding: 0.75rem;
      }

      .feature mat-icon {
        margin-bottom: 0;
        margin-right: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .card-header {
        padding: 1.5rem 1rem;
      }

      .brand-title {
        font-size: 1.6rem;
      }

      .card-content {
        padding: 1.5rem 1rem;
      }

      .card-footer {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const registerData: RegisterRequest = this.registerForm.value;
      
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Account created successfully! You can now sign in.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Error creating account. Please try again.',
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );
        }
      });
    }
  }
}
