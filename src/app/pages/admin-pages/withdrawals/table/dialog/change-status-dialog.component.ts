import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WithdrawalsAuditService } from "src/app/_core/services/withdrawals-audit.service";
import { DialogData, WithdrawalActions } from "../../withdrawals.component";

@Component({
    selector: 'app-admin-withdrawals-dialog',
    templateUrl: 'change-status-dialog.component.html'
})
export class WithdrawalChangeStatusDialog {

    public isLoading = false;
    public showError = false;

    constructor(
        public dialogRef: MatDialogRef<WithdrawalChangeStatusDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private withdrawalService: WithdrawalsAuditService
    ) { }

    onApproval(id: number, amount: number): void {
        this.isLoading = true;
        this.withdrawalService.approveWithdrawal(id, amount)
            .subscribe(res => {
                this.data.action = WithdrawalActions.APPROVE;
                this.closeDialog();
            }, 
                error => this.showError = true, 
                () => this.isLoading = false
            )
    }

    onReject(id: number, amount: number): void {
        this.isLoading = true;
        this.withdrawalService.rejectWithdrawal(id, amount)
            .subscribe(res => {
                this.data.action = WithdrawalActions.REJECT;
                this.closeDialog();

            }, 
                error => this.showError = true, 
                () => this.isLoading = false
            )
    }

    closeDialog(): void {
        this.dialogRef.close(this.data);
    }
}