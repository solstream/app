import { Component, OnInit, Input } from '@angular/core';
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import de from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/de";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    @Input() id: string;
    @Input() isOwnProfile: boolean;

    user: any = {};
    createdAt: string;
    dob: string;
    userName;

    private apiUrl = environment.newMongo + '/api/v1/users'; // Update the apiUrl

    constructor(private userService: UserService,
                private httpClient: HttpClient) { }

    ngOnInit(): void {
        this.userName = localStorage.getItem('ptv_user') || 'User Name';

        const apiUrl = environment.newMongo + '/api/v1/users';
        this.httpClient.get<any[]>(apiUrl).subscribe(users => {
            const testUserId = localStorage.getItem('userId');
            // @ts-ignore
            const currentUser = users.users.find(user => user._id === testUserId);
            if (currentUser) {
                this.user = currentUser;
                this.createdAt = `Joined on ${this.getDateString(currentUser.createdAt)}`;
                this.dob = this.getDateString(currentUser.dob);
                // If you need to save the profileImage to localStorage or handle it differently
                localStorage.setItem('profileImage', currentUser.profileImage);
            }
        });
    }


    sendMessage(): void {
        // Add logic to send message
    }

    logout(): void {
        this.userService.logout();
    }

    private getDateString(date: string): string {
        // Your date formatting logic here
        return new Date(date).toLocaleDateString();
    }
    uploadImage(event: any): void {
        debugger
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            // Assuming you have an authentication token that needs to be included in your request
            // You need to replace 'YourAuthTokenHere' with the actual logic to retrieve your auth token
            // const headers = new HttpHeaders({
            //     'Authorization': `Bearer YourAuthTokenHere`
            // });
            debugger
            this.httpClient.post<any>(`${this.apiUrl}/dp`, formData)
                .subscribe({
                    next: (response) => {
                        console.log(response);
                        this.user.profileImage = response.user.profileImage; // Update the user's profile image on the client side
                        // You might want to refresh the user data here or show a success message
                    },
                    error: (error) => {
                        console.error('Error uploading image:', error);
                        // Handle error
                    }
                });
        }
    }
}


