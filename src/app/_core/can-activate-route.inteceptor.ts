import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {LocalStorageService} from './services/auth-store.service';
import {VerifyJwtService} from './services/verify-jwt.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CanActivateRouteInterceptor implements CanActivate {

    constructor(private router: Router,
                private verifyJwtService: VerifyJwtService,
                private authStore: LocalStorageService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        const can = this.authStore.hasCredentials();
        if (!can) {
            // TODO SECURITY
            this.router.navigate(['login']);
            return false;
        }
        return this.verifyJwtService.verifyJwt().pipe(map(() => true));
    }
}
