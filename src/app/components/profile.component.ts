import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';
import { User } from '../models/interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-header">
        <div class="profile-header-content">
          <div class="avatar-section">
            <div class="avatar-circle">
              <img *ngIf="profileImageUrl" [src]="profileImageUrl" [alt]="user?.name">
              <mat-icon *ngIf="!profileImageUrl">person</mat-icon>
            </div>
            <input type="file" #fileInput (change)="onImageSelected($event)" accept="image/*" hidden>
            <button mat-mini-fab color="primary" class="edit-avatar-btn" (click)="fileInput.click()">
              <mat-icon>camera_alt</mat-icon>
            </button>
          </div>
          <div class="user-info">
            <h2>{{user?.name || 'User Name'}}</h2>
            <p class="user-email">{{user?.email || 'user@example.com'}}</p>
            <p class="user-role">{{user?.role || 'Student'}}</p>
          </div>
        </div>
      </mat-card>

      <mat-tab-group class="profile-tabs">
        <!-- Personal Information Tab -->
        <mat-tab label="Personal Information">
          <div class="tab-content">
            <form [formGroup]="personalForm" (ngSubmit)="savePersonalInfo()">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Basic Information</mat-card-title>
                  <mat-card-subtitle>Update your personal details</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Full Name</mat-label>
                      <input matInput formControlName="fullName" required>
                      <mat-error *ngIf="personalForm.get('fullName')?.hasError('required')">
                        Full name is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Email</mat-label>
                      <input matInput type="email" formControlName="email" required>
                      <mat-error *ngIf="personalForm.get('email')?.hasError('required')">
                        Email is required
                      </mat-error>
                      <mat-error *ngIf="personalForm.get('email')?.hasError('email')">
                        Please enter a valid email
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Phone Number</mat-label>
                      <input matInput formControlName="phone">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Date of Birth</mat-label>
                      <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth">
                      <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
                      <mat-datepicker #dobPicker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Address</mat-label>
                      <textarea matInput rows="3" formControlName="address"></textarea>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Bio</mat-label>
                      <textarea matInput rows="4" formControlName="bio" 
                               placeholder="Tell us about yourself..."></textarea>
                    </mat-form-field>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary" type="submit" [disabled]="personalForm.invalid || savingPersonal">
                    <mat-spinner diameter="20" *ngIf="savingPersonal"></mat-spinner>
                    <mat-icon *ngIf="!savingPersonal">save</mat-icon>
                    {{savingPersonal ? 'Saving...' : 'Save Changes'}}
                  </button>
                  <button mat-button type="button" (click)="resetPersonalForm()">Reset</button>
                </mat-card-actions>
              </mat-card>
            </form>
          </div>
        </mat-tab>

        <!-- Professional Information Tab -->
        <mat-tab label="Professional">
          <div class="tab-content">
            <form [formGroup]="professionalForm" (ngSubmit)="saveProfessionalInfo()">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Professional Information</mat-card-title>
                  <mat-card-subtitle>Update your career details</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Current Job Title</mat-label>
                      <input matInput formControlName="jobTitle">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Company</mat-label>
                      <input matInput formControlName="company">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Industry</mat-label>
                      <mat-select formControlName="industry">
                        <mat-option value="technology">Technology</mat-option>
                        <mat-option value="finance">Finance</mat-option>
                        <mat-option value="healthcare">Healthcare</mat-option>
                        <mat-option value="education">Education</mat-option>
                        <mat-option value="marketing">Marketing</mat-option>
                        <mat-option value="consulting">Consulting</mat-option>
                        <mat-option value="other">Other</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Experience Level</mat-label>
                      <mat-select formControlName="experienceLevel">
                        <mat-option value="entry">Entry Level (0-2 years)</mat-option>
                        <mat-option value="mid">Mid Level (3-5 years)</mat-option>
                        <mat-option value="senior">Senior Level (6-10 years)</mat-option>
                        <mat-option value="lead">Lead/Manager (10+ years)</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>LinkedIn Profile</mat-label>
                      <input matInput formControlName="linkedInUrl" 
                             placeholder="https://linkedin.com/in/your-profile">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Portfolio/Website</mat-label>
                      <input matInput formControlName="portfolioUrl" 
                             placeholder="https://your-portfolio.com">
                    </mat-form-field>
                  </div>

                  <mat-divider class="section-divider"></mat-divider>

                  <div class="skills-section">
                    <h4>Skills</h4>
                    <div class="skills-input">
                      <mat-form-field appearance="outline" class="skill-input">
                        <mat-label>Add Skill</mat-label>
                        <input matInput #skillInput 
                               (keyup.enter)="addSkill(skillInput.value); skillInput.value = ''"
                               placeholder="Type a skill and press Enter">
                      </mat-form-field>
                      <button mat-icon-button type="button" 
                              (click)="addSkill(skillInput.value); skillInput.value = ''">
                        <mat-icon>add</mat-icon>
                      </button>
                    </div>
                    
                    <div class="skills-list" *ngIf="skillsList.length > 0">
                      <mat-chip-set>
                        <mat-chip *ngFor="let skill of skillsList; let i = index" 
                                 [removable]="true" (removed)="removeSkill(i)">
                          {{skill}}
                          <mat-icon matChipRemove>cancel</mat-icon>
                        </mat-chip>
                      </mat-chip-set>
                    </div>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="professionalForm.invalid || savingProfessional">
                    <mat-spinner diameter="20" *ngIf="savingProfessional"></mat-spinner>
                    <mat-icon *ngIf="!savingProfessional">save</mat-icon>
                    {{savingProfessional ? 'Saving...' : 'Save Changes'}}
                  </button>
                  <button mat-button type="button" (click)="resetProfessionalForm()">Reset</button>
                </mat-card-actions>
              </mat-card>
            </form>
          </div>
        </mat-tab>

        <!-- Account Settings Tab -->
        <mat-tab label="Account Settings">
          <div class="tab-content">
            <div class="settings-section">
              <!-- Change Password -->
              <mat-card class="settings-card">
                <mat-card-header>
                  <mat-card-title>Change Password</mat-card-title>
                  <mat-card-subtitle>Update your account password</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                    <div class="form-grid">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Current Password</mat-label>
                        <input matInput type="password" formControlName="currentPassword" required>
                        <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                          Current password is required
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>New Password</mat-label>
                        <input matInput type="password" formControlName="newPassword" required>
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                          New password is required
                        </mat-error>
                        <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                          Password must be at least 6 characters
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Confirm New Password</mat-label>
                        <input matInput type="password" formControlName="confirmPassword" required>
                        <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                          Please confirm your password
                        </mat-error>
                        <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
                          Passwords do not match
                        </mat-error>
                      </mat-form-field>
                    </div>
                    <mat-card-actions>
                      <button mat-raised-button color="primary" type="submit" 
                              [disabled]="passwordForm.invalid || changingPassword">
                        <mat-spinner diameter="20" *ngIf="changingPassword"></mat-spinner>
                        <mat-icon *ngIf="!changingPassword">lock</mat-icon>
                        {{changingPassword ? 'Changing...' : 'Change Password'}}
                      </button>
                    </mat-card-actions>
                  </form>
                </mat-card-content>
              </mat-card>

              <!-- Account Actions -->
              <mat-card class="settings-card">
                <mat-card-header>
                  <mat-card-title>Account Actions</mat-card-title>
                  <mat-card-subtitle>Manage your account</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="account-actions">
                    <div class="action-item">
                      <div class="action-info">
                        <h4>Export Your Data</h4>
                        <p>Download all your data including CVs, interview progress, and files</p>
                      </div>
                      <button mat-stroked-button color="primary" (click)="exportData()">
                        <mat-icon>download</mat-icon>
                        Export Data
                      </button>
                    </div>

                    <mat-divider></mat-divider>

                    <div class="action-item">
                      <div class="action-info">
                        <h4>Deactivate Account</h4>
                        <p>Temporarily disable your account (you can reactivate it later)</p>
                      </div>
                      <button mat-stroked-button color="warn" (click)="deactivateAccount()">
                        <mat-icon>pause_circle</mat-icon>
                        Deactivate
                      </button>
                    </div>

                    <mat-divider></mat-divider>

                    <div class="action-item danger-zone">
                      <div class="action-info">
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all associated data</p>
                      </div>
                      <button mat-stroked-button color="warn" (click)="deleteAccount()">
                        <mat-icon>delete_forever</mat-icon>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileImageUrl: string = '';
  
  personalForm!: FormGroup;
  professionalForm!: FormGroup;
  passwordForm!: FormGroup;
  
  skillsList: string[] = [];
  
  savingPersonal = false;
  savingProfessional = false;
  changingPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  initializeForms(): void {
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dateOfBirth: [''],
      address: [''],
      bio: ['']
    });

    this.professionalForm = this.fb.group({
      jobTitle: [''],
      company: [''],
      industry: [''],
      experienceLevel: [''],
      linkedInUrl: [''],
      portfolioUrl: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUserProfile(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.personalForm.patchValue({
        fullName: this.user.name,
        email: this.user.email
      });
    }
    
    // Load additional profile data from backend
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.populateFromProfile(profile);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  populateFromProfile(profile: any): void {
    this.personalForm.patchValue({
      phone: profile.phone || '',
      dateOfBirth: profile.dateOfBirth || '',
      address: profile.address || '',
      bio: profile.bio || ''
    });

    this.professionalForm.patchValue({
      jobTitle: profile.jobTitle || '',
      company: profile.company || '',
      industry: profile.industry || '',
      experienceLevel: profile.experienceLevel || '',
      linkedInUrl: profile.linkedInUrl || '',
      portfolioUrl: profile.portfolioUrl || ''
    });

    this.skillsList = profile.skills || [];
    this.profileImageUrl = profile.profileImageUrl || '';
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Upload to server
      this.uploadProfileImage(file);
    }
  }

  uploadProfileImage(file: File): void {
    // Implementation for uploading profile image
    this.snackBar.open('Profile image updated!', 'Close', { duration: 2000 });
  }

  addSkill(skill: string): void {
    if (skill && skill.trim() && !this.skillsList.includes(skill.trim())) {
      this.skillsList.push(skill.trim());
    }
  }

  removeSkill(index: number): void {
    this.skillsList.splice(index, 1);
  }

  async savePersonalInfo(): Promise<void> {
    if (this.personalForm.valid) {
      this.savingPersonal = true;
      try {
        const formData = this.personalForm.value;
        await this.authService.updateProfile(formData).toPromise();
        this.snackBar.open('Personal information updated successfully!', 'Close', { duration: 3000 });
      } catch (error) {
        console.error('Error saving personal info:', error);
        this.snackBar.open('Error updating personal information', 'Close', { duration: 3000 });
      } finally {
        this.savingPersonal = false;
      }
    }
  }

  async saveProfessionalInfo(): Promise<void> {
    if (this.professionalForm.valid) {
      this.savingProfessional = true;
      try {
        const formData = { ...this.professionalForm.value, skills: this.skillsList };
        await this.authService.updateProfile(formData).toPromise();
        this.snackBar.open('Professional information updated successfully!', 'Close', { duration: 3000 });
      } catch (error) {
        console.error('Error saving professional info:', error);
        this.snackBar.open('Error updating professional information', 'Close', { duration: 3000 });
      } finally {
        this.savingProfessional = false;
      }
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.valid) {
      this.changingPassword = true;
      try {
        const { currentPassword, newPassword } = this.passwordForm.value;
        await this.authService.changePassword(currentPassword, newPassword).toPromise();
        this.passwordForm.reset();
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
      } catch (error) {
        console.error('Error changing password:', error);
        this.snackBar.open('Error changing password', 'Close', { duration: 3000 });
      } finally {
        this.changingPassword = false;
      }
    }
  }

  resetPersonalForm(): void {
    this.loadUserProfile();
  }

  resetProfessionalForm(): void {
    this.loadUserProfile();
  }

  exportData(): void {
    this.authService.exportUserData().subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'skillup-user-data.json';
        link.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Data exported successfully!', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Export error:', error);
        this.snackBar.open('Error exporting data', 'Close', { duration: 3000 });
      }
    });
  }

  deactivateAccount(): void {
    if (confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
      this.authService.deactivateAccount().subscribe({
        next: () => {
          this.snackBar.open('Account deactivated successfully', 'Close', { duration: 3000 });
          this.authService.logout();
        },
        error: (error) => {
          console.error('Deactivation error:', error);
          this.snackBar.open('Error deactivating account', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteAccount(): void {
    const confirmation = prompt('This action cannot be undone. Type "DELETE" to confirm:');
    if (confirmation === 'DELETE') {
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.snackBar.open('Account deleted successfully', 'Close', { duration: 3000 });
          this.authService.logout();
        },
        error: (error) => {
          console.error('Deletion error:', error);
          this.snackBar.open('Error deleting account', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
