import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FileUploadService } from '../services/file-upload.service';
import { FileUpload } from '../models/interfaces';

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  template: `
    <div class="file-manager-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>File Manager</mat-card-title>
          <mat-card-subtitle>Manage your uploaded documents and files</mat-card-subtitle>
        </mat-card-header>
        <mat-card-actions>
          <input type="file" #fileInput (change)="onFileSelected($event)" multiple hidden>
          <button mat-raised-button color="primary" (click)="fileInput.click()" [disabled]="uploading">
            <mat-icon>cloud_upload</mat-icon>
            Upload Files
          </button>
          <button mat-button (click)="createFolder()">
            <mat-icon>create_new_folder</mat-icon>
            New Folder
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Upload Progress -->
      <mat-card class="upload-progress-card" *ngIf="uploadProgress.length > 0">
        <mat-card-header>
          <mat-card-title>Upload Progress</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="upload-item" *ngFor="let upload of uploadProgress">
            <div class="upload-info">
              <span class="file-name">{{upload.fileName}}</span>
              <span class="file-size">{{formatFileSize(upload.fileSize)}}</span>
            </div>
            <mat-progress-bar 
              mode="determinate" 
              [value]="upload.progress"
              [color]="upload.status === 'error' ? 'warn' : 'primary'">
            </mat-progress-bar>
            <div class="upload-status">
              <mat-icon *ngIf="upload.status === 'completed'" color="primary">check_circle</mat-icon>
              <mat-icon *ngIf="upload.status === 'error'" color="warn">error</mat-icon>
              <span>{{upload.progress}}%</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Filters and Search -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search files</mat-label>
              <input matInput [formControl]="searchControl" placeholder="Search by name or type...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>File Type</mat-label>
              <mat-select [formControl]="typeFilter" multiple>
                <mat-option value="pdf">PDF</mat-option>
                <mat-option value="doc">Document</mat-option>
                <mat-option value="image">Image</mat-option>
                <mat-option value="video">Video</mat-option>
                <mat-option value="other">Other</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Sort By</mat-label>
              <mat-select [formControl]="sortControl">
                <mat-option value="name">Name</mat-option>
                <mat-option value="date">Date</mat-option>
                <mat-option value="size">Size</mat-option>
                <mat-option value="type">Type</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-icon-button [matMenuTriggerFor]="viewMenu" matTooltip="View Options">
              <mat-icon>view_module</mat-icon>
            </button>
            <mat-menu #viewMenu="matMenu">
              <button mat-menu-item (click)="viewMode = 'grid'">
                <mat-icon>view_module</mat-icon>
                Grid View
              </button>
              <button mat-menu-item (click)="viewMode = 'list'">
                <mat-icon>view_list</mat-icon>
                List View
              </button>
            </mat-menu>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- File Grid View -->
      <div class="files-grid" *ngIf="viewMode === 'grid'">
        <div class="file-card" *ngFor="let file of filteredFiles" (click)="selectFile(file)" 
             [class.selected]="selectedFiles.has(file.id)">
          <div class="file-icon">
            <mat-icon [class]="getFileIconClass(file.contentType)">{{getFileIcon(file.contentType)}}</mat-icon>
          </div>
          <div class="file-info">
            <h4 class="file-name" [matTooltip]="file.originalFileName">{{file.originalFileName}}</h4>
            <p class="file-details">{{formatFileSize(file.fileSize)}} • {{file.uploadedAt | date:'short'}}</p>
            <div class="file-tags" *ngIf="file.tags.length > 0">
              <mat-chip *ngFor="let tag of file.tags">{{tag}}</mat-chip>
            </div>
          </div>
          <div class="file-actions">
            <button mat-icon-button [matMenuTriggerFor]="fileMenu" (click)="$event.stopPropagation()">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #fileMenu="matMenu">
              <button mat-menu-item (click)="downloadFile(file)">
                <mat-icon>download</mat-icon>
                Download
              </button>
              <button mat-menu-item (click)="shareFile(file)">
                <mat-icon>share</mat-icon>
                Share
              </button>
              <button mat-menu-item (click)="renameFile(file)">
                <mat-icon>edit</mat-icon>
                Rename
              </button>
              <button mat-menu-item (click)="deleteFile(file)" class="danger">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
            </mat-menu>
          </div>
        </div>
      </div>

      <!-- File List View -->
      <mat-card class="files-table-card" *ngIf="viewMode === 'list'">
        <mat-card-content>
          <table mat-table [dataSource]="filteredFiles" class="files-table">
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>
                <input type="checkbox" (change)="toggleAllFiles($event)">
              </th>
              <td mat-cell *matCellDef="let file">
                <input type="checkbox" 
                       [checked]="selectedFiles.has(file.id)"
                       (change)="toggleFileSelection(file, $event)">
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let file">
                <div class="file-name-cell">
                  <mat-icon [class]="getFileIconClass(file.contentType)">{{getFileIcon(file.contentType)}}</mat-icon>
                  <span>{{file.originalFileName}}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="size">
              <th mat-header-cell *matHeaderCellDef>Size</th>
              <td mat-cell *matCellDef="let file">{{formatFileSize(file.fileSize)}}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let file">{{getFileType(file.contentType)}}</td>
            </ng-container>

            <ng-container matColumnDef="uploaded">
              <th mat-header-cell *matHeaderCellDef>Uploaded</th>
              <td mat-cell *matCellDef="let file">{{file.uploadedAt | date:'medium'}}</td>
            </ng-container>

            <ng-container matColumnDef="tags">
              <th mat-header-cell *matHeaderCellDef>Tags</th>
              <td mat-cell *matCellDef="let file">
                <div class="tags-cell">
                  <mat-chip *ngFor="let tag of file.tags">{{tag}}</mat-chip>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let file">
                <button mat-icon-button [matMenuTriggerFor]="tableFileMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #tableFileMenu="matMenu">
                  <button mat-menu-item (click)="downloadFile(file)">
                    <mat-icon>download</mat-icon>
                    Download
                  </button>
                  <button mat-menu-item (click)="shareFile(file)">
                    <mat-icon>share</mat-icon>
                    Share
                  </button>
                  <button mat-menu-item (click)="renameFile(file)">
                    <mat-icon>edit</mat-icon>
                    Rename
                  </button>
                  <button mat-menu-item (click)="deleteFile(file)" class="danger">
                    <mat-icon>delete</mat-icon>
                    Delete
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                (click)="selectFile(row)" 
                [class.selected]="selectedFiles.has(row.id)">
            </tr>
          </table>

          <mat-paginator 
            [pageSizeOptions]="[10, 25, 50, 100]"
            [pageSize]="25"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>

      <!-- Selected Files Actions -->
      <div class="selected-actions" *ngIf="selectedFiles.size > 0">
        <mat-card>
          <mat-card-content>
            <div class="actions-content">
              <span class="selection-info">{{selectedFiles.size}} file(s) selected</span>
              <div class="actions-buttons">
                <button mat-button (click)="downloadSelected()">
                  <mat-icon>download</mat-icon>
                  Download
                </button>
                <button mat-button (click)="deleteSelected()">
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
                <button mat-button (click)="clearSelection()">
                  <mat-icon>clear</mat-icon>
                  Clear Selection
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="files.length === 0">
        <mat-card>
          <mat-card-content>
            <div class="empty-content">
              <mat-icon class="empty-icon">cloud_upload</mat-icon>
              <h3>No Files Yet</h3>
              <p>Upload your first files to get started with organizing your documents.</p>
              <button mat-raised-button color="primary" (click)="fileInput.click()">
                <mat-icon>add</mat-icon>
                Upload Files
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {
  searchControl = new FormControl('');
  typeFilter = new FormControl([]);
  sortControl = new FormControl('date');
  
  files: FileUpload[] = [];
  filteredFiles: FileUpload[] = [];
  selectedFiles = new Set<number>();
  viewMode: 'grid' | 'list' = 'grid';
  
  uploadProgress: any[] = [];
  uploading = false;
  
  displayedColumns = ['select', 'name', 'size', 'type', 'uploaded', 'tags', 'actions'];

  constructor(
    private fileUploadService: FileUploadService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFiles();
    this.setupFilters();
  }

  setupFilters(): void {
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.typeFilter.valueChanges.subscribe(() => this.applyFilters());
    this.sortControl.valueChanges.subscribe(() => this.applyFilters());
  }

  async loadFiles(): Promise<void> {
    try {
      this.files = await this.fileUploadService.getUserFiles().toPromise() || [];
      this.applyFilters();
    } catch (error) {
      console.error('Error loading files:', error);
      this.snackBar.open('Error loading files. Please try again.', 'Close', { duration: 3000 });
    }
  }

  applyFilters(): void {
    let filtered = [...this.files];
    
    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.originalFileName.toLowerCase().includes(searchTerm) ||
        file.contentType.toLowerCase().includes(searchTerm) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Type filter
    const types = this.typeFilter.value as string[] || [];
    if (types.length > 0) {
      filtered = filtered.filter(file => {
        const fileType = this.getFileType(file.contentType);
        return types.includes(fileType.toLowerCase());
      });
    }
    
    // Sort
    const sortBy = this.sortControl.value || 'date';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.originalFileName.localeCompare(b.originalFileName);
        case 'size':
          return b.fileSize - a.fileSize;
        case 'type':
          return a.contentType.localeCompare(b.contentType);
        case 'date':
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });
    
    this.filteredFiles = filtered;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.uploadFiles(Array.from(files));
    }
  }

  async uploadFiles(files: File[]): Promise<void> {
    this.uploading = true;
    this.uploadProgress = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadItem = {
        fileName: file.name,
        fileSize: file.size,
        progress: 0,
        status: 'uploading'
      };
      
      this.uploadProgress.push(uploadItem);
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          if (uploadItem.progress < 90) {
            uploadItem.progress += Math.random() * 20;
          }
        }, 200);
        
        const result = await this.fileUploadService.uploadFile(file).toPromise();
        
        clearInterval(progressInterval);
        uploadItem.progress = 100;
        uploadItem.status = 'completed';
        
        this.files.unshift(result!);
        this.applyFilters();
        
      } catch (error) {
        console.error('Upload error:', error);
        uploadItem.status = 'error';
        this.snackBar.open(`Error uploading ${file.name}`, 'Close', { duration: 3000 });
      }
    }
    
    this.uploading = false;
    setTimeout(() => {
      this.uploadProgress = [];
    }, 3000);
  }

  selectFile(file: FileUpload): void {
    if (this.selectedFiles.has(file.id)) {
      this.selectedFiles.delete(file.id);
    } else {
      this.selectedFiles.add(file.id);
    }
  }

  toggleFileSelection(file: FileUpload, event: any): void {
    if (event.target.checked) {
      this.selectedFiles.add(file.id);
    } else {
      this.selectedFiles.delete(file.id);
    }
  }

  toggleAllFiles(event: any): void {
    if (event.target.checked) {
      this.filteredFiles.forEach(file => this.selectedFiles.add(file.id));
    } else {
      this.selectedFiles.clear();
    }
  }

  clearSelection(): void {
    this.selectedFiles.clear();
  }

  downloadFile(file: FileUpload): void {
    window.open(file.fileUrl, '_blank');
  }

  async downloadSelected(): Promise<void> {
    const selectedFilesList = this.files.filter(file => this.selectedFiles.has(file.id));
    
    for (const file of selectedFilesList) {
      this.downloadFile(file);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  shareFile(file: FileUpload): void {
    // Copy URL to clipboard
    navigator.clipboard.writeText(file.fileUrl).then(() => {
      this.snackBar.open('File URL copied to clipboard', 'Close', { duration: 2000 });
    });
  }

  renameFile(file: FileUpload): void {
    const newName = prompt('Enter new file name:', file.originalFileName);
    if (newName && newName !== file.originalFileName) {
      this.fileUploadService.renameFile(file.id, newName).subscribe({
        next: () => {
          file.originalFileName = newName;
          this.snackBar.open('File renamed successfully', 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.error('Rename error:', error);
          this.snackBar.open('Error renaming file', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteFile(file: FileUpload): void {
    if (confirm(`Are you sure you want to delete "${file.originalFileName}"?`)) {
      this.fileUploadService.deleteFile(file.id).subscribe({
        next: () => {
          this.files = this.files.filter(f => f.id !== file.id);
          this.selectedFiles.delete(file.id);
          this.applyFilters();
          this.snackBar.open('File deleted successfully', 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.error('Delete error:', error);
          this.snackBar.open('Error deleting file', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteSelected(): void {
    const count = this.selectedFiles.size;
    if (confirm(`Are you sure you want to delete ${count} selected file(s)?`)) {
      const selectedIds = Array.from(this.selectedFiles);
      
      selectedIds.forEach(id => {
        this.fileUploadService.deleteFile(id).subscribe({
          next: () => {
            this.files = this.files.filter(f => f.id !== id);
            this.selectedFiles.delete(id);
          },
          error: (error) => {
            console.error('Delete error:', error);
          }
        });
      });
      
      this.applyFilters();
      this.snackBar.open(`${count} file(s) deleted successfully`, 'Close', { duration: 2000 });
    }
  }

  createFolder(): void {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      // Implementation for folder creation
      this.snackBar.open('Folder creation coming soon!', 'Close', { duration: 2000 });
    }
  }

  getFileIcon(contentType: string): string {
    if (contentType.includes('pdf')) return 'picture_as_pdf';
    if (contentType.includes('word') || contentType.includes('document')) return 'description';
    if (contentType.includes('image')) return 'image';
    if (contentType.includes('video')) return 'video_file';
    if (contentType.includes('audio')) return 'audio_file';
    if (contentType.includes('zip') || contentType.includes('rar')) return 'archive';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'table_chart';
    if (contentType.includes('powerpoint') || contentType.includes('presentation')) return 'slideshow';
    return 'insert_drive_file';
  }

  getFileIconClass(contentType: string): string {
    if (contentType.includes('pdf')) return 'file-icon-pdf';
    if (contentType.includes('word') || contentType.includes('document')) return 'file-icon-doc';
    if (contentType.includes('image')) return 'file-icon-image';
    if (contentType.includes('video')) return 'file-icon-video';
    if (contentType.includes('audio')) return 'file-icon-audio';
    return 'file-icon-default';
  }

  getFileType(contentType: string): string {
    if (contentType.includes('pdf')) return 'PDF';
    if (contentType.includes('word') || contentType.includes('document')) return 'Document';
    if (contentType.includes('image')) return 'Image';
    if (contentType.includes('video')) return 'Video';
    if (contentType.includes('audio')) return 'Audio';
    if (contentType.includes('zip') || contentType.includes('rar')) return 'Archive';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'Spreadsheet';
    if (contentType.includes('powerpoint') || contentType.includes('presentation')) return 'Presentation';
    return 'Other';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
