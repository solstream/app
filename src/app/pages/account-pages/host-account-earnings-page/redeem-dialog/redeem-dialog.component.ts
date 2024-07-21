import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EarningsService} from '../../../../_core/services/earnings.service';
import {EarningsWithdrawService} from '../../../../_core/services/earnings-withdraw.service';
import {WITHDRAW_FEE_solstream} from '../../../../_core/constants/fees';
import {LocalStorageService} from '../../../../_core/services/auth-store.service';

@Component({
    selector: 'app-host-earning-redeem-dialog',
    templateUrl: 'redeem-dialog.component.html',
    styleUrls: ['./redeem-dialog.component.scss']

})
export class AccountEarningsRedeenDialogComponent implements OnInit {

    public withdrawalForm: FormGroup;
    public solstreamBalance = null;
    public withdrawFee = WITHDRAW_FEE_solstream;

    public isLoading = true;
    public notEnoughBalance = false;
    public showSummary = false;
    public showError = false;

    constructor(
        private earningService: EarningsService,
        private withdrawService: EarningsWithdrawService,
        private localStorageService: LocalStorageService
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.getsolstreamBalance();
        this.addWalletAddress();
    }

    withdrawsolstream(): void {
        const { amount, wallet } = this.withdrawalForm.value;

        this.withdrawalForm.markAllAsTouched();

        if (this.withdrawalForm.valid && this.hasEnoughBalance(amount)) {
            this.withdrawService.withdraw(amount, wallet).subscribe(
                () => this.showSummary = true,
                err => {
                    console.error(err);
                    this.showError = true;
                }
            );
        }
    }

    private addWalletAddress(): void {
        const wallet = this.localStorageService.getSecurityUserName();

        this.withdrawalForm?.get('wallet').setValue(wallet);
    }

    private createForm(): void {
        this.withdrawalForm = new FormGroup({
            amount: new FormControl('',
                Validators.compose([Validators.required, Validators.min(0.01)])
            ),
            wallet: new FormControl('',
                Validators.compose([Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{40}$/g)])
            ),
        });
    }

    private getsolstreamBalance(): void {
        this.earningService.getTotalEarningsV3().subscribe(data => {
            this.solstreamBalance = data.earnings;
            this.isLoading = false;
        });
    }

    private hasEnoughBalance(withdrawAmount: string): boolean {
        if (Number(withdrawAmount) + this.withdrawFee <= this.solstreamBalance) {
            this.notEnoughBalance = false;
            return true;
        } else {
            this.notEnoughBalance = true;
            return false;
        }
    }

}
