import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image',
  imports: [CommonModule],
  templateUrl: './image.html',
  styleUrl: './image.css',
})
export class Image {
  showPopup = false;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  isUploading = false;
  uploadSuccess = false;

  onFileSelected(event: Event): void {
    console.log('hello');

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.showPopup = true;
      this.uploadSuccess = false;

      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedFile = null;
    this.previewImage = null;
    this.isUploading = false;
    this.uploadSuccess = false;
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;

    // Simulate upload delay (replace with actual API call)
    setTimeout(() => {
      this.isUploading = false;
      this.uploadSuccess = true;

      // Hide success message and close after 2 seconds
      setTimeout(() => {
        this.closePopup();
      }, 2000);

      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('file', this.selectedFile);
      // this.imageService.uploadImage(formData).subscribe(
      //   (response) => {
      //     this.isUploading = false;
      //     this.uploadSuccess = true;
      //     setTimeout(() => {
      //       this.closePopup();
      //     }, 2000);
      //   },
      //   (error) => {
      //     this.isUploading = false;
      //     console.error('Upload failed:', error);
      //   }
      // );
    }, 1500);
  }
}

