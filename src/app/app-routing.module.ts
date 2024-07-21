import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanActivateRouteInterceptor} from './_core/can-activate-route.inteceptor';
import {AdminComponent} from './pages/admin-pages/admin.component';
import {AccountCreateEditComponent} from './pages/account-pages/host-account-data-form-page/account-create-edit.component';
import {AccountLiveComponent} from './pages/account-pages/host-account-live-page/account-live.component';
import {HostTvComponent} from './pages/account-pages/host-account-edit-page/host-tv.component';
import {HomePageComponent} from './deprecated/home-page/home-page.component';
import {AllAccountsComponent} from './pages/admin-pages/all-accounts/all-accounts.component';
import {PermissionsComponent} from './pages/admin-pages/permissions/permissions.component';
import {SearchComponent} from './pages/search/search.component';
import {MaintenanceComponent} from './pages/maintenance/maintenance.component';
import {ApplicationComponent} from './pages/admin-pages/application/application.component';
import {ChannelsPageComponent} from './pages/channel-pages/channels-page/channels-page.component';
import {TermsAndConditionsComponent} from './pages/info-pages/terms-conditions/terms-and-conditions.component';
import {PrivacyPolicyComponent} from './pages/info-pages/privacy-policy/privacy-policy.component';
import {CookiePolicyComponent} from './pages/info-pages/cookie-policy/cookie-policy.component';
import {CreatorBenefitsComponent} from './pages/info-pages/creator-benefits/creator-benefits.component';
import {CommunityGuidelinesComponent} from './pages/info-pages/community-guidelines/community-guidelines.component';
import {TopicsComponent} from './pages/admin-pages/topics/topics.component';
import {WatchToEarnPageComponent} from './pages/admin-pages/watch-to-earn-page/watch-to-earn-page.component';
import {AccountEarningsComponent} from './pages/account-pages/host-account-earnings-page/host-account-earnings-page.component';
import {ResetPasswordComponent} from './@mvp/login-popup/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './@mvp/login-popup/forgot-password/forgot-password.component';
import { HowToEarnComponent } from './pages/info-pages/how-to-earn/how-to-earn.component';
import {WithdrawalsComponent} from './pages/admin-pages/withdrawals/withdrawals.component';
import {FileCoinComponent} from './pages/admin-pages/file-coin/file-coin.component';
import {ObsComponent} from './pages/info-pages/obs/obs.component';
import {PopsComponent} from './pages/pops-page/pops.component';
import {InvitationCodesComponent} from './pages/admin-pages/invitation-codes/invitation-codes.component';
import {HomePageV2Component} from './pages/home-page-v2/home-page-v2.component';
import {ProfileComponent} from "./pages/account-pages/profile/profile.component";

const appRoutes: Routes = [
    {path: 'maintenance', component: MaintenanceComponent},
    {path: '', component: HomePageV2Component},
    {path: 'search', component: SearchComponent},
    {path: 'home', component: ChannelsPageComponent},
    {
        path: 'profile',
        component: ProfileComponent, // another child route component that the router renders
    },
    {path: 'home/room/:roomName', component: ChannelsPageComponent},
    {path: 'host/:roomName/room', component: HostTvComponent},
    {path: 'host/rooms/new', component: AccountCreateEditComponent, canActivate: [CanActivateRouteInterceptor]},
    {path: 'host/rooms/live/:roomId', component: AccountLiveComponent, canActivate: [CanActivateRouteInterceptor]},
    {path: 'host/rooms/edit/:roomId', component: AccountCreateEditComponent, canActivate: [CanActivateRouteInterceptor]},
    {path: 'host/earnings', component: AccountEarningsComponent, canActivate: [CanActivateRouteInterceptor]},
    {path: 'pops/:id', component: PopsComponent},
    {path: 'admin/manage/room/:roomName', component: HostTvComponent},
    {
        path: 'admin/manage', component: AdminComponent, canActivate: [CanActivateRouteInterceptor],
        children: [
            {path: 'room/:roomName', component: HostTvComponent},
            {
                path: 'accounts', // child route path
                component: AllAccountsComponent, // child route component that the router renders
            },
            {
                path: 'permissions',
                component: PermissionsComponent, // another child route component that the router renders
            },
            {
                path: 'withdrawals',
                component: WithdrawalsComponent, // another child route component that the router renders
            },
            {
                path: 'watch-to-earn',
                component: WatchToEarnPageComponent, // another child route component that the router renders
            },
            {
                path: 'application',
                component: ApplicationComponent, // another child route component that the router renders
            },
            {
                path: 'file-coin',
                component: FileCoinComponent, // another child route component that the router renders
            },
            {
                path: 'topics',
                component: TopicsComponent, // another child route component that the router renders
            },
            {
                path: 'invitation-codes',
                component: InvitationCodesComponent, // another child route component that the router renders
            },
            {
                path: '**', redirectTo: 'accounts', pathMatch: 'full'
            },

        ]
    },
    {path: 'admin/new-account', component: AccountCreateEditComponent, canActivate: [CanActivateRouteInterceptor]},
    {path: 'reset-password/:token', component: HomePageComponent},
    {path: 'terms-and-conditions', component: TermsAndConditionsComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'cookie-policy', component: CookiePolicyComponent},
    {path: 'creator-benefits', component: CreatorBenefitsComponent},
    {path: 'community-guidelines', component: CommunityGuidelinesComponent},
    {path: 'how-to-earn', component: HowToEarnComponent},
    {path: 'setup-obs', component: ObsComponent},
    {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
