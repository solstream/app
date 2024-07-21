import {Component, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-admin-withdrawals',
    templateUrl: './withdrawals.component.html',
    styleUrls: ['./withdrawals.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WithdrawalsComponent {
}

export enum WithdrawalActions {
    APPROVE = 'approve',
    REJECT = 'reject',
    TRANSFER = 'transfer',
    ERROR = 'error'
}

export interface DialogData {
    id: number;
    amount: number;
    accountName: string;
    created: string;
    action: WithdrawalActions;
}
