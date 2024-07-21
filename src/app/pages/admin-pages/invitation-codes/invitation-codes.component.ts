import {Component, OnInit} from '@angular/core';
import {InvitationCodeModel, InvitationCodeService} from '../../../_core/services/invitation-code.service';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {InvitationCodeModalComponent} from './invitation-code/invitation-code-modal.component';
import {ConfirmModalComponent} from '../../../@mvp/shared-components/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-invitation-codes',
    templateUrl: './invitation-codes.component.html',
    styleUrls: ['./invitation-codes.component.scss']
})
export class InvitationCodesComponent implements OnInit {

    codeForm = new FormGroup({
        code: new FormControl(''),
        usageLimit: new FormControl(''),
    });

    saving = false;
    invitations: InvitationCodeModel[];

    constructor(private invitationCodeService: InvitationCodeService, public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.codes();
    }

    private codes(): void {
        this.invitationCodeService.getInvitationKeys().subscribe(invitation => {
            this.invitations = invitation;
        });
    }

    cancel() {

    }

    open(): void {
        this.dialog.open(InvitationCodeModalComponent, {disableClose: true, width: '400px'})
            .afterClosed().subscribe(() => {
            this.codes();
        });
    }

    edit(invitation: InvitationCodeModel): void {
        this.dialog.open(InvitationCodeModalComponent, {
            disableClose: true,
            width: '400px',
            data: {
                edit: true,
                invitation
            }
        }).afterClosed().subscribe(() => {
            this.codes();
        });
    }

    // TODO generic confirmation modal
    delete(invitation: InvitationCodeModel): void {
        this.dialog.open(ConfirmModalComponent, {
            width: '500px',
            data: {
                confirmMsg: `Are you sure to delete code ${invitation.code}?`
            }
        }).afterClosed().subscribe(result => {
            if (result?.event === 'confirm') {
                this.invitationCodeService.deleteInvitation(invitation.code).subscribe(() => {
                    this.codes();
                });
            }
        });
    }


}
