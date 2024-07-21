import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginPopupState, RegistrationModalState} from './registration-modal-state.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-register-modal',
    templateUrl: './registration-modal.component.html',
    styleUrls: ['./registration-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegistrationModalComponent implements OnInit, OnDestroy {

    @ViewChild('callAPIDialog')
    private callAPIDialog: TemplateRef<any>;

    private modalSubs: Subscription;
    private xsBreakPoint: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
    private modalOpen = false;

    loginPopupSteps = LoginPopupState;
    currentStep = 'welcome';
    passwordResetToken: string;

    errorMessage: string;
    invitationCode: string;

    constructor(private dialog: MatDialog,
                private loginPopupService: RegistrationModalState,
                private router: Router,
                private breakpointObserver: BreakpointObserver) {
    }

    ngOnInit(): void {
        this.checkIfShouldInitResetPassword();
        this.modalSubs = this.loginPopupService.getModalState().subscribe(step => {
            if (step.state === LoginPopupState.CLOSE) {
                this.dialog.closeAll();
                this.modalOpen = false;
                this.currentStep = 'welcome';
            } else if (this.modalOpen) {
                this.currentStep = step.state;
            } else {
                this.modalOpen = true;
                this.currentStep = step.state;
                this.openDialog();
            }
            this.errorMessage = step.payload?.errorMessage;
            this.invitationCode = step.payload?.invitationCode;
        });
    }

    private checkIfShouldInitResetPassword(): void {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (event.url.includes('/reset-password/')) {
                    this.passwordResetToken = event.url.split('/').pop();
                    this.loginPopupService.openModal(LoginPopupState.RESET_PASSWORD);
                }
            });

        // TODO check how reset pass is effected
        // this.router.events.pipe(filter(event => event instanceof NavigationStart))
        //     .subscribe((event) => {
        //         this.loginPopupService.closeModal();
        // });
    }

    closeDialog(): void {
        this.loginPopupService.closeModal();
    }

    private openDialog(): void {
        const dialogRef = this.dialog.open(this.callAPIDialog, {
            panelClass: 'login-dialog',
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
        });
        const xsBreakPointSubscription = this.xsBreakPoint.subscribe(size => {
            if (size.matches) {
                dialogRef.updateSize('100%', '100%');
            } else {
                dialogRef.updateSize('800px', '700px');
            }
        });
        dialogRef.afterClosed().subscribe(() => {
                this.modalOpen = false;
                xsBreakPointSubscription.unsubscribe();
            }
        );
    }

    ngOnDestroy(): void {
        this.modalSubs?.unsubscribe();
    }

}
