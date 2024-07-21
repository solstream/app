import {Injectable} from '@angular/core';
import {User} from '../../pages/admin-pages/admin.component';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PtvUserService {
    private readonly baseUrl = environment.privateAzure;

    constructor(private httpClient: HttpClient) {
    }

    getCurrentUserLikes(): Observable<string> {
        return this.httpClient.get<string>(`${this.baseUrl}/current-user/likes`);
    }

    // TODO post with body
    setRole(user: User, role: string): Observable<User[]> {
        return this.httpClient.post<User[]>(`${this.baseUrl}/users/${user.id}/role/${role}`, null);
    }

    deleteUser(id: number): Observable<User> {
        return this.httpClient.delete<User>(`${this.baseUrl}/users/${id}`);
    }

    getUserByName(userName: string): Observable<User> {
        return this.httpClient.get<User>(`${this.baseUrl}/user-by-name/${userName}`);
    }

}
