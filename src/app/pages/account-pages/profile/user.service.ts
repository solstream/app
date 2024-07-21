import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    getUserById(id: string): Observable<any> {
        // Placeholder for your actual API call
        return this.http.get(`/api/users/${id}`);
    }

    logout(): void {
        // Handle logout logic here
    }

    sendMessage(userId: string, message: string): Observable<any> {
        // Placeholder for sending a message
        return this.http.post(`/api/messages`, { userId, message });
    }
}
