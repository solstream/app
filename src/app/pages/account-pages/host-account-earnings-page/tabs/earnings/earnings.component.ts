import {Component, OnInit, ViewChild} from '@angular/core';
import {
    ActionType,
    actionTypesMap,
    EarningLedgeV3,
    EarningsService
} from '../../../../../_core/services/earnings.service';
import {MatTable} from '@angular/material/table';

@Component({
    selector: 'app-account-earnings-earnings-tab',
    templateUrl: 'earnings.component.html',
    styleUrls: ['./earnings.component.scss']
})
export class AccountEarningsEarningsTabComponent implements OnInit {

    public isLoadingResults = true;
    public hideShowMore = false;
    public displayedColumns: string[] = ['videoTitle', 'earnings', 'type', 'date'];
    public earnings: EarningLedgeV3[] = [];

    private currentPage = 0;
    private limit = 10;

    @ViewChild(MatTable) table: MatTable<any>;

    constructor(
        private earningService: EarningsService
    ) {}

    ngOnInit(): void {
        this.getEarnings();
    }

    addData(): void {
        this.currentPage = this.currentPage += 1;
        this.getEarnings();
    }

    isLastPage(pageNumber: number, totalPages: number): boolean {
        return totalPages === 0 || (pageNumber + 1) === totalPages;
    }

    mapType(type: ActionType): string {
        return actionTypesMap[type];
    }

    private getEarnings(): void {
        this.earningService.getEarningsV3(this.currentPage, this.limit)
            .subscribe(res => {
                this.earnings.push(...res.content);
                this.isLoadingResults = false;
                this.table.renderRows();

                if (this.isLastPage(res.pageNumber, res.totalPages)) {
                    this.hideShowMore = true;
                }
            });
    }
}
