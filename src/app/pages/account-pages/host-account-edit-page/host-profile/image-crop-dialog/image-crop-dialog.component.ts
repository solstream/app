import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {base64ToFile, ImageCroppedEvent, LoadedImage} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-image-crop-dialog',
    templateUrl: './image-crop-dialog.component.html',
    styleUrls: ['./image-crop-dialog.component.scss']
})
export class ImageCropDialogComponent {
    @Input() imageCropRatio = 16 / 9;

    imageChangedEvent: any = '';
    croppedImage: any = '';
    file: any;
    imageCropRatioOption: number;
    ctaText = 'UPLOAD';

    @ViewChild('fileToCrop', {read: ElementRef, static: true})
    comp: any;


    constructor(private dialogRef: MatDialogRef<ImageCropDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {imageChangeEvent: any, ctaText?: string, imageCropRatioInput: number}) {
        this.imageChangedEvent = this.data.imageChangeEvent;
        if (data.ctaText) {
            this.ctaText = data.ctaText;
        }
        this.imageCropRatioOption = data.imageCropRatioInput || this.imageCropRatio;
    }

    imageCropped(event: ImageCroppedEvent): void {
        this.croppedImage = event.base64;
        this.file = new File(
            [base64ToFile(this.croppedImage)],
            'background.jpeg',
            { type: 'image/jpeg' }); // to do get uploaded extension
    }

    imageLoaded(image: LoadedImage): void {
        // show cropper
    }

    cropperReady(): void {
        // cropper ready
    }

    loadImageFailed(): void {
        // show message
    }

    upload(): void {
        this.dialogRef.close(this.file);
    }

    cancel(): void {
        this.dialogRef.close(null);
    }

}
