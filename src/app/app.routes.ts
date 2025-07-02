import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { DashboardComponent } from './components/dashboard.component';
import { InterviewPrepComponent } from './components/interview-prep.component';
import { AssessmentsComponent } from './components/assessments.component';
import { ResourcesComponent } from './components/resources.component';
import { SettingsComponent } from './components/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ai-chat', loadComponent: () => import('./components/ai-chat.component').then(m => m.AiChatComponent) },
  { path: 'cv-builder', loadComponent: () => import('./components/cv-builder.component').then(m => m.CvBuilderComponent) },
  { path: 'interview-prep', component: InterviewPrepComponent },
  { path: 'file-manager', loadComponent: () => import('./components/file-manager.component').then(m => m.FileManagerComponent) },
  { path: 'learning-paths', loadComponent: () => import('./components/learning-paths.component').then(m => m.LearningPathsComponent) },
  { path: 'assessments', component: AssessmentsComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'profile', loadComponent: () => import('./components/profile.component').then(m => m.ProfileComponent) },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/dashboard' }
];