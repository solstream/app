import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../../_core/services/auth-store.service';
import {MatDialog} from '@angular/material/dialog';
import {DisclaimerVideoModal} from './disclaimer-video-modal/disclaimer-video-modal.component';

@Component({
    selector: 'app-video-disclaimer',
    templateUrl: './video-disclaimer.component.html',
    styleUrls: ['./video-disclaimer.component.scss']
})
export class VideoDisclaimerComponent implements OnInit {
    showVideoDisclaimer = false;

    constructor(private localStorageService: LocalStorageService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        // this.showVideoDisclaimer = this.localStorageService.getFlagVideoDisclaimer() !== 'N';
        if (this.showVideoDisclaimer) {
            this.openCookiesBarModal();
        }
    }

    hideCookiesBar(): void {
        this.localStorageService.setFlagVideoDisclaimer('N');
        this.showVideoDisclaimer = this.localStorageService.getFlagVideoDisclaimer() === 'Y';
    }

    private openCookiesBarModal(): void {
        this.dialog.open(DisclaimerVideoModal, {
            width: '650px'
        });
    }

}
