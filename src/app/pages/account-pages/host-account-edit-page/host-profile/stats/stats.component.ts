import {Component, Input, OnInit} from '@angular/core';
import {StatsService, StreamingStats} from './stats.service';
import {AccountModel} from '../../../../../_core/model/accountModel';

// const data = {
//     chart: {
//         caption: 'Your streaming activity on SYOU',
//         yaxisname: 'Time (in minutes)',
//         // subcaption: '[2005-2016]',
//         numbersuffix: ' min',
//         rotatelabels: '1',
//         setadaptiveymin: '1',
//         theme: 'candy',
//         bgColor: '#18181b',
//         bgAlpha: '100'
//     },
//     data: [
//         {
//             label: 'September',
//             value: '809'
//         },
//         {
//             label: 'October',
//             value: '809'
//         },
//         {
//             label: 'November',
//             value: '900'
//         }
//     ]
// };


@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
    //
    // public lineChartData: ChartDataset[] = [
    //     { data: [65, 59, 80, 81, 56, 55, 40], label: 'wqswsqsqsqq' },
    //     // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    //     // { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
    // ];
    // public lineChartLabels: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    // public lineChartOptions: any = {
    //     plugins: {
    //         legend: {
    //             display: false
    //         }
    //     },
    //     responsive: true,
    //     scales: {
    //         // We use this empty structure as a placeholder for dynamic theming.
    //         xAxes: [{}],
    //         yAxes: [
    //             {
    //                 id: 'y-axis-0',
    //                 position: 'left',
    //             },
    //             {
    //                 id: 'y-axis-1',
    //                 position: 'right',
    //                 gridLines: {
    //                     color: 'rgba(255,0,0,0.3)',
    //                 },
    //                 ticks: {
    //                     fontColor: 'red',
    //                 }
    //             }
    //         ]
    //     },
    //     annotation: {
    //         annotations: [
    //             {
    //                 type: 'line',
    //                 mode: 'vertical',
    //                 scaleID: 'x-axis-0',
    //                 value: 'March',
    //                 borderColor: 'orange',
    //                 borderWidth: 2,
    //                 label: {
    //                     enabled: true,
    //                     fontColor: 'orange',
    //                     content: 'LineAnno'
    //                 }
    //             },
    //         ],
    //     },
    // };
    // public lineChartColors: any[] = [
    //     { // grey
    //         backgroundColor: 'rgba(148,159,177,0.2)',
    //         borderColor: 'rgba(148,159,177,1)',
    //         pointBackgroundColor: 'rgba(148,159,177,1)',
    //         pointBorderColor: '#fff',
    //         pointHoverBackgroundColor: '#fff',
    //         pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    //     },
    //     { // dark grey
    //         backgroundColor: 'rgba(77,83,96,0.2)',
    //         borderColor: 'rgba(77,83,96,1)',
    //         pointBackgroundColor: 'rgba(77,83,96,1)',
    //         pointBorderColor: '#fff',
    //         pointHoverBackgroundColor: '#fff',
    //         pointHoverBorderColor: 'rgba(77,83,96,1)'
    //     },
    //     { // red
    //         backgroundColor: 'rgba(255,0,0,0.3)',
    //         borderColor: 'red',
    //         pointBackgroundColor: 'rgba(148,159,177,1)',
    //         pointBorderColor: '#fff',
    //         pointHoverBackgroundColor: '#fff',
    //         pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    //     }
    // ];
    // public lineChartLegend = true;
    // // public lineChartType: ChartType = 'line';
    // // public lineChartPlugins = [pluginAnnotations];




    // width = 200;
    // height = 400;
    // type = 'area2d';
    // dataFormat = 'json';
    // dataSource = data;

    @Input()
    room: AccountModel;
    stats: StreamingStats;

    constructor(private statsService: StatsService) {
    }

    ngOnInit(): void {
      if (this.room.id) {
        this.statsService.getStats(this.room.id).subscribe(rez => {
          this.stats = rez;
        });
      }
    }

}
