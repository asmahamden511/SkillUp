import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CvService } from '../services/cv.service';
import { CV, WorkExperience, Education, Skill } from '../models/interfaces';

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="cv-builder-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-icon">
            <mat-icon>description</mat-icon>
          </div>
          <div class="header-text">
            <h1>Professional CV Builder</h1>
            <p>Create a stunning professional CV that stands out from the crowd</p>
          </div>
        </div>
        <div class="progress-indicator">
          <div class="progress-steps">
            <div class="step" [class.active]="currentStep === 0" [class.completed]="currentStep > 0">
              <span>1</span>
              <label>Personal</label>
            </div>
            <div class="step" [class.active]="currentStep === 1" [class.completed]="currentStep > 1">
              <span>2</span>
              <label>Experience</label>
            </div>
            <div class="step" [class.active]="currentStep === 2" [class.completed]="currentStep > 2">
              <span>3</span>
              <label>Education</label>
            </div>
            <div class="step" [class.active]="currentStep === 3" [class.completed]="currentStep > 3">
              <span>4</span>
              <label>Skills</label>
            </div>
            <div class="step" [class.active]="currentStep === 4">
              <span>5</span>
              <label>Generate</label>
            </div>
          </div>
        </div>
      </div>

      <mat-stepper [linear]="true" #stepper class="cv-stepper" orientation="vertical" 
                   (selectionChange)="onStepChange($event)">
        <!-- Personal Information Step -->
        <mat-step [stepControl]="personalInfoForm" label="Personal Information" icon="person">
          <ng-template matStepLabel>Personal Information</ng-template>
          <form [formGroup]="personalInfoForm" class="step-form">
            <div class="step-card">
              <div class="step-header">
                <mat-icon>person</mat-icon>
                <div class="step-title">
                  <h2>Personal Information</h2>
                  <p>Let's start with your basic information</p>
                </div>
              </div>
              
              <div class="form-content">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="modern-field">
                    <mat-label>Full Name</mat-label>
                    <input matInput formControlName="fullName" required placeholder="Enter your full name">
                    <mat-icon matSuffix>person</mat-icon>
                    <mat-error *ngIf="personalInfoForm.get('fullName')?.hasError('required')">
                      Full name is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="modern-field">
                    <mat-label>Email Address</mat-label>
                    <input matInput type="email" formControlName="email" required placeholder="your.email@example.com">
                    <mat-icon matSuffix>email</mat-icon>
                    <mat-error *ngIf="personalInfoForm.get('email')?.hasError('required')">
                      Email is required
                    </mat-error>
                    <mat-error *ngIf="personalInfoForm.get('email')?.hasError('email')">
                      Please enter a valid email address
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="modern-field">
                    <mat-label>Phone Number</mat-label>
                    <input matInput formControlName="phone" required placeholder="+1 (555) 123-4567">
                    <mat-icon matSuffix>phone</mat-icon>
                    <mat-error *ngIf="personalInfoForm.get('phone')?.hasError('required')">
                      Phone number is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="modern-field">
                    <mat-label>Location</mat-label>
                    <input matInput formControlName="location" placeholder="City, Country">
                    <mat-icon matSuffix>location_on</mat-icon>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="modern-field full-width">
                  <mat-label>Professional Summary</mat-label>
                  <textarea matInput rows="4" formControlName="summary" placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."></textarea>
                  <mat-icon matSuffix>description</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="modern-field full-width">
                  <mat-label>LinkedIn Profile</mat-label>
                  <input matInput formControlName="linkedInUrl" placeholder="https://linkedin.com/in/your-profile">
                  <mat-icon matSuffix>link</mat-icon>
                </mat-form-field>
              </div>
            </div>
            
            <div class="step-actions">
              <button mat-fab color="primary" matStepperNext [disabled]="personalInfoForm.invalid" class="next-fab">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Work Experience Step -->
        <mat-step [stepControl]="workExperienceForm" label="Work Experience" icon="work">
          <ng-template matStepLabel>Work Experience</ng-template>
          <form [formGroup]="workExperienceForm" class="step-form">
            <div class="step-card">
              <div class="step-header">
                <mat-icon>work</mat-icon>
                <div class="step-title">
                  <h2>Work Experience</h2>
                  <p>Showcase your professional journey and achievements</p>
                </div>
              </div>
              
              <div class="form-content">
                <div formArrayName="experiences">
                  <div *ngFor="let experience of experiences.controls; let i = index" [formGroupName]="i" class="experience-card">
                    <div class="card-header">
                      <div class="card-title">
                        <mat-icon>work_outline</mat-icon>
                        <span>Experience {{i + 1}}</span>
                      </div>
                      <button mat-icon-button color="warn" (click)="removeExperience(i)" *ngIf="experiences.length > 1" class="delete-btn">
                        <mat-icon>delete_outline</mat-icon>
                      </button>
                    </div>
                    
                    <div class="card-content">
                      <div class="form-row">
                        <mat-form-field appearance="outline" class="modern-field">
                          <mat-label>Job Title</mat-label>
                          <input matInput formControlName="jobTitle" required placeholder="Software Engineer">
                          <mat-icon matSuffix>badge</mat-icon>
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="modern-field">
                          <mat-label>Company</mat-label>
                          <input matInput formControlName="company" required placeholder="Company Name">
                          <mat-icon matSuffix>business</mat-icon>
                        </mat-form-field>
                      </div>

                      <div class="form-row">
                        <mat-form-field appearance="outline" class="modern-field">
                          <mat-label>Start Date</mat-label>
                          <input matInput [matDatepicker]="startPicker" formControlName="startDate" required>
                          <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                          <mat-datepicker #startPicker></mat-datepicker>
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="modern-field">
                          <mat-label>End Date</mat-label>
                          <input matInput [matDatepicker]="endPicker" formControlName="endDate" placeholder="Leave empty if current">
                          <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                          <mat-datepicker #endPicker></mat-datepicker>
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline" class="modern-field full-width">
                        <mat-label>Job Description</mat-label>
                        <textarea matInput rows="4" formControlName="description" placeholder="Describe your key responsibilities, achievements, and impact in this role..."></textarea>
                        <mat-icon matSuffix>notes</mat-icon>
                      </mat-form-field>
                    </div>
                  </div>
                </div>

                <button mat-stroked-button color="primary" (click)="addExperience()" class="add-button">
                  <mat-icon>add</mat-icon>
                  Add Another Experience
                </button>
              </div>
            </div>
            
            <div class="step-actions">
              <button mat-mini-fab matStepperPrevious class="back-fab">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <button mat-fab color="primary" matStepperNext class="next-fab">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Education Step -->
        <mat-step [stepControl]="educationForm" label="Education" icon="school">
          <ng-template matStepLabel>Education</ng-template>
          <form [formGroup]="educationForm" class="step-form">
            <div class="step-card">
              <div class="step-header">
                <mat-icon>school</mat-icon>
                <div class="step-title">
                  <h2>Education Background</h2>
                  <p>Add your academic qualifications and achievements</p>
                </div>
              </div>
              
              <div class="form-content">
                <div formArrayName="educations">
                  <div *ngFor="let education of educations.controls; let i = index" [formGroupName]="i" class="education-card">
                    <div class="card-header">
                      <div class="card-title">
                        <mat-icon>school</mat-icon>
                        <span>Education {{i + 1}}</span>
                      </div>
                      <button mat-icon-button color="warn" (click)="removeEducation(i)" *ngIf="educations.length > 1" class="delete-btn">
                        <mat-icon>delete_outline</mat-icon>
                      </button>
                    </div>
                    
                    <div class="card-content">
                      <div class="form-row">
                        <mat-form-field appearance="outline" class="modern-field">
                          <mat-label>Degree</mat-label>
                          <input matInput formControlName="degree" required placeholder="Bachelor of Science">
                          <mat-icon matSuffix>emoji_events</mat-icon>
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="modern-field">
                          <mat-label>Institution</mat-label>
                          <input matInput formControlName="institution" required placeholder="University Name">
                          <mat-icon matSuffix>account_balance</mat-icon>
                        </mat-form-field>
                      </div>

                      <div class="form-row">
                        <mat-form-field appearance="outline" class="modern-field">
                          <mat-label>Start Year</mat-label>
                          <input matInput type="number" formControlName="startYear" required placeholder="2018">
                          <mat-icon matSuffix>calendar_today</mat-icon>
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="modern-field">
                          <mat-label>End Year</mat-label>
                          <input matInput type="number" formControlName="endYear" placeholder="2022 (or expected)">
                          <mat-icon matSuffix>event</mat-icon>
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline" class="modern-field full-width">
                        <mat-label>GPA (Optional)</mat-label>
                        <input matInput type="number" step="0.01" formControlName="gpa" placeholder="3.85">
                        <mat-icon matSuffix>grade</mat-icon>
                      </mat-form-field>
                    </div>
                  </div>
                </div>

                <button mat-stroked-button color="primary" (click)="addEducation()" class="add-button">
                  <mat-icon>add</mat-icon>
                  Add Another Education
                </button>
              </div>
            </div>
            
            <div class="step-actions">
              <button mat-mini-fab matStepperPrevious class="back-fab">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <button mat-fab color="primary" matStepperNext class="next-fab">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Skills Step -->
        <mat-step [stepControl]="skillsForm" label="Skills" icon="stars">
          <ng-template matStepLabel>Skills & Expertise</ng-template>
          <form [formGroup]="skillsForm" class="step-form">
            <div class="step-card">
              <div class="step-header">
                <mat-icon>stars</mat-icon>
                <div class="step-title">
                  <h2>Skills & Expertise</h2>
                  <p>Highlight your technical and professional skills</p>
                </div>
              </div>
              
              <div class="form-content">
                <div class="skills-input-section">
                  <mat-form-field appearance="outline" class="modern-field skill-input">
                    <mat-label>Add a Skill</mat-label>
                    <input matInput #skillInput (keyup.enter)="addSkill(skillInput.value); skillInput.value = ''" placeholder="e.g. JavaScript, Project Management">
                    <mat-icon matSuffix>psychology</mat-icon>
                  </mat-form-field>
                  <button mat-fab color="accent" (click)="addSkill(skillInput.value); skillInput.value = ''" class="add-skill-btn">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>

                <div class="skills-display" *ngIf="skillsList.length > 0">
                  <h3>Your Skills</h3>
                  <div class="skills-grid">
                    <div *ngFor="let skill of skillsList; let i = index" class="skill-chip" (click)="removeSkill(i)">
                      <span>{{skill}}</span>
                      <mat-icon>close</mat-icon>
                    </div>
                  </div>
                </div>

                <div class="suggested-skills" *ngIf="suggestedSkills.length > 0">
                  <h3>Suggested Skills</h3>
                  <p>Click to add to your skill list</p>
                  <div class="suggested-grid">
                    <div *ngFor="let skill of suggestedSkills" class="suggested-chip" (click)="addSkill(skill)">
                      <mat-icon>add_circle_outline</mat-icon>
                      <span>{{skill}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="step-actions">
              <button mat-mini-fab matStepperPrevious class="back-fab">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <button mat-fab color="primary" matStepperNext class="next-fab">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Preview & Generate Step -->
        <mat-step label="Generate CV" icon="picture_as_pdf">
          <ng-template matStepLabel>Preview & Generate</ng-template>
          <div class="step-form">
            <div class="step-card">
              <div class="step-header">
                <mat-icon>picture_as_pdf</mat-icon>
                <div class="step-title">
                  <h2>Preview & Generate</h2>
                  <p>Review your CV and download the final document</p>
                </div>
              </div>
              
              <div class="form-content">
                <div class="cv-preview" *ngIf="cvPreview">
                  <div class="preview-header">
                    <h1>{{cvPreview.fullName}}</h1>
                    <div class="contact-info">
                      <span><mat-icon>email</mat-icon>{{cvPreview.email}}</span>
                      <span><mat-icon>phone</mat-icon>{{cvPreview.phone}}</span>
                      <span *ngIf="cvPreview.location"><mat-icon>location_on</mat-icon>{{cvPreview.location}}</span>
                    </div>
                    <p class="summary" *ngIf="cvPreview.summary">{{cvPreview.summary}}</p>
                  </div>

                  <div class="preview-section" *ngIf="cvPreview.workExperiences?.length > 0">
                    <h2><mat-icon>work</mat-icon>Work Experience</h2>
                    <div *ngFor="let exp of cvPreview.workExperiences" class="preview-item">
                      <div class="item-header">
                        <h3>{{exp.jobTitle}}</h3>
                        <span class="company">{{exp.company}}</span>
                      </div>
                      <p class="date-range">{{formatDate(exp.startDate)}} - {{exp.endDate ? formatDate(exp.endDate) : 'Present'}}</p>
                      <p class="description">{{exp.description}}</p>
                    </div>
                  </div>

                  <div class="preview-section" *ngIf="cvPreview.educations?.length > 0">
                    <h2><mat-icon>school</mat-icon>Education</h2>
                    <div *ngFor="let edu of cvPreview.educations" class="preview-item">
                      <div class="item-header">
                        <h3>{{edu.degree}}</h3>
                        <span class="institution">{{edu.institution}}</span>
                      </div>
                      <p class="date-range">{{edu.startYear}} - {{edu.endYear || 'Present'}}</p>
                      <p *ngIf="edu.gpa" class="gpa">GPA: {{edu.gpa}}</p>
                    </div>
                  </div>

                  <div class="preview-section" *ngIf="skillsList.length > 0">
                    <h2><mat-icon>stars</mat-icon>Skills</h2>
                    <div class="skills-preview">
                      <span *ngFor="let skill of skillsList" class="skill-tag">{{skill}}</span>
                    </div>
                  </div>
                </div>

                <div class="generation-actions">
                  <button mat-raised-button color="primary" (click)="generateCV()" [disabled]="isGenerating" class="action-btn">
                    <mat-spinner diameter="20" *ngIf="isGenerating"></mat-spinner>
                    <mat-icon *ngIf="!isGenerating">picture_as_pdf</mat-icon>
                    <span>{{isGenerating ? 'Generating PDF...' : 'Download PDF'}}</span>
                  </button>

                  <button mat-raised-button color="accent" (click)="saveCV()" [disabled]="isSaving" class="action-btn">
                    <mat-spinner diameter="20" *ngIf="isSaving"></mat-spinner>
                    <mat-icon *ngIf="!isSaving">cloud_upload</mat-icon>
                    <span>{{isSaving ? 'Saving...' : 'Save to Cloud'}}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="step-actions">
              <button mat-mini-fab matStepperPrevious class="back-fab">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <button mat-raised-button color="warn" (click)="stepper.reset()" class="start-over-btn">
                <mat-icon>refresh</mat-icon>
                Start Over
              </button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styleUrls: ['./cv-builder.component.scss']
})
export class CvBuilderComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  personalInfoForm!: FormGroup;
  workExperienceForm!: FormGroup;
  educationForm!: FormGroup;
  skillsForm!: FormGroup;
  
  currentStep = 0;
  skillsList: string[] = [];
  suggestedSkills: string[] = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js', 'Node.js',
    'Python', 'Java', 'C#', 'SQL', 'MongoDB', 'Git', 'Docker',
    'Communication', 'Leadership', 'Problem Solving', 'Team Work'
  ];
  
  cvPreview: any = null;
  isGenerating = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private cvService: CvService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserCV();
  }

  onStepChange(event: any): void {
    this.currentStep = event.selectedIndex;
  }

  initializeForms(): void {
    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      location: [''],
      summary: [''],
      linkedInUrl: ['']
    });

    this.workExperienceForm = this.fb.group({
      experiences: this.fb.array([this.createExperienceGroup()])
    });

    this.educationForm = this.fb.group({
      educations: this.fb.array([this.createEducationGroup()])
    });

    this.skillsForm = this.fb.group({});

    // Update preview when forms change
    this.personalInfoForm.valueChanges.subscribe(() => this.updatePreview());
    this.workExperienceForm.valueChanges.subscribe(() => this.updatePreview());
    this.educationForm.valueChanges.subscribe(() => this.updatePreview());
  }

  get experiences(): FormArray {
    return this.workExperienceForm.get('experiences') as FormArray;
  }

  get educations(): FormArray {
    return this.educationForm.get('educations') as FormArray;
  }

  createExperienceGroup(): FormGroup {
    return this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      description: ['']
    });
  }

  createEducationGroup(): FormGroup {
    return this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      startYear: ['', Validators.required],
      endYear: [''],
      gpa: ['']
    });
  }

  addExperience(): void {
    this.experiences.push(this.createExperienceGroup());
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
  }

  addEducation(): void {
    this.educations.push(this.createEducationGroup());
  }

  removeEducation(index: number): void {
    this.educations.removeAt(index);
  }

  addSkill(skill: string): void {
    if (skill && skill.trim() && !this.skillsList.includes(skill.trim())) {
      this.skillsList.push(skill.trim());
      this.updatePreview();
    }
  }

  removeSkill(index: number): void {
    this.skillsList.splice(index, 1);
    this.updatePreview();
  }

  updatePreview(): void {
    this.cvPreview = {
      ...this.personalInfoForm.value,
      workExperiences: this.workExperienceForm.value.experiences,
      educations: this.educationForm.value.educations,
      skills: this.skillsList
    };
  }

  formatDate(date: any): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  async loadUserCV(): Promise<void> {
    try {
      const userCVs = await this.cvService.getUserCVs().toPromise();
      if (userCVs && userCVs.length > 0) {
        const latestCV = userCVs[0];
        // Map UserCV to CV format for populateFormsWithCV
        const cvData: CV = {
          id: latestCV.id,
          userId: latestCV.userId,
          templateId: latestCV.templateId,
          title: latestCV.title,
          fullName: latestCV.personalInfo?.fullName || '',
          email: latestCV.personalInfo?.email || '',
          phone: latestCV.personalInfo?.phone || '',
          location: latestCV.personalInfo?.address || '',
          summary: latestCV.personalInfo?.summary || '',
          workExperiences: latestCV.workExperience || [],
          educations: latestCV.education || [],
          skills: latestCV.skills || [],
          languages: latestCV.languages || [],
          certifications: latestCV.certifications || [],
          references: latestCV.references || [],
          createdAt: latestCV.createdAt,
          updatedAt: latestCV.updatedAt
        };
        this.populateFormsWithCV(cvData);
      }
    } catch (error) {
      console.error('Error loading CV:', error);
    }
  }

  populateFormsWithCV(cv: CV): void {
    this.personalInfoForm.patchValue({
      fullName: cv.fullName,
      email: cv.email,
      phone: cv.phone,
      location: cv.location,
      summary: cv.summary,
      linkedInUrl: cv.linkedInUrl
    });

    // Clear and populate work experiences
    while (this.experiences.length > 0) {
      this.experiences.removeAt(0);
    }
    cv.workExperiences?.forEach((exp: WorkExperience) => {
      this.experiences.push(this.fb.group({
        jobTitle: [exp.position],
        company: [exp.company],
        startDate: [exp.startDate],
        endDate: [exp.endDate],
        description: [exp.description]
      }));
    });

    // Clear and populate educations
    while (this.educations.length > 0) {
      this.educations.removeAt(0);
    }
    cv.educations?.forEach((edu: Education) => {
      this.educations.push(this.fb.group({
        degree: [edu.degree],
        institution: [edu.institution],
        startYear: [new Date(edu.startDate).getFullYear()],
        endYear: [edu.endDate ? new Date(edu.endDate).getFullYear() : ''],
        gpa: [edu.gpa]
      }));
    });

    // Populate skills
    this.skillsList = cv.skills?.map((s: Skill) => s.name) || [];
    this.updatePreview();
  }

  async generateCV(): Promise<void> {
    this.isGenerating = true;
    try {
      const cvData = this.buildCVData();
      const response = await this.cvService.generatePDF(cvData).toPromise();
      
      // Handle PDF download
      if (response) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cvData.fullName}_CV.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to generate PDF');
      }
      
      this.snackBar.open('CV generated successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error generating CV:', error);
      this.snackBar.open('Error generating CV. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.isGenerating = false;
    }
  }

  async saveCV(): Promise<void> {
    this.isSaving = true;
    try {
      const cvData = this.buildCVData();
      await this.cvService.createCV(cvData).toPromise();
      this.snackBar.open('CV saved successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error saving CV:', error);
      this.snackBar.open('Error saving CV. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.isSaving = false;
    }
  }

  private buildCVData(): any {
    return {
      ...this.personalInfoForm.value,
      workExperiences: this.workExperienceForm.value.experiences,
      educations: this.educationForm.value.educations,
      skills: this.skillsList.map(skill => ({ name: skill, level: 'Intermediate' }))
    };
  }
}
