import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WithdrawalsAuditService } from "src/app/_core/services/withdrawals-audit.service";
import { DialogData, WithdrawalActions } from "../../withdrawals.component";

@Component({
    selector: 'app-admin-withdrawals-trasnfer-dialog',
    templateUrl: 'transfer-dialog.component.html'
})
export class WithdrawalTransferDialog implements OnInit {

    public isLoading = false;
    public showError = false;

    public transferForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<WithdrawalTransferDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private withdrawalService: WithdrawalsAuditService
    ) { }

    ngOnInit(): void {
        this.createForm();
    }

    createForm(): void {
        this.transferForm = new FormGroup({
            transactionUrl: new FormControl('', Validators.required),
        });
    }

    onTransfer(id: number, amount: number): void {

        this.transferForm.markAllAsTouched();

        if (this.transferForm.valid) {
            this.isLoading = true;
            this.withdrawalService.transferWithdrawal(id, this.transferForm.controls.transactionUrl.value, amount)
                .subscribe(res => {
                    this.data.action = WithdrawalActions.TRANSFER;
                    this.closeDialog();
                },
                    () => this.showError = true,
                    () => this.isLoading = false
                );
        }
    }

    closeDialog(): void {
        this.dialogRef.close(this.data);
    }
}
