import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatGridListModule
  ],
  templateUrl:'./dashboard.component.html' ,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  
  stats = {
    completedCourses: 12,
    assessmentsPassed: 8,
    cvsCreated: 3,
    aiChats: 25
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
