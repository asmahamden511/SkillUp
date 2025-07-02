import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { InterviewService } from '../services/interview.service';
import { InterviewQuestion } from '../models/interfaces';

@Component({
  selector: 'app-interview-prep',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule
  ],
  template: `
    <div class="interview-prep-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>Interview Preparation</mat-card-title>
          <mat-card-subtitle>Practice interview questions and improve your skills</mat-card-subtitle>
        </mat-card-header>
      </mat-card>

      <mat-tab-group class="prep-tabs" (selectedTabChange)="onTabChange($event)">
        <!-- Question Practice Tab -->
        <mat-tab label="Question Practice">
          <div class="tab-content">
            <div class="filters-section">
              <mat-card>
                <mat-card-content>
                  <div class="filters-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Category</mat-label>
                      <mat-select [formControl]="categoryFilter" multiple>
                        <mat-option *ngFor="let category of categories" [value]="category">
                          {{category}}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Difficulty</mat-label>
                      <mat-select [formControl]="difficultyFilter" multiple>
                        <mat-option value="Easy">Easy</mat-option>
                        <mat-option value="Medium">Medium</mat-option>
                        <mat-option value="Hard">Hard</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <button mat-raised-button color="primary" (click)="loadQuestions()" [disabled]="loadingQuestions">
                      <mat-spinner diameter="20" *ngIf="loadingQuestions"></mat-spinner>
                      <mat-icon *ngIf="!loadingQuestions">search</mat-icon>
                      {{loadingQuestions ? 'Loading...' : 'Find Questions'}}
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="questions-section" *ngIf="questions.length > 0">
              <div class="questions-header">
                <h3>Interview Questions</h3>
                <div class="question-counter">
                  <mat-chip-set>
                    <mat-chip [class.answered]="answeredQuestions.has(question.id)" 
                             *ngFor="let question of questions; let i = index"
                             (click)="selectQuestion(i)">
                      {{i + 1}}
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </div>

              <mat-card class="current-question-card" *ngIf="currentQuestion">
                <mat-card-header>
                  <mat-card-title>
                    Question {{currentQuestionIndex + 1}} of {{questions.length}}
                    <mat-chip [ngClass]="'difficulty-' + currentQuestion.difficulty.toLowerCase()">
                      {{currentQuestion.difficulty}}
                    </mat-chip>
                  </mat-card-title>
                  <mat-card-subtitle>{{currentQuestion.category}}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="question-text">
                    <h4>{{currentQuestion.question}}</h4>
                  </div>

                  <div class="answer-section">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Your Answer</mat-label>
                      <textarea matInput 
                               rows="6" 
                               [(ngModel)]="userAnswer" 
                               placeholder="Type your answer here..."></textarea>
                    </mat-form-field>

                    <div class="answer-actions">
                      <button mat-raised-button color="accent" (click)="saveAnswer()" [disabled]="!userAnswer.trim()">
                        <mat-icon>save</mat-icon>
                        Save Answer
                      </button>
                      <button mat-button (click)="showSampleAnswer = !showSampleAnswer" 
                              *ngIf="currentQuestion.sampleAnswer">
                        <mat-icon>{{showSampleAnswer ? 'visibility_off' : 'visibility'}}</mat-icon>
                        {{showSampleAnswer ? 'Hide' : 'Show'}} Sample Answer
                      </button>
                    </div>

                    <mat-expansion-panel [expanded]="showSampleAnswer" *ngIf="currentQuestion.sampleAnswer">
                      <mat-expansion-panel-header>
                        <mat-panel-title>Sample Answer</mat-panel-title>
                      </mat-expansion-panel-header>
                      <div class="sample-answer">
                        <p>{{currentQuestion.sampleAnswer}}</p>
                        <div class="tips" *ngIf="currentQuestion.tips">
                          <h5>Tips:</h5>
                          <p>{{currentQuestion.tips}}</p>
                        </div>
                      </div>
                    </mat-expansion-panel>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button (click)="previousQuestion()" [disabled]="currentQuestionIndex === 0">
                    <mat-icon>navigate_before</mat-icon>
                    Previous
                  </button>
                  <button mat-button (click)="nextQuestion()" [disabled]="currentQuestionIndex === questions.length - 1">
                    Next
                    <mat-icon>navigate_next</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>

            <div class="empty-state" *ngIf="questions.length === 0 && !loadingQuestions">
              <mat-card>
                <mat-card-content>
                  <div class="empty-content">
                    <mat-icon class="empty-icon">quiz</mat-icon>
                    <h3>Ready to Practice?</h3>
                    <p>Select categories and difficulty levels to get started with interview questions.</p>
                    <button mat-raised-button color="primary" (click)="loadAllQuestions()">
                      <mat-icon>play_arrow</mat-icon>
                      Start Practice Session
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Mock Interview Tab -->
        <mat-tab label="Mock Interview">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>AI Mock Interview</mat-card-title>
                <mat-card-subtitle>Practice with our AI interviewer</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="mock-interview-setup" *ngIf="!mockInterviewActive">
                  <div class="setup-form">
                    <mat-form-field appearance="outline">
                      <mat-label>Interview Type</mat-label>
                      <mat-select [(value)]="mockInterviewType">
                        <mat-option value="technical">Technical Interview</mat-option>
                        <mat-option value="behavioral">Behavioral Interview</mat-option>
                        <mat-option value="general">General Interview</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Duration (minutes)</mat-label>
                      <mat-select [(value)]="mockInterviewDuration">
                        <mat-option value="15">15 minutes</mat-option>
                        <mat-option value="30">30 minutes</mat-option>
                        <mat-option value="45">45 minutes</mat-option>
                        <mat-option value="60">60 minutes</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Job Position</mat-label>
                      <input matInput [(ngModel)]="jobPosition" placeholder="e.g., Frontend Developer, Data Scientist">
                    </mat-form-field>
                  </div>

                  <div class="setup-actions">
                    <button mat-raised-button color="primary" (click)="startMockInterview()" [disabled]="!jobPosition">
                      <mat-icon>play_circle_filled</mat-icon>
                      Start Mock Interview
                    </button>
                  </div>
                </div>

                <div class="mock-interview-session" *ngIf="mockInterviewActive">
                  <div class="interview-header">
                    <div class="interview-info">
                      <h4>{{mockInterviewType | titlecase}} Interview - {{jobPosition}}</h4>
                      <div class="timer" *ngIf="interviewTimer">
                        <mat-icon>timer</mat-icon>
                        <span>{{formatTime(interviewTimer)}}</span>
                      </div>
                    </div>
                    <button mat-button color="warn" (click)="endMockInterview()">
                      <mat-icon>stop</mat-icon>
                      End Interview
                    </button>
                  </div>

                  <div class="interview-conversation">
                    <div class="message interviewer-message" *ngFor="let message of mockConversation">
                      <div class="message-header">
                        <mat-icon>{{message.isFromUser ? 'person' : 'smart_toy'}}</mat-icon>
                        <span>{{message.isFromUser ? 'You' : 'AI Interviewer'}}</span>
                        <span class="timestamp">{{message.timestamp | date:'short'}}</span>
                      </div>
                      <div class="message-content">{{message.content}}</div>
                    </div>
                  </div>

                  <div class="interview-input">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Your response</mat-label>
                      <textarea matInput 
                               rows="3" 
                               [(ngModel)]="currentResponse" 
                               (keyup.enter)="sendResponse()"
                               placeholder="Type your response here..."></textarea>
                    </mat-form-field>
                    <button mat-raised-button color="primary" (click)="sendResponse()" [disabled]="!currentResponse.trim()">
                      <mat-icon>send</mat-icon>
                      Send
                    </button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Progress & Analytics Tab -->
        <mat-tab label="Progress">
          <div class="tab-content">
            <div class="progress-stats">
              <div class="stats-grid">
                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-content">
                      <mat-icon class="stat-icon">quiz</mat-icon>
                      <div class="stat-info">
                        <h3>{{totalQuestionsAnswered}}</h3>
                        <p>Questions Answered</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-content">
                      <mat-icon class="stat-icon">video_call</mat-icon>
                      <div class="stat-info">
                        <h3>{{mockInterviewsCompleted}}</h3>
                        <p>Mock Interviews</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-content">
                      <mat-icon class="stat-icon">trending_up</mat-icon>
                      <div class="stat-info">
                        <h3>{{averageScore}}%</h3>
                        <p>Average Score</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <mat-card class="stat-card">
                  <mat-card-content>
                    <div class="stat-content">
                      <mat-icon class="stat-icon">schedule</mat-icon>
                      <div class="stat-info">
                        <h3>{{totalPracticeTime}}h</h3>
                        <p>Practice Time</p>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>

            <mat-card class="recent-activity">
              <mat-card-header>
                <mat-card-title>Recent Activity</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="activity-list">
                  <div class="activity-item" *ngFor="let activity of recentActivity">
                    <mat-icon [class]="'activity-icon ' + activity.type">{{activity.icon}}</mat-icon>
                    <div class="activity-info">
                      <h4>{{activity.title}}</h4>
                      <p>{{activity.description}}</p>
                      <span class="activity-date">{{activity.date | date:'medium'}}</span>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styleUrls: ['./interview-prep.component.scss']
})
export class InterviewPrepComponent implements OnInit, OnDestroy {
  // Form controls
  categoryFilter = new FormControl([]);
  difficultyFilter = new FormControl([]);

  // Data
  categories: string[] = [
    'Technical', 'Behavioral', 'Problem Solving', 'System Design',
    'Programming', 'Database', 'Algorithms', 'Leadership', 'Communication'
  ];
  
  questions: InterviewQuestion[] = [];
  currentQuestion: InterviewQuestion | null = null;
  currentQuestionIndex = 0;
  userAnswer = '';
  answeredQuestions = new Set<number>();
  showSampleAnswer = false;

  // Mock interview
  mockInterviewActive = false;
  mockInterviewType = 'technical';
  mockInterviewDuration = 30;
  jobPosition = '';
  mockConversation: any[] = [];
  currentResponse = '';
  interviewTimer = 0;
  private timerInterval: any;

  // Progress data
  totalQuestionsAnswered = 0;
  mockInterviewsCompleted = 0;
  averageScore = 0;
  totalPracticeTime = 0;
  recentActivity: any[] = [];

  // Loading states
  loadingQuestions = false;

  constructor(
    private interviewService: InterviewService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProgress();
    this.loadRecentActivity();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onTabChange(event: any): void {
    const tabIndex = event.index;
    if (tabIndex === 2) { // Progress tab
      this.loadProgress();
    }
  }

  async loadQuestions(): Promise<void> {
    this.loadingQuestions = true;
    try {
      const categories = this.categoryFilter.value || [];
      const difficulties = this.difficultyFilter.value || [];
      
      this.questions = await this.interviewService.getQuestions(categories, difficulties).toPromise() || [];
      if (this.questions.length > 0) {
        this.currentQuestion = this.questions[0];
        this.currentQuestionIndex = 0;
      }
      this.userAnswer = '';
      this.showSampleAnswer = false;
    } catch (error) {
      console.error('Error loading questions:', error);
      this.snackBar.open('Error loading questions. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.loadingQuestions = false;
    }
  }

  async loadAllQuestions(): Promise<void> {
    this.categoryFilter.setValue([]);
    this.difficultyFilter.setValue([]);
    await this.loadQuestions();
  }

  selectQuestion(index: number): void {
    this.currentQuestionIndex = index;
    this.currentQuestion = this.questions[index];
    this.userAnswer = '';
    this.showSampleAnswer = false;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.selectQuestion(this.currentQuestionIndex + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.selectQuestion(this.currentQuestionIndex - 1);
    }
  }

  saveAnswer(): void {
    if (this.currentQuestion && this.userAnswer.trim()) {
      this.answeredQuestions.add(this.currentQuestion.id);
      // Save to backend
      this.interviewService.saveAnswer(this.currentQuestion.id, this.userAnswer).subscribe({
        next: () => {
          this.snackBar.open('Answer saved successfully!', 'Close', { duration: 2000 });
          this.totalQuestionsAnswered++;
        },
        error: (error) => {
          console.error('Error saving answer:', error);
          this.snackBar.open('Error saving answer. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  startMockInterview(): void {
    this.mockInterviewActive = true;
    this.mockConversation = [];
    this.interviewTimer = this.mockInterviewDuration * 60; // Convert to seconds
    
    // Start timer
    this.timerInterval = setInterval(() => {
      this.interviewTimer--;
      if (this.interviewTimer <= 0) {
        this.endMockInterview();
      }
    }, 1000);

    // Initial AI greeting
    const greeting = `Hello! I'm your AI interviewer for this ${this.mockInterviewType} interview for the ${this.jobPosition} position. Let's begin. Can you tell me about yourself and why you're interested in this role?`;
    
    this.mockConversation.push({
      content: greeting,
      isFromUser: false,
      timestamp: new Date()
    });
  }

  sendResponse(): void {
    if (this.currentResponse.trim()) {
      this.mockConversation.push({
        content: this.currentResponse,
        isFromUser: true,
        timestamp: new Date()
      });

      // Simulate AI response (in real app, this would call AI service)
      this.generateAIResponse(this.currentResponse);
      this.currentResponse = '';
    }
  }

  private generateAIResponse(userResponse: string): void {
    // Simulate AI processing time
    setTimeout(() => {
      const responses = [
        "That's interesting. Can you give me a specific example of when you demonstrated that skill?",
        "How would you handle a situation where you disagreed with your team lead?",
        "What do you consider your greatest professional achievement and why?",
        "How do you stay updated with the latest technologies in your field?",
        "Can you walk me through your problem-solving process?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      this.mockConversation.push({
        content: randomResponse,
        isFromUser: false,
        timestamp: new Date()
      });
    }, 1000);
  }

  endMockInterview(): void {
    this.mockInterviewActive = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.mockInterviewsCompleted++;
    
    this.snackBar.open('Mock interview completed! Great job!', 'Close', { duration: 3000 });
    
    // Save interview session
    this.interviewService.saveMockInterview({
      type: this.mockInterviewType,
      position: this.jobPosition,
      duration: this.mockInterviewDuration,
      conversation: this.mockConversation
    }).subscribe();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private loadProgress(): void {
    this.interviewService.getProgress().subscribe({
      next: (progress) => {
        this.totalQuestionsAnswered = progress.totalQuestionsAnswered || 0;
        this.mockInterviewsCompleted = progress.mockInterviewsCompleted || 0;
        this.averageScore = progress.averageScore || 0;
        this.totalPracticeTime = progress.totalPracticeTime || 0;
      },
      error: (error) => {
        console.error('Error loading progress:', error);
      }
    });
  }

  private loadRecentActivity(): void {
    this.recentActivity = [
      {
        type: 'question',
        icon: 'quiz',
        title: 'Answered Technical Question',
        description: 'Completed a hard-level algorithm question',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        type: 'interview',
        icon: 'video_call',
        title: 'Mock Interview Completed',
        description: 'Finished a 30-minute behavioral interview session',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      },
      {
        type: 'achievement',
        icon: 'star',
        title: 'Achievement Unlocked',
        description: 'Answered 50 questions milestone reached',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
      }
    ];
  }
}
