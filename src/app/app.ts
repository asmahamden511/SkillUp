import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { User } from './models/interfaces';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="app-container">
      <!-- Top Navigation Bar -->
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button (click)="sidenav.toggle()" *ngIf="isAuthenticated$ | async">
          <mat-icon>menu</mat-icon>
        </button>
        
        <span class="logo">SkillUp Platform</span>
        
        <span class="spacer"></span>
        
        <!-- User Menu -->
        <div *ngIf="currentUser$ | async as user; else loginButton">
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
            {{ user.name }}
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="navigateTo('/profile')">
              <mat-icon>person</mat-icon>
              Profile
            </button>
            <button mat-menu-item (click)="navigateTo('/settings')">
              <mat-icon>settings</mat-icon>
              Settings
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </div>
        
        <ng-template #loginButton>
          <button mat-button (click)="navigateTo('/login')">
            <mat-icon>login</mat-icon>
            Login
          </button>
        </ng-template>
      </mat-toolbar>

      <div class="app-content">
        <!-- Side Navigation -->
        <mat-sidenav-container class="sidenav-container" *ngIf="isAuthenticated$ | async">
          <mat-sidenav #sidenav mode="side" opened class="sidenav">
            <mat-nav-list>
              <a mat-list-item (click)="navigateTo('/dashboard')">
                <mat-icon matListItemIcon>dashboard</mat-icon>
                Dashboard
              </a>
              
              <a mat-list-item (click)="navigateTo('/ai-chat')">
                <mat-icon matListItemIcon>smart_toy</mat-icon>
                AI Assistant
              </a>
              
              <a mat-list-item (click)="navigateTo('/learning-paths')">
                <mat-icon matListItemIcon>school</mat-icon>
                Learning Paths
              </a>
              
              <a mat-list-item (click)="navigateTo('/cv-builder')">
                <mat-icon matListItemIcon>description</mat-icon>
                CV Builder
              </a>
              
              <a mat-list-item (click)="navigateTo('/interview-prep')">
                <mat-icon matListItemIcon>psychology</mat-icon>
                Interview Prep
              </a>
              
              <a mat-list-item (click)="navigateTo('/file-manager')">
                <mat-icon matListItemIcon>folder</mat-icon>
                File Manager
              </a>
              
              <a mat-list-item (click)="navigateTo('/assessments')">
                <mat-icon matListItemIcon>quiz</mat-icon>
                Assessments
              </a>
              
              <a mat-list-item (click)="navigateTo('/resources')">
                <mat-icon matListItemIcon>library_books</mat-icon>
                Resources
              </a>
            </mat-nav-list>
          </mat-sidenav>
          
          <mat-sidenav-content class="main-content">
            <router-outlet></router-outlet>
          </mat-sidenav-content>
        </mat-sidenav-container>
        
        <!-- Main content when not authenticated -->
        <div class="main-content" *ngIf="!(isAuthenticated$ | async)">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.currentUser$.pipe(
      map(user => !!user)
    );
  }

  ngOnInit() {
    // Check if user is already logged in
    const user = this.authService.getCurrentUser();
    if (user && this.authService.isAuthenticated()) {
      this.authService['currentUserSubject'].next(user);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
