import {Component, OnInit} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {PtvUserService} from '../../../_core/services/ptv-user.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {ChannelsService} from '../../../_core/services/channels.service';
import {User} from '../admin.component';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import {AccountModel} from '../../../_core/model/accountModel';

@Component({
    selector: 'app-all-accounts',
    templateUrl: './all-accounts.component.html',
    styleUrls: ['./all-accounts.component.scss']
})
export class AllAccountsComponent implements OnInit {

    users: User[] = [];
    rooms: AccountModel[] = [];
    // allRooms: RoomModel[] = [];
    search = new FormControl('');
    loading = true;

    constructor(private userService: PtvUserService,
                private router: Router,
                private authStore: LocalStorageService,
                private currentUserService: CurrentUserState,
                private roomService: ChannelsService) {

    }

    ngOnInit(): void {
        const userName = this.authStore.getSecurityUserName();
        this.currentUserService.fetchCurrentUserData().subscribe(() => {
            this.userService.getUserByName(userName).subscribe(rez => {
                if (rez.role !== 'ADMIN') {
                    this.router.navigate(['']);
                    return;
                }
                this.getAccounts();
            });
        });
        this.search.valueChanges.pipe(debounceTime(500)).subscribe(val => {
           this.getAccounts(val);
        });
    }

    private getAccounts(search?: string): void {
        this.loading = true;
        this.roomService.search(search).subscribe(rooms => {
            this.rooms = rooms;
            this.loading = false;
        });
    }

    newRoom(): void {
        this.router.navigate(['admin/new-account']);
    }

}
