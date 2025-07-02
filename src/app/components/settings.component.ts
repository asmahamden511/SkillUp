import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-settings',
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
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="settings-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>Settings</mat-card-title>
          <mat-card-subtitle>Customize your SkillUp experience</mat-card-subtitle>
        </mat-card-header>
      </mat-card>

      <!-- Notifications Settings -->
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>notifications</mat-icon>
            Notifications
          </mat-card-title>
          <mat-card-subtitle>Manage your notification preferences</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="notificationForm">
            <div class="setting-item">
              <div class="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive updates about your progress and new features via email</p>
              </div>
              <mat-slide-toggle formControlName="emailNotifications"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Interview Reminders</h4>
                <p>Get reminded about upcoming mock interview sessions</p>
              </div>
              <mat-slide-toggle formControlName="interviewReminders"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Progress Updates</h4>
                <p>Weekly summary of your learning progress</p>
              </div>
              <mat-slide-toggle formControlName="progressUpdates"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-item">
              <div class="setting-info">
                <h4>AI Recommendations</h4>
                <p>Personalized course and career recommendations</p>
              </div>
              <mat-slide-toggle formControlName="aiRecommendations"></mat-slide-toggle>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="saveNotificationSettings()">
            <mat-icon>save</mat-icon>
            Save Notification Settings
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Appearance Settings -->
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>palette</mat-icon>
            Appearance
          </mat-card-title>
          <mat-card-subtitle>Customize the look and feel</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="appearanceForm">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Theme</mat-label>
                <mat-select formControlName="theme">
                  <mat-option value="light">Light</mat-option>
                  <mat-option value="dark">Dark</mat-option>
                  <mat-option value="auto">Auto (System)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Language</mat-label>
                <mat-select formControlName="language">
                  <mat-option value="en">English</mat-option>
                  <mat-option value="es">Spanish</mat-option>
                  <mat-option value="fr">French</mat-option>
                  <mat-option value="de">German</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Compact Mode</h4>
                <p>Use a more compact layout to fit more content on screen</p>
              </div>
              <mat-slide-toggle formControlName="compactMode"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Animations</h4>
                <p>Enable smooth animations and transitions</p>
              </div>
              <mat-slide-toggle formControlName="animations"></mat-slide-toggle>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="saveAppearanceSettings()">
            <mat-icon>save</mat-icon>
            Save Appearance Settings
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Privacy Settings -->
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>privacy_tip</mat-icon>
            Privacy & Data
          </mat-card-title>
          <mat-card-subtitle>Control your data and privacy settings</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="privacyForm">
            <div class="setting-item">
              <div class="setting-info">
                <h4>Profile Visibility</h4>
                <p>Allow other users to see your profile and progress</p>
              </div>
              <mat-slide-toggle formControlName="profileVisibility"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Analytics & Usage Data</h4>
                <p>Help improve SkillUp by sharing anonymous usage data</p>
              </div>
              <mat-slide-toggle formControlName="analyticsData"></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-item">
              <div class="setting-info">
                <h4>Data Export</h4>
                <p>Download all your data in a portable format</p>
              </div>
              <button mat-stroked-button color="primary" (click)="exportData()">
                <mat-icon>download</mat-icon>
                Export Data
              </button>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-item danger-zone">
              <div class="setting-info">
                <h4>Clear All Data</h4>
                <p>Remove all your progress, files, and settings (cannot be undone)</p>
              </div>
              <button mat-stroked-button color="warn" (click)="clearAllData()">
                <mat-icon>delete_sweep</mat-icon>
                Clear All Data
              </button>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="savePrivacySettings()">
            <mat-icon>save</mat-icon>
            Save Privacy Settings
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- About Section -->
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            About SkillUp
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="about-content">
            <div class="app-info">
              <h4>SkillUp Platform</h4>
              <p>Version 1.0.0</p>
              <p>Your AI-powered career development companion</p>
            </div>

            <mat-divider></mat-divider>

            <div class="links-section">
              <h4>Support & Resources</h4>
              <div class="link-buttons">
                <button mat-stroked-button (click)="openLink('help')">
                  <mat-icon>help</mat-icon>
                  Help Center
                </button>
                <button mat-stroked-button (click)="openLink('terms')">
                  <mat-icon>description</mat-icon>
                  Terms of Service
                </button>
                <button mat-stroked-button (click)="openLink('privacy')">
                  <mat-icon>privacy_tip</mat-icon>
                  Privacy Policy
                </button>
                <button mat-stroked-button (click)="openLink('contact')">
                  <mat-icon>contact_support</mat-icon>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  notificationForm!: FormGroup;
  appearanceForm!: FormGroup;
  privacyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  initializeForms(): void {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      interviewReminders: [true],
      progressUpdates: [true],
      aiRecommendations: [true]
    });

    this.appearanceForm = this.fb.group({
      theme: ['light'],
      language: ['en'],
      compactMode: [false],
      animations: [true]
    });

    this.privacyForm = this.fb.group({
      profileVisibility: [true],
      analyticsData: [true]
    });
  }

  loadSettings(): void {
    // Load settings from localStorage or backend
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        this.notificationForm.patchValue(settings.notifications || {});
        this.appearanceForm.patchValue(settings.appearance || {});
        this.privacyForm.patchValue(settings.privacy || {});
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }

  saveNotificationSettings(): void {
    const settings = this.getStoredSettings();
    settings.notifications = this.notificationForm.value;
    this.saveSettings(settings);
    this.snackBar.open('Notification settings saved!', 'Close', { duration: 2000 });
  }

  saveAppearanceSettings(): void {
    const settings = this.getStoredSettings();
    settings.appearance = this.appearanceForm.value;
    this.saveSettings(settings);
    this.snackBar.open('Appearance settings saved!', 'Close', { duration: 2000 });
    
    // Apply theme changes
    this.applyTheme(this.appearanceForm.value.theme);
  }

  savePrivacySettings(): void {
    const settings = this.getStoredSettings();
    settings.privacy = this.privacyForm.value;
    this.saveSettings(settings);
    this.snackBar.open('Privacy settings saved!', 'Close', { duration: 2000 });
  }

  private getStoredSettings(): any {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : {};
  }

  private saveSettings(settings: any): void {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }

  private applyTheme(theme: string): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      // Auto theme - detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    }
  }

  exportData(): void {
    // Simulate data export
    const userData = {
      profile: 'User profile data...',
      progress: 'Learning progress...',
      files: 'Uploaded files...',
      settings: this.getStoredSettings(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'skillup-user-data.json';
    link.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Data exported successfully!', 'Close', { duration: 2000 });
  }

  clearAllData(): void {
    const confirmation = prompt('This will delete ALL your data. Type "DELETE" to confirm:');
    if (confirmation === 'DELETE') {
      localStorage.clear();
      this.snackBar.open('All data cleared successfully!', 'Close', { duration: 3000 });
      // In a real app, you'd also call backend to clear server data
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  }

  openLink(type: string): void {
    const links = {
      help: 'https://skillup.help',
      terms: 'https://skillup.com/terms',
      privacy: 'https://skillup.com/privacy',
      contact: 'https://skillup.com/contact'
    };

    const url = links[type as keyof typeof links];
    if (url) {
      window.open(url, '_blank');
    } else {
      this.snackBar.open(`${type} page coming soon!`, 'Close', { duration: 2000 });
    }
  }
}
