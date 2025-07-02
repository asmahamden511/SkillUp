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
import { LoginRequest } from '../models/interfaces';

@Component({
  selector: 'app-login',
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
    <div class="login-container">
      <!-- Background Elements -->
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      
      <!-- Login Card -->
      <div class="login-wrapper">
        <mat-card class="login-card">
          <div class="card-header">
            <div class="logo-section">
              <div class="logo-icon-wrapper">
                <mat-icon class="logo-icon">school</mat-icon>
              </div>
              <h1>SkillUp Platform</h1>
              <p class="tagline">Empowering Your Professional Journey</p>
            </div>
          </div>
          
          <mat-card-content class="card-content">
            <div class="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your learning journey</p>
            </div>
            
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <div class="form-group">
                <mat-form-field appearance="outline" class="full-width modern-field">
                  <mat-label>Email Address</mat-label>
                  <input matInput type="email" formControlName="email" required>
                  <mat-icon matSuffix class="field-icon">email</mat-icon>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                    Please enter a valid email address
                  </mat-error>
                </mat-form-field>
              </div>
              
              <div class="form-group">
                <mat-form-field appearance="outline" class="full-width modern-field">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
                  <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button" class="password-toggle">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                    Password is required
                  </mat-error>
                </mat-form-field>
              </div>
              
              <div class="form-actions">
                <button mat-raised-button type="submit" 
                        class="login-button" 
                        [disabled]="loginForm.invalid || isLoading">
                  <span class="button-content" *ngIf="!isLoading">
                    <mat-icon>login</mat-icon>
                    Sign In
                  </span>
                  <mat-spinner diameter="24" *ngIf="isLoading"></mat-spinner>
                </button>
              </div>
            </form>
          </mat-card-content>
          
          <mat-card-actions class="card-footer">
            <div class="footer-links">
              <p>Don't have an account? 
                <a routerLink="/register" class="register-link">Create one now</a>
              </p>
              <a href="#" class="forgot-password">Forgot your password?</a>
            </div>
          </mat-card-actions>
        </mat-card>
        
        <!-- Feature Highlights -->
        <div class="features-section">
          <h3>Why Choose SkillUp?</h3>
          <div class="features-list">
            <div class="feature-item">
              <mat-icon>psychology</mat-icon>
              <span>AI-Powered Learning</span>
            </div>
            <div class="feature-item">
              <mat-icon>trending_up</mat-icon>
              <span>Career Growth Tracking</span>
            </div>
            <div class="feature-item">
              <mat-icon>group</mat-icon>
              <span>Expert Community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
      padding: 20px;
    }
    
    .background-shapes {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      
      .shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 20s ease-in-out infinite;
        
        &.shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }
        
        &.shape-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 10%;
          animation-delay: 7s;
        }
        
        &.shape-3 {
          width: 100px;
          height: 100px;
          bottom: 10%;
          left: 20%;
          animation-delay: 14s;
        }
      }
    }
    
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) translateX(0px) rotate(0deg); 
        opacity: 0.7;
      }
      25% { 
        transform: translateY(-30px) translateX(20px) rotate(90deg); 
        opacity: 1;
      }
      50% { 
        transform: translateY(-60px) translateX(-10px) rotate(180deg); 
        opacity: 0.5;
      }
      75% { 
        transform: translateY(-30px) translateX(-30px) rotate(270deg); 
        opacity: 1;
      }
    }
    
    .login-wrapper {
      max-width: 1000px;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 60px;
      align-items: center;
      z-index: 1;
      position: relative;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(30px);
      border-radius: 32px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
      }
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: shimmer 3s ease-in-out infinite;
      }
    }
    
    @keyframes shimmer {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(180deg); }
    }
    
    .logo-section {
      position: relative;
      z-index: 1;
      
      .logo-icon-wrapper {
        display: inline-block;
        padding: 20px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 24px;
        margin-bottom: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      
      .logo-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: white;
      }
      
      h1 {
        margin: 0 0 8px 0;
        font-size: 2.2rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      
      .tagline {
        margin: 0;
        font-size: 1rem;
        opacity: 0.9;
        font-weight: 300;
        letter-spacing: 0.5px;
      }
    }
    
    .card-content {
      padding: 50px 40px 40px;
    }
    
    .form-header {
      text-align: center;
      margin-bottom: 40px;
      
      h2 {
        margin: 0 0 12px 0;
        font-size: 1.8rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      p {
        margin: 0;
        color: #6c757d;
        font-size: 1rem;
        font-weight: 400;
      }
    }
    
    .login-form {
      .form-group {
        margin-bottom: 24px;
      }
      
      .modern-field {
        width: 100%;
        
        ::ng-deep {
          .mat-mdc-form-field-focus-overlay {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            opacity: 0.1;
          }
          
          .mat-mdc-text-field-wrapper {
            border-radius: 16px;
            
            &.mdc-text-field--focused {
              .mat-mdc-form-field-focus-overlay {
                opacity: 0.1;
              }
            }
          }
          
          .mat-mdc-form-field-label {
            font-weight: 500;
          }
          
          .mdc-text-field--focused .mdc-floating-label {
            color: #667eea;
          }
          
          .mdc-line-ripple::after {
            border-bottom-color: #667eea;
          }
        }
        
        .field-icon {
          color: #94a3b8;
          transition: color 0.3s ease;
        }
        
        &:focus-within .field-icon {
          color: #667eea;
        }
      }
      
      .password-toggle {
        color: #94a3b8;
        transition: color 0.3s ease;
        
        &:hover {
          color: #667eea;
        }
      }
    }
    
    .form-actions {
      margin-top: 32px;
    }
    
    .login-button {
      width: 100%;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-size: 16px;
      font-weight: 600;
      text-transform: none;
      letter-spacing: 0.5px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
      }
      
      &:hover:not([disabled]) {
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
        
        &::before {
          left: 100%;
        }
      }
      
      &:disabled {
        background: #e9ecef;
        color: #6c757d;
        cursor: not-allowed;
        transform: none;
      }
      
      .button-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
    
    .card-footer {
      padding: 20px 40px 40px;
      text-align: center;
      background: rgba(248, 250, 252, 0.8);
    }
    
    .footer-links {
      p {
        margin: 0 0 16px 0;
        color: #6c757d;
        font-size: 15px;
      }
      
      .register-link {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        
        &:hover {
          text-decoration: underline;
        }
      }
      
      .forgot-password {
        color: #94a3b8;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 0.3s ease;
        
        &:hover {
          color: #667eea;
          text-decoration: underline;
        }
      }
    }
    
    .features-section {
      color: white;
      
      h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 30px 0;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }
      
      .features-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          
          &:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateX(8px);
          }
          
          mat-icon {
            font-size: 24px;
            color: white;
            padding: 12px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
          }
          
          span {
            font-size: 16px;
            font-weight: 500;
            color: white;
          }
        }
      }
    }
    
    @media (max-width: 1024px) {
      .login-wrapper {
        grid-template-columns: 1fr;
        max-width: 500px;
        gap: 40px;
      }
      
      .features-section {
        h3 {
          text-align: center;
        }
        
        .features-list {
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          
          .feature-item {
            flex: 1;
            min-width: 200px;
          }
        }
      }
    }
    
    @media (max-width: 768px) {
      .login-container {
        padding: 16px;
      }
      
      .login-wrapper {
        gap: 30px;
      }
      
      .card-header {
        padding: 30px 20px;
        
        .logo-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
        }
        
        h1 {
          font-size: 1.8rem;
        }
      }
      
      .card-content {
        padding: 40px 20px 30px;
      }
      
      .card-footer {
        padding: 20px;
      }
      
      .features-section {
        .features-list {
          flex-direction: column;
        }
      }
    }
    
    @media (max-width: 480px) {
      .login-wrapper {
        max-width: 100%;
      }
      
      .card-content {
        padding: 30px 16px 20px;
      }
      
      .form-header h2 {
        font-size: 1.5rem;
      }
      
      .login-button {
        height: 48px;
        font-size: 14px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData: LoginRequest = this.loginForm.value;
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Login failed. Please check your credentials and try again.',
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
