import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LearningPath, Content } from '../models/interfaces';

@Component({
  selector: 'app-learning-paths',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatDialogModule
  ],
  template: `
    <div class="learning-paths-container">
      <!-- Hero Header -->
      <div class="hero-header">
        <div class="hero-content">
          <div class="hero-text">
            <h1>Learning Paths</h1>
            <p>Discover structured learning journeys designed to accelerate your career growth and master in-demand skills</p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">{{ learningPaths.length }}</span>
                <span class="stat-label">Learning Paths</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ enrolledPaths.length }}</span>
                <span class="stat-label">Enrolled</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">95%</span>
                <span class="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="floating-element path-card-mini">
              <mat-icon>trending_up</mat-icon>
              <span>Skill Growth</span>
            </div>
            <div class="floating-element path-card-mini">
              <mat-icon>emoji_events</mat-icon>
              <span>Achievements</span>
            </div>
            <div class="floating-element path-card-mini">
              <mat-icon>groups</mat-icon>
              <span>Community</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <div class="filters-content">
          <div class="search-bar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search learning paths</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Find your perfect learning journey...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="filters-row">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Level</mat-label>
              <mat-select [formControl]="levelFilter" multiple>
                <mat-option value="beginner">
                  <mat-icon>play_circle</mat-icon>
                  Beginner
                </mat-option>
                <mat-option value="intermediate">
                  <mat-icon>school</mat-icon>
                  Intermediate
                </mat-option>
                <mat-option value="advanced">
                  <mat-icon>workspace_premium</mat-icon>
                  Advanced
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Duration</mat-label>
              <mat-select [formControl]="durationFilter">
                <mat-option value="">All Durations</mat-option>
                <mat-option value="short">
                  <mat-icon>schedule</mat-icon>
                  Short (< 10 hours)
                </mat-option>
                <mat-option value="medium">
                  <mat-icon>access_time</mat-icon>
                  Medium (10-30 hours)
                </mat-option>
                <mat-option value="long">
                  <mat-icon>more_time</mat-icon>
                  Long (> 30 hours)
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" class="clear-filters-btn"
                    (click)="clearFilters()">
              <mat-icon>clear_all</mat-icon>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Learning Paths Grid -->
      <div class="paths-section">
        <div class="section-header" *ngIf="filteredPaths.length > 0">
          <h2>Available Learning Paths</h2>
          <p>{{ filteredPaths.length }} paths match your criteria</p>
        </div>

        <div class="paths-grid">
          <div *ngFor="let path of filteredPaths; let i = index" 
               class="path-card-wrapper"
               [style.animation-delay.ms]="i * 100">
            <mat-card class="path-card" [class.enrolled]="isEnrolled(path.id)">
              <div class="path-header">
                <div class="path-image">
                  <img [src]="path.imageUrl || '/assets/images/default-course.jpg'" 
                       [alt]="path.title" *ngIf="path.imageUrl">
                  <div class="image-placeholder" *ngIf="!path.imageUrl">
                    <mat-icon>school</mat-icon>
                  </div>
                  <div class="level-badge" [class]="'level-' + path.level.toLowerCase()">
                    <mat-icon>{{ getLevelIcon(path.level) }}</mat-icon>
                    {{ path.level }}
                  </div>
                </div>
                
                <div class="enrollment-indicator" *ngIf="isEnrolled(path.id)">
                  <mat-icon>check_circle</mat-icon>
                  <span>Enrolled</span>
                </div>
              </div>

              <mat-card-header>
                <mat-card-title>{{ path.title }}</mat-card-title>
                <mat-card-subtitle>
                  <div class="path-meta">
                    <span class="duration">
                      <mat-icon>schedule</mat-icon>
                      {{ path.duration }} hours
                    </span>
                    <span class="modules">
                      <mat-icon>library_books</mat-icon>
                      {{ getContentCount(path.id) }} modules
                    </span>
                  </div>
                </mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <p class="path-description">{{ path.description }}</p>
                
                <div class="prerequisites" *ngIf="path.prerequisites.length > 0">
                  <h5>Prerequisites:</h5>
                  <mat-chip-set>
                    <mat-chip *ngFor="let prereq of path.prerequisites" class="prereq-chip">
                      {{ prereq }}
                    </mat-chip>
                  </mat-chip-set>
                </div>

                <div class="learning-objectives">
                  <h5>What you'll learn:</h5>
                  <ul class="objectives-list">
                    <li *ngFor="let objective of path.learningObjectives.slice(0, 3)">
                      <mat-icon>check</mat-icon>
                      {{ objective }}
                    </li>
                    <li *ngIf="path.learningObjectives.length > 3" class="more-objectives">
                      <mat-icon>add</mat-icon>
                      {{ path.learningObjectives.length - 3 }} more learning objectives
                    </li>
                  </ul>
                </div>

                <div class="progress-section" *ngIf="isEnrolled(path.id)">
                  <div class="progress-header">
                    <span class="progress-label">Your Progress</span>
                    <span class="progress-percentage">{{ getProgress(path.id) }}%</span>
                  </div>
                  <mat-progress-bar mode="determinate" [value]="getProgress(path.id)" class="custom-progress"></mat-progress-bar>
                  <div class="progress-details">
                    <span>{{ getCompletedModules(path.id) }}/{{ getContentCount(path.id) }} modules completed</span>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions align="end">
                <button mat-button class="secondary-btn" (click)="viewPathDetails(path)">
                  <mat-icon>info</mat-icon>
                  Details
                </button>
                
                <button mat-raised-button color="primary" class="primary-btn"
                        *ngIf="!isEnrolled(path.id)"
                        (click)="enrollInPath(path)">
                  <mat-icon>play_circle_filled</mat-icon>
                  Start Learning
                </button>
                
                <button mat-raised-button color="accent" class="continue-btn"
                        *ngIf="isEnrolled(path.id)"
                        (click)="continuePath(path)">
                  <mat-icon>play_arrow</mat-icon>
                  Continue Learning
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
      </div>

      <!-- My Learning Section -->
      <div class="my-learning-section" *ngIf="enrolledPaths.length > 0">
        <div class="section-header">
          <h2>My Learning Journey</h2>
          <p>Continue where you left off and track your progress</p>
        </div>
        
        <div class="enrolled-paths-grid">
          <div *ngFor="let pathId of enrolledPaths; let i = index" 
               class="enrolled-path-wrapper"
               [style.animation-delay.ms]="(i + filteredPaths.length) * 100">
            <mat-card class="enrolled-path-card">
              <div class="enrolled-header">
                <div class="path-title">
                  <mat-icon>school</mat-icon>
                  <h4>{{ getPathTitle(pathId) }}</h4>
                </div>
                <div class="progress-badge">
                  <span>{{ getProgress(pathId) }}%</span>
                </div>
              </div>
              
              <div class="progress-details">
                <div class="modules-info">
                  <span>{{ getCompletedModules(pathId) }}/{{ getContentCount(pathId) }} modules completed</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="getProgress(pathId)" class="enrolled-progress"></mat-progress-bar>
              </div>
              
              <div class="enrolled-actions">
                <button mat-raised-button color="primary" (click)="continuePath(getPathById(pathId))">
                  <mat-icon>play_arrow</mat-icon>
                  Continue Learning
                </button>
              </div>
            </mat-card>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="learningPaths.length === 0">
        <div class="empty-illustration">
          <mat-icon>school</mat-icon>
          <div class="empty-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
        <h3>No Learning Paths Available</h3>
        <p>We're crafting amazing learning experiences for you. Check back soon for structured learning journeys that will accelerate your career growth!</p>
        <button mat-raised-button color="primary" class="explore-btn">
          <mat-icon>explore</mat-icon>
          Explore Other Resources
        </button>
      </div>

      <!-- No Results State -->
      <div class="no-results-state" *ngIf="learningPaths.length > 0 && filteredPaths.length === 0">
        <div class="no-results-illustration">
          <mat-icon>search_off</mat-icon>
        </div>
        <h3>No paths match your criteria</h3>
        <p>Try adjusting your filters or search terms to discover relevant learning paths</p>
        <button mat-raised-button color="primary" (click)="clearFilters()">
          <mat-icon>refresh</mat-icon>
          Clear Filters
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./learning-paths.component.scss']
})
export class LearningPathsComponent implements OnInit {
  searchControl = new FormControl('');
  levelFilter = new FormControl([]);
  durationFilter = new FormControl('');

  learningPaths: LearningPath[] = [];
  filteredPaths: LearningPath[] = [];
  enrolledPaths: number[] = [];
  pathProgress: { [pathId: number]: number } = {};
  pathContents: { [pathId: number]: Content[] } = {};

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLearningPaths();
    this.loadUserProgress();
    this.setupFilters();
  }

  setupFilters(): void {
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.levelFilter.valueChanges.subscribe(() => this.applyFilters());
    this.durationFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  loadLearningPaths(): void {
    // Simulate loading learning paths - replace with actual service call
    this.learningPaths = [
      {
        id: 1,
        title: 'Frontend Development with Angular',
        description: 'Master modern web development with Angular, TypeScript, and best practices',
        level: 'Intermediate',
        duration: 40,
        prerequisites: ['HTML', 'CSS', 'JavaScript'],
        learningObjectives: [
          'Build single-page applications with Angular',
          'Master TypeScript and RxJS',
          'Implement responsive designs with Angular Material',
          'Deploy applications to production'
        ],
        imageUrl: '',
        isActive: true
      },
      {
        id: 2,
        title: 'Full-Stack Development with .NET',
        description: 'Complete backend development using ASP.NET Core and Entity Framework',
        level: 'Advanced',
        duration: 60,
        prerequisites: ['C#', 'OOP Concepts', 'SQL'],
        learningObjectives: [
          'Build RESTful APIs with ASP.NET Core',
          'Implement authentication and authorization',
          'Work with databases using Entity Framework',
          'Deploy to cloud platforms'
        ],
        imageUrl: '',
        isActive: true
      },
      {
        id: 3,
        title: 'AI and Machine Learning Fundamentals',
        description: 'Introduction to AI, ML algorithms, and practical implementations',
        level: 'Beginner',
        duration: 30,
        prerequisites: ['Python', 'Basic Mathematics'],
        learningObjectives: [
          'Understand ML concepts and algorithms',
          'Work with popular ML libraries',
          'Build predictive models',
          'Evaluate model performance'
        ],
        imageUrl: '',
        isActive: true
      },
      {
        id: 4,
        title: 'DevOps and Cloud Computing',
        description: 'Modern DevOps practices, CI/CD, and cloud deployment strategies',
        level: 'Intermediate',
        duration: 35,
        prerequisites: ['Linux basics', 'Git', 'Docker'],
        learningObjectives: [
          'Setup CI/CD pipelines',
          'Deploy applications to cloud',
          'Monitor and scale applications',
          'Implement infrastructure as code'
        ],
        imageUrl: '',
        isActive: true
      }
    ];

    // Simulate content for each path
    this.pathContents = {
      1: Array.from({length: 12}, (_, i) => ({
        id: i + 1,
        title: `Module ${i + 1}`,
        description: `Angular module ${i + 1}`,
        contentType: 'video',
        contentUrl: '',
        duration: 180,
        learningPathId: 1,
        order: i + 1,
        isActive: true
      })),
      2: Array.from({length: 15}, (_, i) => ({
        id: i + 16,
        title: `Module ${i + 1}`,
        description: `.NET module ${i + 1}`,
        contentType: 'video',
        contentUrl: '',
        duration: 240,
        learningPathId: 2,
        order: i + 1,
        isActive: true
      })),
      3: Array.from({length: 10}, (_, i) => ({
        id: i + 31,
        title: `Module ${i + 1}`,
        description: `AI/ML module ${i + 1}`,
        contentType: 'video',
        contentUrl: '',
        duration: 180,
        learningPathId: 3,
        order: i + 1,
        isActive: true
      })),
      4: Array.from({length: 14}, (_, i) => ({
        id: i + 41,
        title: `Module ${i + 1}`,
        description: `DevOps module ${i + 1}`,
        contentType: 'video',
        contentUrl: '',
        duration: 150,
        learningPathId: 4,
        order: i + 1,
        isActive: true
      }))
    };

    this.applyFilters();
  }

  loadUserProgress(): void {
    // Load from localStorage or backend
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.enrolledPaths = progress.enrolledPaths || [];
      this.pathProgress = progress.pathProgress || {};
    }
  }

  applyFilters(): void {
    let filtered = [...this.learningPaths];

    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(path => 
        path.title.toLowerCase().includes(searchTerm) ||
        path.description.toLowerCase().includes(searchTerm) ||
        path.learningObjectives.some(obj => obj.toLowerCase().includes(searchTerm))
      );
    }

    // Level filter
    const levels = this.levelFilter.value as string[] || [];
    if (levels.length > 0) {
      filtered = filtered.filter(path => levels.includes(path.level.toLowerCase()));
    }

    // Duration filter
    const duration = this.durationFilter.value;
    if (duration) {
      filtered = filtered.filter(path => {
        switch (duration) {
          case 'short': return path.duration < 10;
          case 'medium': return path.duration >= 10 && path.duration <= 30;
          case 'long': return path.duration > 30;
          default: return true;
        }
      });
    }

    this.filteredPaths = filtered;
  }

  isEnrolled(pathId: number): boolean {
    return this.enrolledPaths.includes(pathId);
  }

  getProgress(pathId: number): number {
    return this.pathProgress[pathId] || 0;
  }

  getContentCount(pathId: number): number {
    return this.pathContents[pathId]?.length || 0;
  }

  getCompletedModules(pathId: number): number {
    const progress = this.getProgress(pathId);
    const totalModules = this.getContentCount(pathId);
    return Math.round((progress / 100) * totalModules);
  }

  getPathTitle(pathId: number): string {
    const path = this.learningPaths.find(p => p.id === pathId);
    return path?.title || '';
  }

  getPathById(pathId: number): LearningPath | undefined {
    return this.learningPaths.find(p => p.id === pathId);
  }

  enrollInPath(path: LearningPath): void {
    if (!this.isEnrolled(path.id)) {
      this.enrolledPaths.push(path.id);
      this.pathProgress[path.id] = 0;
      this.saveProgress();
      this.snackBar.open(`Enrolled in "${path.title}"!`, 'Close', { duration: 3000 });
    }
  }

  continuePath(path: LearningPath | undefined): void {
    if (path) {
      // Navigate to learning content or open learning interface
      this.snackBar.open(`Continuing "${path.title}"...`, 'Close', { duration: 2000 });
      // In a real app, navigate to the learning content
      // this.router.navigate(['/learn', path.id]);
    }
  }

  viewPathDetails(path: LearningPath): void {
    // Open detailed view or modal
    this.snackBar.open(`Viewing details for "${path.title}"`, 'Close', { duration: 2000 });
    // In a real app, open a detailed modal or navigate to details page
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.levelFilter.setValue([]);
    this.durationFilter.setValue('');
    this.applyFilters();
  }

  getLevelIcon(level: string): string {
    switch (level.toLowerCase()) {
      case 'beginner': return 'play_circle';
      case 'intermediate': return 'school';
      case 'advanced': return 'workspace_premium';
      default: return 'school';
    }
  }

  private saveProgress(): void {
    const progress = {
      enrolledPaths: this.enrolledPaths,
      pathProgress: this.pathProgress
    };
    localStorage.setItem('learningProgress', JSON.stringify(progress));
  }
}
