import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {User} from '../../pages/admin-pages/admin.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {LocalStorageService} from './auth-store.service';
import {ChannelsService} from './channels.service';
import {RouterService} from './router.service';
import {AccountModel} from '../model/accountModel';
import {VideoService} from './videos.service';
import WalletConnect from '@walletconnect/browser';

@Injectable({
    providedIn: 'root'
})
export class CurrentUserState {
    private readonly currentUserBaseUrl = environment.publicAzure;

    currentUser$ = new BehaviorSubject<User>(null);
    currentUserAccount$ = new BehaviorSubject<AccountModel>(null);
    currentUserLikes$ = new BehaviorSubject<string[]>([]);
    currentUserSubscriptions$ = new BehaviorSubject<string[]>([]);
    currentUserBans$ = new BehaviorSubject<string[]>([]);

    constructor(private httpClient: HttpClient,
                private videoService: VideoService,
                private channelService: ChannelsService,
                private routerService: RouterService,
                private authService: LocalStorageService) {
    }

    fetchCurrentUserData(): Observable<User> {
        const userName = this.authService.getSecurityUserName();
        console.log('USERNAME', userName);
        if (userName) {
            return this.httpClient.get<User>(`${this.currentUserBaseUrl}/current-user`).pipe(
                tap(user => this.currentUser$.next(user)),
                switchMap((user) => {
                    // TODO returns more user data with one call, consider using
                    // this.httpClient.get<User>(`${this.currentUserBaseUrl}/v2/current-user`).subscribe();
                    // this.httpClient.get<User>(`${this.currentUserBaseUrl}/v3/current-user`).subscribe();
                    // TODO might be a testing left over, double check.
                    this.httpClient.get<User>(environment.ipfsService + '/auth/verify2').subscribe();
                    if (user === null) {
                        this.logout();
                        return of(null);
                    }
                    return this.channelService.getChannelByUserName(user.username).pipe(
                        tap(room => this.currentUserAccount$.next(room)),
                        tap(() => this.fetchUserLikes().subscribe()),
                        tap(() => this.fetchUserSubscriptions().subscribe()),
                        tap(() => this.fetchUserBans().subscribe()),
                        map(() => user));
                })
            );

        }
        this.currentUser$.next(null);
        return of(null);
    }
    fetchCurrentUserDataMocked(): Observable<User> {
        const fakeUserName = 'mockUser';
        console.log('USERNAME', fakeUserName);

        // Assuming the username is always present for the mock
        if (fakeUserName) {
            // Simulate retrieving user data
            const fakeUser: User = {
                // @ts-ignore
                userId: '123',
                username: fakeUserName,
                email: 'mockuser@example.com',
                // add other necessary user fields here
            };

            // Normally here you would call the backend, but we are directly returning the fake user
            this.currentUser$.next(fakeUser);

            // Simulating additional operations that would normally depend on the user data
            // @ts-ignore
            const fakeChannel = {
                channelId: 'channel123',
                channelName: 'MockChannel',
                // Add other necessary channel fields
            };

            // @ts-ignore
            this.currentUserAccount$.next(fakeChannel);

            // You can add more mocks for fetchUserLikes, fetchUserSubscriptions, fetchUserBans here

            // Finally, return the fake user as an observable
            return of(fakeUser);
        }

        // If no username, simulate a logout or equivalent action
        this.currentUser$.next(null);
        return of(null);
    }


    fetchUserLikes(): Observable<string[]> {
       return this.httpClient.get<string[]>(environment.privateAzure + '/current-user/likes').pipe(
           tap(likedVidIds => this.currentUserLikes$.next(likedVidIds))
       );
    }

    fetchUserSubscriptions(): Observable<string[]> {
       return this.httpClient.get<string[]>(environment.privateAzure + '/current-user/subscriptions').pipe(
           tap(subscribedChannelsIds => this.currentUserSubscriptions$.next(subscribedChannelsIds))
       );
    }

    fetchUserBans(): Observable<string[]> {
       return this.httpClient.get<string[]>(environment.privateAzure + '/current-user/bans').pipe(
           tap(bannedChannelIds => this.currentUserBans$.next(bannedChannelIds))
       );
    }

    logout(): void {
        // const bridge = 'https://bridge.walletconnect.org';
        // const connector = new WalletConnect({ bridge });
        // if (connector) { // if trustwallet connected
        //     connector.killSession();
        // }
        this.currentUser$.next(null);
        this.currentUserAccount$.next(null);
        this.authService.removeSecrets();
        this.routerService.navigateHome();
    }

    isAdmin(): boolean {
        return this.currentUser$.value?.role === 'ADMIN';
    }

    isLoggedIn(): boolean {
        return Boolean(this.currentUser$.value) && Boolean(this.currentUserAccount$.value);
    }

    getCurrentUserRoom(): AccountModel {
        return this.currentUserAccount$.value;
    }

    getCurrentUserRoom$(): Observable<AccountModel> {
        return this.currentUserAccount$.pipe(filter(account => account !== null));
    }

    getAccountName(): string {
        return this.currentUserAccount$.value?.roomName;
    }

    getNonLoggedInUserName(): string {
        return this.authService.getUserNameObserver();
    }

    getUserLikes(): string[] {
        return this.currentUserLikes$.value;
    }

    getUserSubscriptions(): string[] {
        return this.currentUserSubscriptions$.value;
    }

    isUserBanned(accountId: string): boolean {
        return this.currentUserBans$.value.indexOf(accountId) > -1;
    }

    toggleLike(videoId: string): Observable<void> {
        if (this.getUserLikes().indexOf(videoId) > -1) {
           return this.videoService.unlikeVideo(videoId).pipe(tap(() => {
                const videoIdx = this.getUserLikes().indexOf(videoId);
                this.getUserLikes().splice(videoIdx);
            }));
        }
        return this.videoService.likeVideo(videoId).pipe(tap(() => {
            this.getUserLikes().push(videoId);
        }));
    }

    toggleSubscribe(channelId: string): Observable<void> {
        if (this.getUserSubscriptions().indexOf(channelId) > -1) {
            return this.channelService.unSubscribeFromChannel(channelId).pipe(tap(() => {
                const idx = this.getUserSubscriptions().indexOf(channelId);
                this.getUserSubscriptions().splice(idx);
            }));
        }
        return this.channelService.subscribeToChannel(channelId).pipe(tap(() => {
            this.getUserSubscriptions().push(channelId);
        }));
    }

}
