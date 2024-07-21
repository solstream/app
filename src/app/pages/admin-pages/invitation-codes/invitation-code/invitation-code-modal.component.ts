import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {InvitationCodeModel, InvitationCodeService} from '../../../../_core/services/invitation-code.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-invitation-code',
    templateUrl: './invitation-code-modal.component.html',
    styleUrls: ['./invitation-code-modal.component.scss']
})
export class InvitationCodeModalComponent implements OnInit {

    codeForm = new FormGroup({
        code: new FormControl('', [Validators.required] ),
        usageLimit: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    });

    saving = false;
    editMode = false;

    constructor(private invitationCodeService: InvitationCodeService,
                private dialogRef: MatDialogRef<InvitationCodeModalComponent>,
                @Inject(MAT_DIALOG_DATA) private data,
    ) {
    }

    ngOnInit(): void {
        if (this.data.edit) {
            this.codeForm.get('code').setValue(this.data.invitation.code);
            this.codeForm.get('code').disable();
            this.codeForm.get('usageLimit').setValue(this.data.invitation.usageLimit);
            this.editMode = true;
        }
    }

    save(): void {
        this.saving = true;
        this.invitationCodeService.saveInvitationKey(
            this.codeForm.getRawValue().code,
            this.codeForm.getRawValue().usageLimit
        ).subscribe(() => {
            this.dialogRef.close();
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }

}
