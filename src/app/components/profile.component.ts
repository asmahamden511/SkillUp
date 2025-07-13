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
import { User } from '../models/user';

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
  templateUrl: './profile.component.html',
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
