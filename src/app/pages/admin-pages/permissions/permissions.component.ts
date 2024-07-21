import {Component, OnInit} from '@angular/core';
import {PtvUserService} from '../../../_core/services/ptv-user.service';
import {User} from '../admin.component';
import {ChannelsService} from '../../../_core/services/channels.service';
import {FormControl} from '@angular/forms';
import {debounceTime, map} from 'rxjs/operators';
import {AccountWithUserModel} from '../../../_core/model/accountModel';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

    loading = true;
    roles = ['ADMIN', 'ORACLE', 'USER'];
    accounts: AccountWithUserModel[];
    search = new FormControl('');

    constructor(private userService: PtvUserService,
                private currentUser: CurrentUserState,
                private channelService: ChannelsService) {
    }

    ngOnInit(): void {
        this.search.valueChanges.pipe(debounceTime(500)).subscribe(val => {
            this.getUsers(val);
        });
        this.getUsers();
    }

    private getUsers(search: string = ''): void {
        this.loading = true;
        this.channelService.getAccountsWithUser(search)
            .pipe(map((resp) => {
                resp.map(account => {
                    if (!account.user.createDate) {
                        account.user.createDate = 'not-set';
                    }
                    if (!account.user.lastAction) {
                        account.user.lastAction = 'not-set';
                    }
                });
                return resp;
            }))
            .subscribe((rooms) => {
                this.accounts = rooms;
                this.loading  = false;
            });
    }

    isCurrentUser(username: string): boolean {
        return this.currentUser.currentUser$.value.username === username;
    }

    roleUpdated(user: User, role: any): void {
        // this.userService.setRole(user, role.value).subscribe(() => {
        //     this.channelService.getAllRoomsWithUser().subscribe((rooms) => {
        //         this.allUsers = rooms;
        //         this.filterUsers(this.search.value);
        //     });
        // });
    }

    delete(user: User): void {
        this.userService.deleteUser(user.id).subscribe(() => {
            this.accounts = this.accounts.filter(u => u.user.id !== user.id);

        });
    }
}
