import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  MatDialogRef
} from '@angular/material';

import { ImgurApiService } from '../../services';

@Component({
  selector: 'app-dialog-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadDialogComponent implements OnInit {

  @ViewChild('img')
  img: ElementRef;

  now: 'posting' | 'error' | null;

  async ok() {
    let el: HTMLInputElement = this.img.nativeElement;
    if (el.files && el.files.length !== 0) {
      let formData = new FormData();
      formData.append('image', el.files[0]);
      try {
        this.now = 'posting';
        let url = await this.imgur.upload(formData);
        this.now = null;
        this.dialogRef.close(url);
      } catch (_e) {
        this.now = 'error';
      }
    }
  }

  constructor(private imgur: ImgurApiService,
    private dialogRef: MatDialogRef<ImageUploadDialogComponent>) { }

  ngOnInit() {
  }

}