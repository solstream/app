import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RegistrationModalState {

    private modal$ = new BehaviorSubject<AuthModalState>(null);

    constructor() {
    }

    openModal(step: LoginPopupState, payload?: ModalPayload): void {
        this.modal$.next({state: step, payload});
    }

    closeModal(): void {
        this.modal$.next({state: LoginPopupState.CLOSE});
    }

    getModalState(): Observable<AuthModalState> {
        return this.modal$.pipe(filter((v) => v !== null));
    }
}

export enum LoginPopupState {
    OPEN = 'open',
    CLOSE = 'close',
    WELCOME = 'welcome',
    CREATE_ACCOUNT = 'create-account',
    LOGIN = 'login',
    LOGIN_EMAIL = 'login-email',
    FORGOT_PASSWORD = 'forgot-password',
    REGISTER_EMAIL = 'register-email',
    RESET_PASSWORD = 'reset-password',
    EDIT_ACCOUNT = 'edit-account'
}

export interface AuthModalState {
    state: LoginPopupState;
    payload?: ModalPayload;
}

export interface ModalPayload {
    invitationCode?: string;
    error?: boolean;
    errorMessage?: string;
}

