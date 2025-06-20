import { Component, Input } from '@angular/core';
import { VideoSummaryDto, VideoUploadDto } from '../section-model';
import { UrlsService } from '../../services/urls.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-add-video',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css'],
})
export class AddVideosComponent {
  @Input() sectionId!: number;
  @Input() courseId!: number;
  videos: VideoSummaryDto[] = [];
  showAddVideoForm = false;

  newVideo: VideoUploadDto = {
    userId: 0,
    sectionId: 0,
    videoName: '',
    description: '',
    videoFileUpload: {} as File,
    fileType: '',
    videoDurtion: 0, // Duration will be set after file selection
  };
  selectedFile: File | null = null;
  selectedVideo: VideoSummaryDto | null = null;
  videoUrl: SafeResourceUrl | null = null;
  textContent: string | null = null;
  showSaveButton = false; // Add this property to control Save button

  constructor(
    private urls: UrlsService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit() {
    // Get userId from AuthService
    const userId = this.authService.getUserId();
    this.newVideo.userId = userId ?? 0;
    if (this.sectionId) {
      this.newVideo.sectionId = this.sectionId;
      this.loadVideos();
    }
  }

  loadVideos() {
    this.urls.getVideosBySection(this.sectionId).subscribe((videos) => {
      this.videos = videos;
    });
  }

  // Helper to get video duration in minutes.seconds format
  private getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        // Format as minutes.seconds (e.g., 2.05 for 2 minutes 5 seconds)
        const formatted = parseFloat(`${minutes}.${seconds < 10 ? '0' : ''}${seconds}`);
        resolve(formatted);
      };
      video.onerror = function () {
        reject('Invalid video file');
      };
      video.src = URL.createObjectURL(file);
    });
  }

  // Calculate duration and set it when file is selected
  async onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.showSaveButton = false; // Hide Save button initially
    if (this.selectedFile) {
      this.newVideo.videoFileUpload = this.selectedFile;
      const ext = this.selectedFile.name.split('.').pop()?.toLowerCase() || '';
      this.newVideo.fileType = ext;
      // If file is a video, get duration and enable Save
      if (['mp4', 'mov', 'avi', 'wmv', 'mkv', 'webm'].includes(ext)) {
        try {
          this.newVideo.videoDurtion = await this.getVideoDuration(this.selectedFile);
          this.showSaveButton = true;
        } catch {
          this.newVideo.videoDurtion = 0;
          this.showSaveButton = false;
        }
      } else {
        // Not a video: don't calculate duration, enable Save
        this.newVideo.videoDurtion = 0;
        this.showSaveButton = true;
      }
    }
  }

  openAddVideoForm() {
    this.showAddVideoForm = true;
    // Always get userId from AuthService when opening the form
    const userId = this.authService.getUserId();
    this.newVideo = {
      userId: userId ?? 0,
      sectionId: this.sectionId,
      videoName: '',
      description: '',
      videoFileUpload: {} as File,
      fileType: '',
      videoDurtion: 0,
    };
    this.selectedFile = null;
  }

  onAddVideo() {
    if (!this.newVideo.videoFileUpload || !this.sectionId) return;
    const formData = new FormData();
    formData.append('UserId', this.newVideo.userId.toString());
    formData.append('SectionId', this.newVideo.sectionId.toString());
    formData.append('VideoName', this.newVideo.videoName);
    formData.append('Description', this.newVideo.description);
    formData.append('VideoFileUpload', this.newVideo.videoFileUpload);
    formData.append('FileType', 'string');
    formData.append('VideoUrl','string');
    if (this.newVideo.videoId) {
      formData.append('VideoId', this.newVideo.videoId.toString());
    }
    // Send VideoDuration as null/empty if not a video
    if (this.newVideo.videoDurtion !== undefined && this.newVideo.videoDurtion !== null) {
      formData.append('VideoDuration', this.newVideo.videoDurtion.toString());
    } else {
      formData.append('VideoDuration', '');
    }
    // Print the object being sent (for debugging)
    const debugObj: any = {};
    formData.forEach((value, key) => {
      debugObj[key] = value;
    });
    console.log('Uploading video object:', debugObj);

    this.urls.uploadVideo(formData).subscribe({
      next: () => {
        this.toastr.success('Video uploaded successfully!');
        this.showAddVideoForm = false;
        this.loadVideos();
      },
      error: (err) => {
        this.toastr.error(
          'Upload failed: ' + (err.error?.message || 'Unknown error')
        );
        console.error('Upload error:', err.error);
      },
    });
  }

  onVideoClick(video: VideoSummaryDto) {
    this.selectedVideo = video;
    this.videoUrl = null;
    this.textContent = null;
  }

  onEditFileSelected(event: any) {
    if (this.selectedVideo) {
      (this.selectedVideo as any).newFile = event.target.files[0];
      const ext =
        event.target.files[0]?.name.split('.').pop()?.toLowerCase() || '';
      (this.selectedVideo as any).fileType = ext;
    }
  }

  async saveVideoEdits() {
    if (!this.selectedVideo) return;

    const userId = this.authService.getUserId();
    const formData = new FormData();
    formData.append('UserId', (userId ?? 0).toString());
    formData.append('VideoId', this.selectedVideo.videoId.toString());
    formData.append('SectionId', this.sectionId.toString());
    formData.append('VideoName', this.selectedVideo.videoName);
    formData.append('Description', this.selectedVideo.description);
    formData.append('FileType', 'string');
    formData.append('VideoUrl','string');

    let durationToSend: number | string = '';

    // If a new file is selected and it's a video, recalculate duration
    if ((this.selectedVideo as any).newFile) {
      const file = (this.selectedVideo as any).newFile as File;
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (['mp4', 'mov', 'avi', 'wmv', 'mkv', 'webm'].includes(ext)) {
        try {
          durationToSend = await this.getVideoDuration(file);
        } catch {
          durationToSend = '';
        }
      } else {
        durationToSend = '';
      }
      formData.append('VideoFileUpload', file);
    } else {
      // No new file: send existing duration if present
      durationToSend = (this.selectedVideo as any).videoDurtion ?? '';
    }

    formData.append('VideoDuration', durationToSend.toString());

    // Print the object being sent (for debugging)
    const debugObj: any = {};
    formData.forEach((value, key) => {
      debugObj[key] = value;
    });
    console.log('Updating video object:', debugObj);

    this.urls.uploadVideo(formData).subscribe({
      next: () => {
        this.toastr.success('Video updated successfully!');
        this.selectedVideo = null;
        this.loadVideos();
      },
      error: (err) => {
        this.toastr.error(
          'Update failed: ' + (err.error?.message || 'Unknown error')
        );
      },
    });
  }

  loadVideo(videoId: number) {
    this.urls.getDecryptedVideo(videoId).subscribe({
      next: (blob) => {
        const fileType = (this.selectedVideo?.fileType || '')
          .replace('.', '')
          .toLowerCase();
        if (
          blob.type.startsWith('video/') ||
          blob.type.startsWith('image/') ||
          blob.type === 'application/pdf'
        ) {
          const url = URL.createObjectURL(blob);
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.textContent = null;
        } else if (blob.type === 'text/plain' || fileType === 'txt') {
          const reader = new FileReader();
          reader.onload = () => {
            this.textContent = reader.result as string;
            this.videoUrl = null;
          };
          reader.readAsText(blob);
        } else {
          const url = URL.createObjectURL(blob);
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.textContent = null;
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load video');
        console.error('Load video error:', err);
      },
    });
  }

  deleteVideo(videoId: number) {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this.urls.deleteVideo(videoId).subscribe({
        next: () => {
          this.toastr.success('Lesson deleted successfully!');
          this.selectedVideo = null;
          this.loadVideos();
        },
        error: (err) => {
          this.toastr.error(
            'Delete failed: ' + (err.error?.message || 'Unknown error')
          );
          console.error('Delete error:', err);
        },
      });
    }
  }

  getFileButtonType(video: VideoSummaryDto): {
    icon: string;
    btnClass: string;
    label: string;
  } {
    const type = (video.fileType || '').toLowerCase();
    if (type === '.mp4') {
      return {
        icon: 'fa-video',
        btnClass: 'btn-outline-primary',
        label: 'Video',
      };
    }
    return {
      icon: 'fa-file-alt',
      btnClass: 'btn-outline-secondary',
      label: 'Document',
    };
  }
}