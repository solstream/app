import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {LocalStorageService} from './services/auth-store.service';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {CurrentUserState} from './services/current-user-state.service';

@Injectable({
    providedIn: 'root'
})
export class JWTInterceptorService implements HttpInterceptor {
    constructor(public auth: LocalStorageService, private router: Router, private user: CurrentUserState) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.indexOf('login') > -1) {
            return next.handle(request);
        }
        if (request.url.indexOf('api.voxeet.com') > -1) {
            return next.handle(request);
        }
        // if (request.url.indexOf('theta') > -1) {
        //     return next.handle(request);
        // }
        if (request.url.indexOf(environment.privateAzure) === -1 && request.url.indexOf(environment.ipfsService) === -1) {
            return next.handle(request);
        }
        if (this.auth.getToken()) {
            const apiToken = `Bearer ${this.auth.getToken()}`;
            request = request.clone({
                setHeaders: {
                    Authorization: apiToken
                }
            });
            if (this.auth.getWToken()) {
                const wToken = this.auth.getWToken();
                request = request.clone({
                    headers: request.headers.set(
                        'x-Key',
                        wToken
                    )
                });
            }
            if (request.url.indexOf(environment.ipfsService) > -1) {
                request = request.clone({
                    headers: request.headers.set(
                        'neo',
                        environment.neo
                    )
                });

            }
        }

        return this.continue(next, request);

    }

    private continue(next: HttpHandler, request: HttpRequest<any>): Observable<any> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.router.navigate(['']);
                }
                if (error.status === 403) {
                    if (request.url.indexOf('current-user') > -1) {
                        this.user.logout();
                        this.router.navigate(['']);
                        window.location.reload();
                    }
                }
                return throwError(error);
            })
        );
    }
}
