import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import VideoSnapshot from 'video-snapshot';
import {DomSanitizer} from '@angular/platform-browser';
// import {Ng2ImgMaxService} from 'ng2-img-max';

@Component({
    selector: 'app-video-snapshot-select',
    templateUrl: './video-snapshot-select.component.html',
    styleUrls: ['./video-snapshot-select.component.scss']
})
export class VideoSnapshotSelectComponent implements OnInit {

    snapshot1 = null;
    file1 = null;
    snapshot2 = null;
    file2 = null;
    snapshot3 = null;
    file3 = null;
    snapshot4 = null;
    file4 = null;

    selected: File = null;

    @Input()
    set videoFile(file: File) {
        if (file) {
            this.reset();
            this.setSnapshots(file);
        }
    }

    @Output()
    imageSelected = new EventEmitter<File>();

    private setSnapshots(file: File): void {
        this.takeSnapshot(file, 1, 'snapshot1', 'file1');
        this.takeSnapshot(file, 20, 'snapshot2', 'file2');
        this.takeSnapshot(file, 40, 'snapshot3', 'file3');
        this.takeSnapshot(file, 200, 'snapshot4', 'file4');
    }

    constructor(private sanitizer: DomSanitizer /*, private ng2ImgMaxService: Ng2ImgMaxService*/) {
    }

    ngOnInit(): void {
    }

    select(reference: File): void {
        this.selected = reference;
        this.imageSelected.emit(this.selected);
    }

    isSelected(ref): boolean {
        return this.selected === ref;
    }

    private async takeSnapshot(videoFile: File, seconds: number, propertyName: string, filePropName: string): Promise<void> {
        const previewSrc = await new VideoSnapshot(videoFile).takeSnapshot(seconds);
        const base64 = previewSrc.split(',')[1];
        const snapshotImageBlob = this.dataURItoBlob(base64);
        const snapshotFile = new File([snapshotImageBlob], 'tmp-snapshot', {type: 'image/png'});
        // this.ng2ImgMaxService.compress([snapshotFile], 0.05).subscribe((result) => {
            const objectURL = URL.createObjectURL(snapshotFile);
            this[propertyName] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this[filePropName] = new File([snapshotFile], videoFile.name, {type: 'image/png'});
        // });
    }

    private dataURItoBlob(dataURI): Blob {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([int8Array], {type: 'image/png'});
    }

    hasPreview(): boolean {
        return this.snapshot1 && this.snapshot2 && this.snapshot3 && this.snapshot4;
    }

    reset(): void {
        this.snapshot1 = null;
        this.file1 = null;
        this.snapshot2 = null;
        this.file2 = null;
        this.snapshot3 = null;
        this.file3 = null;
        this.snapshot4 = null;
        this.file4 = null;
        this.selected = null;
        this.imageSelected.emit(null);
    }
}
