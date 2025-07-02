import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../models/interfaces';

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
  template: `
    <div class="dashboard-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1>Welcome back, {{ currentUser?.name }}!</h1>
            <p>Transform your career with AI-powered learning and skill development</p>
            <div class="hero-stats">
              <div class="hero-stat">
                <span class="number">{{ stats.completedCourses }}</span>
                <span class="label">Courses Completed</span>
              </div>
              <div class="hero-stat">
                <span class="number">{{ stats.assessmentsPassed }}</span>
                <span class="label">Skills Mastered</span>
              </div>
              <div class="hero-stat">
                <span class="number">{{ (stats.completedCourses / 20 * 100) | number:'1.0-0' }}%</span>
                <span class="label">Career Progress</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="floating-cards">
              <div class="floating-card card-1">
                <mat-icon>code</mat-icon>
                <span>Programming</span>
              </div>
              <div class="floating-card card-2">
                <mat-icon>design_services</mat-icon>
                <span>Design</span>
              </div>
              <div class="floating-card card-3">
                <mat-icon>analytics</mat-icon>
                <span>Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-header">
            <mat-icon>school</mat-icon>
            <span class="stat-trend">+12%</span>
          </div>
          <div class="stat-body">
            <h3>{{ stats.completedCourses }}</h3>
            <p>Completed Courses</p>
            <div class="stat-progress">
              <mat-progress-bar mode="determinate" value="75"></mat-progress-bar>
            </div>
          </div>
        </div>

        <div class="stat-card secondary">
          <div class="stat-header">
            <mat-icon>quiz</mat-icon>
            <span class="stat-trend">+8%</span>
          </div>
          <div class="stat-body">
            <h3>{{ stats.assessmentsPassed }}</h3>
            <p>Assessments Passed</p>
            <div class="stat-progress">
              <mat-progress-bar mode="determinate" value="60"></mat-progress-bar>
            </div>
          </div>
        </div>

        <div class="stat-card accent">
          <div class="stat-header">
            <mat-icon>description</mat-icon>
            <span class="stat-trend">+5</span>
          </div>
          <div class="stat-body">
            <h3>{{ stats.cvsCreated }}</h3>
            <p>CVs Created</p>
            <div class="stat-progress">
              <mat-progress-bar mode="determinate" value="40"></mat-progress-bar>
            </div>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-header">
            <mat-icon>smart_toy</mat-icon>
            <span class="stat-trend">+25</span>
          </div>
          <div class="stat-body">
            <h3>{{ stats.aiChats }}</h3>
            <p>AI Sessions</p>
            <div class="stat-progress">
              <mat-progress-bar mode="determinate" value="85"></mat-progress-bar>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions with Enhanced Design -->
      <div class="quick-actions-section">
        <div class="section-header">
          <h2>Power Tools</h2>
          <p>Accelerate your professional growth with AI-powered features</p>
        </div>
        
        <div class="actions-grid">
          <div class="action-card ai-card" (click)="navigateTo('/ai-chat')">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>psychology</mat-icon>
              </div>
              <h3>AI Career Advisor</h3>
              <p>Get personalized career guidance and skill recommendations from our advanced AI</p>
              <div class="card-features">
                <span class="feature">• Personalized Learning</span>
                <span class="feature">• Career Roadmaps</span>
                <span class="feature">• 24/7 Support</span>
              </div>
              <button mat-button class="card-button">Start Session</button>
            </div>
          </div>

          <div class="action-card cv-card" (click)="navigateTo('/cv-builder')">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>article</mat-icon>
              </div>
              <h3>Smart CV Builder</h3>
              <p>Create professional resumes with AI-powered content suggestions and industry templates</p>
              <div class="card-features">
                <span class="feature">• ATS Optimization</span>
                <span class="feature">• Industry Templates</span>
                <span class="feature">• AI Content</span>
              </div>
              <button mat-button class="card-button">Build CV</button>
            </div>
          </div>

          <div class="action-card interview-card" (click)="navigateTo('/interview-prep')">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>record_voice_over</mat-icon>
              </div>
              <h3>Interview Simulator</h3>
              <p>Practice with AI-powered mock interviews and get real-time feedback</p>
              <div class="card-features">
                <span class="feature">• Real-time Feedback</span>
                <span class="feature">• Industry Specific</span>
                <span class="feature">• Performance Analytics</span>
              </div>
              <button mat-button class="card-button">Start Practice</button>
            </div>
          </div>

          <div class="action-card learning-card" (click)="navigateTo('/learning-paths')">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>timeline</mat-icon>
              </div>
              <h3>Learning Pathways</h3>
              <p>Follow curated learning paths designed by industry experts and AI algorithms</p>
              <div class="card-features">
                <span class="feature">• Expert Curated</span>
                <span class="feature">• Adaptive Learning</span>
                <span class="feature">• Progress Tracking</span>
              </div>
              <button mat-button class="card-button">Explore Paths</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Progress with Advanced Visualization -->
      <div class="skills-section">
        <div class="section-header">
          <h2>Skill Mastery Dashboard</h2>
          <p>Track your progress across different skill domains</p>
        </div>
        
        <div class="skills-grid">
          <div class="skill-card">
            <div class="skill-header">
              <div class="skill-icon programming">
                <mat-icon>code</mat-icon>
              </div>
              <div class="skill-info">
                <h4>Programming Skills</h4>
                <span class="skill-level">Advanced</span>
              </div>
              <div class="skill-score">75%</div>
            </div>
            <div class="skill-progress">
              <mat-progress-bar mode="determinate" value="75"></mat-progress-bar>
            </div>
            <div class="skill-tags">
              <span class="tag">JavaScript</span>
              <span class="tag">Python</span>
              <span class="tag">Angular</span>
            </div>
          </div>

          <div class="skill-card">
            <div class="skill-header">
              <div class="skill-icon design">
                <mat-icon>palette</mat-icon>
              </div>
              <div class="skill-info">
                <h4>Design Skills</h4>
                <span class="skill-level">Intermediate</span>
              </div>
              <div class="skill-score">60%</div>
            </div>
            <div class="skill-progress">
              <mat-progress-bar mode="determinate" value="60"></mat-progress-bar>
            </div>
            <div class="skill-tags">
              <span class="tag">UI/UX</span>
              <span class="tag">Figma</span>
              <span class="tag">Adobe XD</span>
            </div>
          </div>

          <div class="skill-card">
            <div class="skill-header">
              <div class="skill-icon management">
                <mat-icon>groups</mat-icon>
              </div>
              <div class="skill-info">
                <h4>Project Management</h4>
                <span class="skill-level">Beginner</span>
              </div>
              <div class="skill-score">40%</div>
            </div>
            <div class="skill-progress">
              <mat-progress-bar mode="determinate" value="40"></mat-progress-bar>
            </div>
            <div class="skill-tags">
              <span class="tag">Agile</span>
              <span class="tag">Scrum</span>
              <span class="tag">Leadership</span>
            </div>
          </div>

          <div class="skill-card">
            <div class="skill-header">
              <div class="skill-icon communication">
                <mat-icon>forum</mat-icon>
              </div>
              <div class="skill-info">
                <h4>Communication</h4>
                <span class="skill-level">Expert</span>
              </div>
              <div class="skill-score">85%</div>
            </div>
            <div class="skill-progress">
              <mat-progress-bar mode="determinate" value="85"></mat-progress-bar>
            </div>
            <div class="skill-tags">
              <span class="tag">Presentation</span>
              <span class="tag">Writing</span>
              <span class="tag">Negotiation</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Feed -->
      <div class="activity-section">
        <div class="section-header">
          <h2>Recent Activity</h2>
          <p>Your latest achievements and learning milestones</p>
        </div>
        
        <div class="activity-feed">
          <div class="activity-item completed">
            <div class="activity-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="activity-content">
              <h4>Completed Advanced Angular Course</h4>
              <p>You've mastered reactive forms and advanced component patterns</p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>

          <div class="activity-item achievement">
            <div class="activity-icon">
              <mat-icon>emoji_events</mat-icon>
            </div>
            <div class="activity-content">
              <h4>Achievement Unlocked: Code Master</h4>
              <p>Completed 10 programming challenges in a row</p>
              <span class="activity-time">1 day ago</span>
            </div>
          </div>

          <div class="activity-item progress">
            <div class="activity-icon">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="activity-content">
              <h4>Skills Assessment Improved</h4>
              <p>Your JavaScript proficiency increased from 70% to 75%</p>
              <span class="activity-time">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      // min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow-x: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
      }
    }

    /* Hero Section */
    .hero-section {
      padding: 40px 24px 60px;
      position: relative;
      z-index: 1;
    }

    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      min-height: 400px;
    }

    .hero-text {
      h1 {
        font-size: 3.5rem;
        font-weight: 800;
        color: white;
        margin: 0 0 20px 0;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        line-height: 1.1;
        letter-spacing: -0.02em;
      }
      
      p {
        font-size: 1.3rem;
        color: rgba(255,255,255,0.9);
        margin: 0 0 40px 0;
        line-height: 1.6;
        font-weight: 300;
      }
    }

    .hero-stats {
      display: flex;
      gap: 40px;
      
      .hero-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .number {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .label {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 8px;
        }
      }
    }

    .hero-visual {
      position: relative;
      height: 400px;
    }

    .floating-cards {
      position: relative;
      height: 100%;
      
      .floating-card {
        position: absolute;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        transition: all 0.3s ease;
        
        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        span {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }
        
        &.card-1 {
          top: 20%;
          left: 10%;
          animation: float 6s ease-in-out infinite;
        }
        
        &.card-2 {
          top: 10%;
          right: 20%;
          animation: float 6s ease-in-out infinite 2s;
        }
        
        &.card-3 {
          bottom: 20%;
          right: 10%;
          animation: float 6s ease-in-out infinite 4s;
        }
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }

    /* Stats Grid */
    .stats-grid {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px 60px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .stat-card {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 32px;
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
      }
      
      &.primary {
        --card-color: #667eea;
        --card-color-light: #764ba2;
      }
      
      &.secondary {
        --card-color: #f093fb;
        --card-color-light: #f5576c;
      }
      
      &.accent {
        --card-color: #4facfe;
        --card-color-light: #00f2fe;
      }
      
      &.success {
        --card-color: #43e97b;
        --card-color-light: #38f9d7;
      }
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 25px 50px rgba(0,0,0,0.15);
      }
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      
      mat-icon {
        font-size: 28px;
        color: var(--card-color);
        padding: 12px;
        background: rgba(var(--card-color), 0.1);
        border-radius: 12px;
      }
      
      .stat-trend {
        background: linear-gradient(135deg, var(--card-color), var(--card-color-light));
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }
    }

    .stat-body {
      h3 {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0 0 8px 0;
        background: linear-gradient(135deg, var(--card-color), var(--card-color-light));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      p {
        color: #6c757d;
        margin: 0 0 16px 0;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 13px;
      }
    }

    .stat-progress {
      mat-progress-bar {
        height: 6px;
        border-radius: 3px;
        
        ::ng-deep .mat-mdc-progress-bar-fill::after {
          background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
        }
      }
    }

    /* Section Headers */
    .section-header {
      text-align: center;
      margin-bottom: 50px;
      
      h2 {
        font-size: 2.5rem;
        font-weight: 700;
        color: white;
        margin: 0 0 16px 0;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      
      p {
        font-size: 1.1rem;
        color: rgba(255,255,255,0.8);
        margin: 0;
        font-weight: 300;
      }
    }

    /* Quick Actions */
    .quick-actions-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px 80px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }

    .action-card {
      position: relative;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      padding: 40px;
      border: 1px solid rgba(255,255,255,0.2);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      overflow: hidden;
      
      &:hover {
        transform: translateY(-12px) scale(1.02);
        box-shadow: 0 30px 60px rgba(0,0,0,0.2);
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--card-gradient);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover::before {
        opacity: 0.05;
      }
      
      &.ai-card {
        --card-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      &.cv-card {
        --card-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      
      &.interview-card {
        --card-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      
      &.learning-card {
        --card-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .card-content {
      position: relative;
      z-index: 1;
    }

    .card-icon {
      margin-bottom: 24px;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        padding: 20px;
        border-radius: 20px;
        background: var(--card-gradient);
        color: white;
      }
    }

    .card-content h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: #333;
    }

    .card-content p {
      color: #6c757d;
      line-height: 1.6;
      margin: 0 0 24px 0;
      font-size: 15px;
    }

    .card-features {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 24px;
      
      .feature {
        font-size: 13px;
        color: #495057;
        font-weight: 500;
      }
    }

    .card-button {
      background: var(--card-gradient);
      color: white;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      }
    }

    /* Skills Section */
    .skills-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px 80px;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .skill-card {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 32px;
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      }
    }

    .skill-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      
      .skill-icon {
        padding: 16px;
        border-radius: 16px;
        
        mat-icon {
          font-size: 24px;
          color: white;
        }
        
        &.programming {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        &.design {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        &.management {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        &.communication {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      
      .skill-info {
        flex: 1;
        
        h4 {
          margin: 0 0 4px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }
        
        .skill-level {
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
      }
      
      .skill-score {
        font-size: 1.5rem;
        font-weight: 700;
        color: #667eea;
      }
    }

    .skill-progress {
      margin-bottom: 16px;
      
      mat-progress-bar {
        height: 8px;
        border-radius: 4px;
      }
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tag {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
      }
    }

    /* Activity Section */
    .activity-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px 60px;
    }

    .activity-feed {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .activity-item {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateX(8px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      
      .activity-icon {
        padding: 16px;
        border-radius: 50%;
        
        mat-icon {
          font-size: 24px;
          color: white;
        }
        
        &.completed {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
        
        &.achievement {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        &.progress {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
      }
      
      .activity-content {
        flex: 1;
        
        h4 {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }
        
        p {
          margin: 0 0 8px 0;
          color: #6c757d;
          line-height: 1.5;
        }
        
        .activity-time {
          font-size: 12px;
          color: #999;
          font-weight: 500;
        }
      }
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }
      
      .hero-stats {
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .hero-text h1 {
        font-size: 2.5rem;
      }
      
      .hero-stats {
        flex-direction: column;
        gap: 20px;
      }
      
      .section-header h2 {
        font-size: 2rem;
      }
      
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .skills-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .hero-section,
      .quick-actions-section,
      .skills-section,
      .activity-section {
        padding-left: 16px;
        padding-right: 16px;
      }
      
      .hero-text h1 {
        font-size: 2rem;
      }
      
      .stat-card,
      .action-card,
      .skill-card {
        padding: 20px;
      }
      
      .floating-cards {
        display: none;
      }
    }
  `]
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
