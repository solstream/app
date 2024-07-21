import {Component, OnInit} from '@angular/core';
import {EarningLedgeV3, EarningsApiModel1, EarningsService} from '../../../_core/services/earnings.service';
import {EarningsAuditService, WteAuditEventApiModel} from '../../../_core/services/earnings-audit.service';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import {EarningsWithdrawService, WithdrawalApiModel} from '../../../_core/services/earnings-withdraw.service';

@Component({
    selector: 'app-watch-to-earn-page',
    templateUrl: './watch-to-earn-page.component.html',
    styleUrls: ['./watch-to-earn-page.component.scss']
})
export class WatchToEarnPageComponent implements OnInit {

    // Testing purposes only
    videoId = 'b1fb1e6e-9b7b-44aa-9811-7c8f06bfe846';

    logz: WteAuditEventApiModel[];
    earnings: EarningsApiModel1;
    earningsLedge: EarningLedgeV3[];
    withdrawals: WithdrawalApiModel[];

    constructor(private earningsService: EarningsService,
                private withdrawalService: EarningsWithdrawService,
                private cus: CurrentUserState,
                private earnAuditService: EarningsAuditService) {
    }

    ngOnInit(): void {
        this.getAudits();
        this.getEarnings();
        this.getWithDrawals();
    }

    earn(): void {
        this.earningsService.earnV3(this.videoId).subscribe(() => {
            this.getEarnings();
        });
    }

    getEarnings(): void {
        this.earningsService.getTotalEarningsV3().subscribe((rez) => {
            this.earnings = rez;
        });
        this.earningsService.getEarningsV3().subscribe(rez => {
            this.earningsLedge = rez.content;
        });
    }

    getWithDrawals(): void {
        this.withdrawalService.getWithdrawals().subscribe((rez) => {
            this.withdrawals = rez.content;
        });
    }

    withdraw(): void {
        const walletId = this.cus.currentUserAccount$.value.qrCode;
        this.withdrawalService.withdraw(0.01, walletId).subscribe(() => {
            this.getEarnings();
            this.getWithDrawals();
        });
    }

    reset(): void {
        this.earningsService.reset().subscribe(() => {
            this.getEarnings();
            this.getAudits();
        });
    }

    startVideo(): void {
        this.earnAuditService.auditVideoStart(this.videoId).subscribe(() => {
            this.getAudits();
        });
    }

    stopVideo(): void {
        this.earnAuditService.auditVideoStop(this.videoId).subscribe(() => {
            this.getAudits();
        });
    }

    getAudits(): void {
        this.earnAuditService.getAuditLogs(this.cus.getAccountName()).subscribe(rez => {
            this.logz = rez;
        });
    }

}
