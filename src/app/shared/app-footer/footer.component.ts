import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    constructor(public mob: DeviceDetectorService) {
    }
    about = [
        {name: 'Become A Premium Creator', url: 'creator-benefits'},
        {name: 'Become A Sponsor', url: '',  blank: true },
        {name: 'Become A Moderator', url: '', blank: true},
        {name: 'How To Earn', url: 'how-to-earn'}
    ];
    services = [
        {name: 'Community Guidelines', url: 'community-guidelines'},
        {name: 'WhitePaper', url: 'https://docs.solstream.io'},
        {name: 'Blog', url: 'https://solstream.medium.com'},
        // {name: 'Contact', url: ''},
    ];

    ngOnInit(): void {
    }

}
