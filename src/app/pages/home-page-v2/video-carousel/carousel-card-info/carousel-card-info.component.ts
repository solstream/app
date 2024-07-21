import {Component, Input} from '@angular/core';
import {RouterService} from '../../../../_core/services/router.service';
import {AccountModel} from '../../../../_core/model/accountModel';

@Component({
    selector: 'app-carousel-card-info',
    templateUrl: './carousel-card-info.component.html',
    styleUrls: ['./carousel-card-info.component.scss']
})
export class CarouselCardInfoComponent {

    @Input()
    channel: AccountModel;

    @Input()
    title: string;

    constructor(private routerService: RouterService) {
    }

    goToRoom(): void {
        this.routerService.navigateToTheRoom(this.channel.roomName);
    }

    goToChannel() {

    }

}
