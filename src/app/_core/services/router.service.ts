import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class RouterService {

    constructor(private router: Router) {
    }

    navigateToMyTv(roomName: string): void {
        this.router.navigate([`host/${roomName}/room`]);
    }

    navigateMyTvAdminMode(roomName: string): void {
        this.router.navigate([`admin/manage/room/${roomName}`]);
    }

    navigateToReadOnlyRoom(userName: string): void {
        this.router.navigate([`home/room/${userName}`]);
    }

    navigateToEditProfileNew(roomId: string): void {
        debugger
        this.router.navigate([`/profile`]);
    }
    navigateToEditProfile(roomId: string): void {
        this.router.navigate([`/host/rooms/edit/${roomId}`]);
    }

    navigateToNewRoom(): void {
        this.router.navigate([`host/rooms/new`]);
    }

    navigateToStartLive(roomId: string): void {
        this.router.navigate(['/host/rooms/live/' + roomId]);
    }

    navigateHome(): void {
        this.router.navigate([``]);
    }

    navigateToAdmin(): void {
        this.router.navigate([`admin/manage`]);
    }

    navigateToTheRoom(roomName: string): void {
        this.router.navigate([`/home/room/${roomName}`]);
    }

    navigateToPop(id: string): void {
        this.router.navigate([`/pops/${id}`]);
    }

    navigateToTheRoomAutoPlayPodcast(roomName: string, podcastId: string): void {
        this.router.navigate([`/home/room/${roomName}`], { queryParams: { podcastId } });
    }

    navigateToTheRoomAutoPlayVideo(roomName: string, videoId: string): void {
        this.router.navigate([`/home/room/${roomName}`],  { queryParams: { videoId } });
    }

    navigateToLiveRoom(roomName: string): void {
        this.router.navigate([`/home/${roomName}`]);
    }

    goToHowToEarn(): void {
        this.router.navigate([`how-to-earn`]);
    }

    getUrlParts(): string[] {
        return this.router.url.split('/');
    }

    navigateToSocialLogin(): void {
        this.router.navigate(['social-login']);
    }

    navigateToEmailLogin(): void {
        this.router.navigate(['email-login']);
    }

    navigateToEarnings(): void {
        this.router.navigate(['host/earnings']);
    }
}
