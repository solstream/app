import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VerifyJwtService {
    constructor(private client: HttpClient) {
    }
    verifyJwtOld(): Observable<any> {
        return this.client.get(environment.privateAzure + '/verify');
    }
    verifyJwt(): Observable<any> {
        const mockResponse = {
            success: true,
            message: 'JWT verification successful.',
            data: {
                // Include any relevant data expected from the real response
            }
        };

        return of(mockResponse);
    }
}
