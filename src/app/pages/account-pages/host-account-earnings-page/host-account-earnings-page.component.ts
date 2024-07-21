import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AccountEarningsRedeenDialogComponent} from './redeem-dialog/redeem-dialog.component';
import {Observable, Subscription} from 'rxjs';
import {FeatureToggleService} from '../../../_core/services/feature-toggle.service';
import {WITHDRAW_FEATURE} from '../../../_core/constants/features';
import {EarningsService} from '../../../_core/services/earnings.service';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import { AccountEarningWithdrawalsTabComponent } from './tabs/withdrawals/withdrawals.component';

@Component({
  selector: 'app-host-earnings',
  templateUrl: './host-account-earnings-page.component.html',
  styleUrls: ['./host-account-earnings-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountEarningsComponent implements OnInit, OnDestroy {

    @ViewChild(AccountEarningWithdrawalsTabComponent) withdrawalTab: AccountEarningWithdrawalsTabComponent;

    public solstreamBalance = 0;
    public isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

    private modalOpen = false;
    private modalSubscription: Subscription;

    constructor(
        private dialog: MatDialog,
        private earningService: EarningsService,
        private featureToggleService: FeatureToggleService,
        private breakpointObserver: BreakpointObserver
    ) {}

    ngOnInit(): void {
        this.getsolstreamBalance();
    }

    ngOnDestroy(): void {
        this.modalSubscription?.unsubscribe();
    }

    openModal(): void {
        if (this.modalOpen) { return; }

        const dialogRef = this.dialog.open(AccountEarningsRedeenDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
        });

        const smallDialogSubscription = this.isExtraSmall.subscribe(size => {
            if (size.matches) {
                dialogRef.updateSize('100%', '100%');
            } else {
                dialogRef.updateSize('500px');
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            smallDialogSubscription.unsubscribe();
            this.withdrawalTab.refreshData();
            this.getsolstreamBalance();
            this.modalOpen = false;
        });

        this.modalOpen = true;
    }

    featureEnabled(): boolean {
        return this.featureToggleService.featureEnabled(WITHDRAW_FEATURE);
    }

    private getsolstreamBalance(): void {
        this.earningService.getTotalEarningsV3().subscribe(data => {
            this.solstreamBalance = data.earnings;
        });
    }
}

