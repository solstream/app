import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AuditWithdrawal, WithdrawalsAuditService, WithdrawalStatus } from 'src/app/_core/services/withdrawals-audit.service';
import { WithdrawalChangeStatusDialog } from './dialog/change-status-dialog.component';
import { WithdrawalTransferDialog } from './dialog/transfer-dialog.component';

@Component({
    selector: 'app-admin-withdrawals-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']

})
export class WithdrawalsTableComponent implements OnInit {

    @Input() showEditOptions = false;
    @Input() showTransferOption = false;

    @Input() status: WithdrawalStatus;

    public dataSource: AuditWithdrawal[] = [];
    public displayedColumns: string[] = ['accountName', 'amount', 'date', 'status'];
    public isLoading = true;
    public hideShowMore = false;

    private currentPage = 0;
    private limit = 10;
    
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(private withdrawalService: WithdrawalsAuditService, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.getWithdrawals();

        if (this.showEditOptions || this.showTransferOption) {
            this.displayedColumns = [ ...this.displayedColumns, 'action'];
        }
    }

    addData(): void {
        this.currentPage = this.currentPage += 1;
        this.getWithdrawals();
    }

    getWithdrawals(): void {
        this.withdrawalService.getWithdrawals(this.status, null, this.currentPage, this.limit).subscribe(res => {
            this.dataSource.push(...res.content);
            this.isLoading = false;
            this.table.renderRows();

            if (this.isLastPage(res.pageNumber, res.totalPages)) {
                this.hideShowMore = true;
            }
        });
    }

    isLastPage(pageNumber: number, totalPages: number): boolean {
        return totalPages === 0 || (pageNumber + 1) === totalPages;
    }

    refresh(): void {
        this.isLoading = true;
        this.dataSource = [];
        this.hideShowMore = false;
        this.currentPage = 0;
        this.getWithdrawals();
    }

    openChangeStatusDialog(row, index): void {
        const { id, amount, accountName, created } = row;
        this.openDialog(WithdrawalChangeStatusDialog, index, { id, amount, accountName, created });
    }

    openTransferDialog(row, index): void {
        const { id, amount, accountName, created } = row;
        this.openDialog(WithdrawalTransferDialog, index, { id, amount, accountName, created });
    }

    openDialog(dialog, index, data): void {
        const dialogRef = this.dialog.open(dialog, {
            width: '450px',
            data: { ...data, action: null}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.action != null) {
                this.dataSource.splice(index, 1);
                this.table.renderRows();
            }
          });
    }

}
