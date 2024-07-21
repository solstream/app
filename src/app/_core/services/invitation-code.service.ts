import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvitationCodeService {

    constructor(private client: HttpClient) {
    }

    getInvitationKeys(): Observable<InvitationCodeModel[]> {
        return this.client.get<InvitationCodeModel[]>(environment.privateAzure + '/invitation-code');
    }

    deleteInvitation(invitationCode: string): Observable<void> {
        return this.client.delete<void>(environment.privateAzure + `/invitation-code/${invitationCode}`);
    }

    saveInvitationKey(code: string, usageLimit: number): Observable<InvitationCodeModel[]> {
        return this.client.post<InvitationCodeModel[]>(environment.privateAzure + '/invitation-code', {code, usageLimit});
    }

}

export interface InvitationCodeModel {
    code: string;
    usageLimit: number;
    used: number;
    createDate: Date;
}
