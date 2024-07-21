import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ApiStatusService} from './_core/services/api-status.service';
import {CurrentUserState} from './_core/services/current-user-state.service';
import {RouterService} from './_core/services/router.service';
import {FeatureToggleService} from './_core/services/feature-toggle.service';
import {InvitationCodeService} from './_core/services/invitation-code.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    ready = false;

    constructor(private router: Router, private statusService: ApiStatusService,
                private currentUserService: CurrentUserState,
                private routerService: RouterService) {
    }

    ngOnInit(): void {
        this.currentUserService.fetchCurrentUserData().subscribe((user) => {
            this.ready = true;
            this.validateIfUserHasAccount();
            this.router.events.pipe(filter(event => event instanceof NavigationStart))
                .subscribe((event: NavigationStart) => {
                if (event.url !== '/maintenance' && event.url.indexOf('admin') === -1) {
                    this.checkApiStatus();
                }
                if (event.url !== '/host/rooms/new' ) {
                    this.validateIfUserHasAccount();
                }
            });
        });

    }

    private checkApiStatus(): void {
        // this.statusService.getStatus().subscribe((rez) => {
        //     if (rez.maintenance) {
        //         this.router.navigate(['maintenance']);
        //     }
        // });
    }

    private validateIfUserHasAccount(): void {
        const currentUser = this.currentUserService.currentUser$.value;
        const userRoom = this.currentUserService.currentUserAccount$.value;
        if (currentUser && userRoom === null && currentUser.role !== 'ADMIN') {
            this.routerService.navigateToNewRoom();
        }
    }
}
