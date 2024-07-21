import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';
import {EarningsWithdrawService, WithdrawalApiModel} from '../../../../../_core/services/earnings-withdraw.service';

@Component({
    selector: 'app-account-earnings-withdrawals-tab',
    templateUrl: 'withdrawals.component.html',
    styleUrls: ['./withdrawals.component.scss']
})
export class AccountEarningWithdrawalsTabComponent implements OnInit {

    public isLoadingResults = true;
    public hideShowMore = false;
    public withdrawals: WithdrawalApiModel[] = [];
    public displayedColumns: string[] = ['amount', 'date' , 'status'];

    private currentPage = 0;
    private limit = 10;

    @ViewChild(MatTable) table: MatTable<any>;

    constructor(
        private earningsWithdrawService: EarningsWithdrawService
    ) {}

    ngOnInit(): void {
        this.getWithdrawals();
    }

    addData(): void {
        this.currentPage = this.currentPage += 1;
        this.getWithdrawals();
    }

    getWithdrawals(): void {
        this.earningsWithdrawService.getWithdrawals(this.currentPage, this.limit)
            .subscribe(res => {
                this.withdrawals = res.content;
                this.isLoadingResults = false;
                this.table.renderRows();

                if (this.isLastPage(res.pageNumber, res.totalPages)) {
                    this.hideShowMore = true;
                }
            });
    }

    isLastPage(pageNumber: number, totalPages: number): boolean {
        return totalPages === 0 || (pageNumber + 1) === totalPages;
    }

    refreshData(): void {
        this.isLoadingResults = true;
        this.currentPage = 0;

        this.getWithdrawals();
    }
}
