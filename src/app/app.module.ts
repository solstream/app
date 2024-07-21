import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ParticipantsComponent} from './pages/account-pages/host-account-live-page/participants-implement/participants.component';
import {CanActivateRouteInterceptor} from './_core/can-activate-route.inteceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AdminComponent} from './pages/admin-pages/admin.component';
import {JWTInterceptorService} from './_core/jwtinterceptor.service';
import {FullScreenComponent} from './@mvp/shared-components/stream-video/full-screen/full-screen.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {StreamVideoComponent} from './@mvp/shared-components/stream-video/stream-video.component';
import {ChatComponent} from './@mvp/shared-components/chat/chat.component';
import {NavBarComponent} from './@mvp/shared-components/nav-bar/nav-bar.component';
import {AccountCreateEditComponent} from './pages/account-pages/host-account-data-form-page/account-create-edit.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatRadioModule} from '@angular/material/radio';
import {AccountLiveComponent} from './pages/account-pages/host-account-live-page/account-live.component';
import {HostStreamComponent} from './pages/account-pages/host-account-live-page/host-stream/host-stream.component';
import {UserSettingsMenuComponent} from './@mvp/shared-components/buttons/user-settings-menu/user-settings-menu.component';
import {ChannelViewComponent} from './pages/channel-pages/channels-page/channel-view/channel-view.component';
import {MatCardModule} from '@angular/material/card';
import {PapeltvLogoComponent} from './@mvp/shared-components/papeltv-logo/papeltv-logo.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {ChannelDataComponent} from './@mvp/shared-components/channel-data/channel-data.component';
import {ChannelIconComponent} from './@mvp/shared-components/channel-icon/channel-icon.component';
import {
    RecentPodcastsComponent
} from './pages/account-pages/host-account-edit-page/host-profile/recent-channel-podcasts/recent-podcasts.component';
import {UploadedVideosComponent} from './pages/account-pages/host-account-edit-page/host-profile/uploaded-videos/uploaded-videos.component';
import {BioComponent} from './@mvp/shared-components/bio/bio.component';
import {HostTvComponent} from './pages/account-pages/host-account-edit-page/host-tv.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BioTextPipe} from './@mvp/shared-components/bio/bio-text.pipe';
import {HostStatsComponent} from './pages/account-pages/host-account-edit-page/host-stats/host-stats.component';
import {EditIconButtonComponent} from './@mvp/shared-components/buttons/edit-icon-button/edit-icon-button.component';
import {UploadIconButtonComponent} from './@mvp/shared-components/buttons/upload-icon-button/upload-icon-button.component';
import {VideoCardComponent} from './@mvp/shared-components/video-card/video-card.component';
import {DeleteIconButtonComponent} from './@mvp/shared-components/buttons/delete-icon-button/delete-icon-button.component';
import {PlayIconButtonComponent} from './@mvp/shared-components/buttons/play-icon-button/play-icon-button.component';
import {HomePageComponent} from './deprecated/home-page/home-page.component';
import {ChannelsComponent} from './deprecated/home-page/channels/channels.component';
import {ChannelCardComponent} from './deprecated/home-page/channels/channel-card/channel-card.component';
import {RoomData2Component} from './deprecated/home-page/channels/channel-card/room-data2/room-data2.component';
import {ImageComponent} from './deprecated/home-page/channels/channel-card/image/image.component';
import {
    UploadProgressBarComponent
} from './pages/account-pages/host-account-edit-page/host-profile/room-header/upload-video-modal/upload-progress-bar/upload-progress-bar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MessageDialogComponent} from './@mvp/shared-components/message-dialog/message-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {VideoPlayerComponent} from './@mvp/shared-components/video-card/video-player/video-player.component';
import {AdvertisementComponent} from './pages/home-page-v2/advertisement/advertisement.component';
import {VideoCarouselComponent} from './pages/home-page-v2/video-carousel/video-carousel.component';
import {FooterComponent} from './shared/app-footer/footer.component';
import {VideoItemComponent} from './pages/home-page-v2/video-carousel/video-record/video-item.component';
import {VideoItemListComponent} from './pages/home-page-v2/video-carousel/_deprecated/video-item-list/video-item-list.component';
import {CarouselCardInfoComponent} from './pages/home-page-v2/video-carousel/carousel-card-info/carousel-card-info.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PartnersComponent} from './deprecated/home-page/partners/partners.component';
import {WalletComponent} from './@mvp/shared-components/wallet/wallet.component';

import {MatIconModule} from '@angular/material/icon';

import {MatListModule} from '@angular/material/list';
import {AllAccountsComponent} from './pages/admin-pages/all-accounts/all-accounts.component';
import {PermissionsComponent} from './pages/admin-pages/permissions/permissions.component';
import {SearchComponent} from './pages/search/search.component';
import {MaintenanceComponent} from './pages/maintenance/maintenance.component';
import {ApplicationComponent} from './pages/admin-pages/application/application.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ChannelsPageComponent} from './pages/channel-pages/channels-page/channels-page.component';
import {HeartComponent} from './@mvp/shared-components/animations/heart/heart.component';
import {DonationReceivedComponent} from './@mvp/shared-components/interactions/donation-received/donation-received.component';
import {PrivacyPolicyComponent} from './pages/info-pages/privacy-policy/privacy-policy.component';
import {TermsAndConditionsComponent} from './pages/info-pages/terms-conditions/terms-and-conditions.component';
import {CookiesBarComponent} from './@mvp/shared-components/cookies-bar/cookies-bar.component';
import {CookiesBarModalComponent} from './@mvp/shared-components/cookies-bar/cookies-bar-modal/cookies-bar-modal.component';
import {CookiePolicyComponent} from './pages/info-pages/cookie-policy/cookie-policy.component';
import {MatMenuModule} from '@angular/material/menu';
import {TwitterComponent} from './@mvp/shared-components/social/twitter/twitter.component';
import {DemoDisclaimerComponent} from './@mvp/shared-components/demo-disclaimer/demo-disclaimer.component';
import {DemoDisclModalComponent} from './@mvp/shared-components/demo-disclaimer/demo-modal/demo-discl-modal/demo-discl-modal.component';
import {TrendingContentComponent} from './deprecated/home-page/trending-content/trending-content.component';
import {VideoStreamComponent} from './pages/home-page-v2/video-carousel/_deprecated/video-stream/video-stream.component';
import {NgxEmojiPickerModule} from 'ngx-emoji-picker';
import {HomeVideosComponent} from './deprecated/home-page/home-videos/home-videos.component';
import {SignatureModalComponent} from './@mvp/shared-components/nav-bar/signatureModal/signature-modal/signature-modal.component';
import {NgxFileDragDropModule} from 'ngx-file-drag-drop';
import {
    UploadVideoModalComponent
} from './pages/account-pages/host-account-edit-page/host-profile/room-header/upload-video-modal/upload-video-modal.component';
import {
    ChannelViewProfileComponent
} from './pages/channel-pages/channels-page/channel-view/channel-view-profile/channel-view-profile.component';
import {CommentsComponent} from './pages/channel-pages/channels-page/_shared/video-comments/comments.component';
import {
    ChannelViewLiveRecordingsListComponent
} from './pages/channel-pages/channels-page/channel-view/channel-view-profile/podcast-list/channel-view-live-recordings-list.component';
import {
    ChannelViewVideosListComponent
} from './pages/channel-pages/channels-page/channel-view/channel-view-profile/video-list/channel-view-videos-list.component';
import {
    StreamDetailsModalComponent
} from './pages/account-pages/host-account-live-page/host-stream/stream-details-modal/stream-details-modal.component';
import {HostProfileComponent} from './pages/account-pages/host-account-edit-page/host-profile/host-profile.component';
import {RoomHeaderComponent} from './pages/account-pages/host-account-edit-page/host-profile/room-header/room-header.component';
import {
    ImageCropDialogComponent
} from './pages/account-pages/host-account-edit-page/host-profile/image-crop-dialog/image-crop-dialog.component';
import {StatsComponent} from './pages/account-pages/host-account-edit-page/host-profile/stats/stats.component';
import {DialogStartLiveComponent} from './pages/account-pages/host-account-edit-page/host-profile/room-header/dialog-start-live';
import {DialogInteractComponent} from './pages/account-pages/host-account-edit-page/host-profile/room-header/dialog-interact';
import {TopicsMenuComponent} from './@mvp/shared-components/topics-menu/topics-menu.component';
import {ConfirmModalComponent} from './@mvp/shared-components/confirm-modal/confirm-modal.component';
import {LiveStreamTitleComponent} from './pages/account-pages/host-account-live-page/live-stream-title/live-stream-title.component';
import {CreatorBenefitsComponent} from './pages/info-pages/creator-benefits/creator-benefits.component';
import {VideoDataComponent} from './deprecated/home-page/channels/channel-card/video-data/video-data.component';
import {CommunityGuidelinesComponent} from './pages/info-pages/community-guidelines/community-guidelines.component';
import {
    LiveStreamViewComponent
} from './pages/channel-pages/channels-page/channel-view/channel-view-profile/live-stream/live-stream-view.component';
import {ShareComponent} from './@mvp/shared-components/buttons/share/share.component';
import {VideoTitleComponent} from './pages/channel-pages/channels-page/channel-view/channel-view-profile/video-title/video-title.component';
import {PishingAlertBarComponent} from './@mvp/shared-components/pishing-alert-bar/pishing-alert-bar.component';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from 'ngx-sharebuttons/icons';
import {ShareModalComponent} from './@mvp/shared-components/buttons/share/share-modal/share-modal.component';
import {SignUpBarComponent} from './@mvp/shared-components/_not-used/sign-up-bar/sign-up-bar.component';
import {
    ChannelViewProfileMobComponent
} from './pages/channel-pages/channels-page/channel-view-profile-mob/channel-view-profile-mob.component';
import {BecomeSponsorComponent} from './pages/info-pages/become-sponsor/become-sponsor.component';
import {AvatarComponent} from './@mvp/shared-components/avatar/avatar.component';
import {LiveCounterComponent} from './pages/account-pages/host-account-live-page/live-stream-title/live-counter/live-counter.component';
import {
    VideoSnapshotSelectComponent
} from './pages/account-pages/host-account-edit-page/host-profile/room-header/upload-video-modal/video-snapshot-select/video-snapshot-select.component';
// import {Ng2ImgMaxModule} from 'ng2-img-max';
import {EarnProgressComponent} from './pages/channel-pages/channels-page/_shared/earn-progress/earn-progress.component';
import {
    AdminEditProfileButtonComponent
} from './@mvp/shared-components/admin/admin-edit-profile-button/admin-edit-profile-button.component';
import {AdminPremiumProfileComponent} from './@mvp/shared-components/admin/admin-premium-profile/admin-premium-profile.component';
import {AvailableSoonChipComponent} from './shared/video-chip/chips/available-soon-chip/available-soon-chip.component';
import {TopicsComponent} from './pages/admin-pages/topics/topics.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {SearchInputComponent} from './pages/admin-pages/topics/search/search.component';
import {
    DisclaimerVideoModal
} from './pages/channel-pages/channels-page/video-discaimer/disclaimer-video-modal/disclaimer-video-modal.component';
import {VideoDisclaimerComponent} from './pages/channel-pages/channels-page/video-discaimer/video-disclaimer.component';
import {WatchToEarnPageComponent} from './pages/admin-pages/watch-to-earn-page/watch-to-earn-page.component';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {FeatureToggleService} from './_core/services/feature-toggle.service';
import {environment} from '../environments/environment';
import {
    AccountEarningsComponent
} from './pages/account-pages/host-account-earnings-page/host-account-earnings-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {
    AccountEarningWithdrawalsTabComponent
} from './pages/account-pages/host-account-earnings-page/tabs/withdrawals/withdrawals.component';
import {AccountEarningsEarningsTabComponent} from './pages/account-pages/host-account-earnings-page/tabs/earnings/earnings.component';
import {AccountEarningsRedeenDialogComponent} from './pages/account-pages/host-account-earnings-page/redeem-dialog/redeem-dialog.component';
import {TwoDecimalNumberDirective} from './_core/directives/two-decimals.directive';
import {ResetPasswordComponent} from './@mvp/login-popup/reset-password/reset-password.component';
import {
    RewardsOpportunitiesComponent
} from './pages/account-pages/host-account-earnings-page/tabs/rewards-opportunities/rewards-opportunities.component';
import {RewardCardComponent} from './@mvp/shared-components/reward-card/reward-card.component';
import {HowToEarnComponent} from './pages/info-pages/how-to-earn/how-to-earn.component';
import {LikeButtonComponent} from './@mvp/shared-components/buttons/like-button/like-button.component';
import {WithdrawalsComponent} from './pages/admin-pages/withdrawals/withdrawals.component';
import {WithdrawalsTableComponent} from './pages/admin-pages/withdrawals/table/table.component';
import {WithdrawalChangeStatusDialog} from './pages/admin-pages/withdrawals/table/dialog/change-status-dialog.component';
import {WithdrawalTransferDialog} from './pages/admin-pages/withdrawals/table/dialog/transfer-dialog.component';
import {RegistrationModalState} from './@mvp/login-popup/registration-modal-state.service';
import {FileCoinComponent} from './pages/admin-pages/file-coin/file-coin.component';
import {RegistrationModalComponent} from './@mvp/login-popup/registration-modal.component';
import {LoginPopupCreateAccountComponent} from './@mvp/login-popup/create-an-account/create-an-account.component';
import {EmailLoginComponent} from './@mvp/login-popup/email-login/email-login.component';
import {SignUpComponent} from './@mvp/login-popup/email-sign-up/sign-up.component';
import {ForgotPasswordComponent} from './@mvp/login-popup/forgot-password/forgot-password.component';
import {LoginPopupLoginComponent} from './@mvp/login-popup/login/login.component';
import {WalletLoginButtonComponent} from './@mvp/login-popup/wallet-login/wallet-login-button.component';
import {LoginPopupWelcomeComponent} from './@mvp/login-popup/welcome/welcome.component';
import {NextEventsComponent} from './@mvp/shared-components/next-events/next-events.component';
import {ScrollingEventsComponent} from './@mvp/shared-components/scrolling-events/scrolling-events.component';
import {DonateButtonComponent} from './@mvp/shared-components/buttons/donate-button/donate-button.component';
import {SubscribeButtonComponent} from './@mvp/shared-components/buttons/subscribe-button/subscribe-button.component';
import {LensFollowButtonComponent} from './@mvp/shared-components/buttons/lens-follow-button/lens-follow-button.component';
import {RaiseHandButtonComponent} from './@mvp/shared-components/buttons/raise-hand-button/raise-hand-button.component';
import {
    ChannelViewParticipantsComponent
} from './pages/channel-pages/channels-page/channel-view/channel-view-profile/participants/participants.component';
import {LensService} from './_core/services/lens/lens-service';
import {Web3UtilitiesService} from './@mvp/login-popup/wallet-login/web3.utilities.service';
import {NFTIconButtonComponent} from './@mvp/shared-components/buttons/nft-icon-button/nft-icon-button.component';
import {NftPopupComponent} from './@mvp/shared-components/video-card/nft-popup/nft-popup.component';
import {NFTPopupService} from './@mvp/shared-components/video-card/nft-popup/nft-popup.service';
import {DolbyIoVideoPlayerComponent} from './@mvp/shared-components/dolby-io-video-player/dolby-io-video-player.component';
import {HomePopsComponent} from './deprecated/home-page/home-pops/home-pops.component';
import {UploadedPopsComponent} from './pages/account-pages/host-account-edit-page/host-profile/uploaded-pops/uploaded-pops.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {
    ChooseLiveStreamModalComponent
} from './pages/account-pages/host-account-edit-page/host-profile/room-header/choose-live-stream-modal/choose-live-stream-modal.component';
import {ObsComponent} from './pages/info-pages/obs/obs.component';
import {PopsComponent} from './pages/pops-page/pops.component';
import {PopsVideoComponent} from './pages/pops-page/pops-video/pops-video.component';
import {ThetaKeyComponent} from './pages/account-pages/host-account-data-form-page/live-peer-key/live-peer-key.component';
import {NgxFilesizeModule} from 'ngx-filesize';
import {HomePageV2Component} from './pages/home-page-v2/home-page-v2.component';
import {SharedModule} from './shared/shared.module';
import {InvitationCodesComponent} from './pages/admin-pages/invitation-codes/invitation-codes.component';
import {InvitationCodeModalComponent} from './pages/admin-pages/invitation-codes/invitation-code/invitation-code-modal.component';
import {PipesModule} from './_core/pipes/pipes.module';
import {
    ChannelViewPopsListComponent
} from './pages/channel-pages/channels-page/channel-view/channel-view-profile/pops-list/channel-view-pops-list.component';
import { TwCarouselComponent } from './pages/home-page-v2/video-carousel/tw-carousel.component';
import { GtagModule } from 'angular-gtag';
import {ProfileComponent} from "./pages/account-pages/profile/profile.component";

@NgModule({
    declarations: [
        AppComponent,
        ParticipantsComponent,
        ChannelViewParticipantsComponent,
        VideoTitleComponent,
        ShareComponent,
        AdminComponent,
        FullScreenComponent,
        StreamVideoComponent,
        ChatComponent,
        HostProfileComponent,
        NavBarComponent,
        AccountCreateEditComponent,
        BecomeSponsorComponent,
        AccountLiveComponent,
        RoomHeaderComponent,
        HostStreamComponent,
        UserSettingsMenuComponent,
        ChannelViewComponent,
        PapeltvLogoComponent,
        ImageCropDialogComponent,
        ChannelDataComponent,
        ChannelIconComponent,
        RecentPodcastsComponent,
        UploadedVideosComponent,
        BioComponent,
        HostTvComponent,
        StatsComponent,
        BioTextPipe,
        HostStatsComponent,
        ConfirmModalComponent,
        EditIconButtonComponent,
        LensFollowButtonComponent,
        UploadIconButtonComponent,
        VideoCardComponent,
        NFTIconButtonComponent,
        NftPopupComponent,
        DeleteIconButtonComponent,
        PlayIconButtonComponent,
        HomePageComponent,
        ChannelsComponent,
        ProfileComponent,
        ChannelCardComponent,
        RoomData2Component,
        ImageComponent,
        UploadProgressBarComponent,
        MessageDialogComponent,
        VideoPlayerComponent,
        AdvertisementComponent,
        VideoCarouselComponent,
        FooterComponent,
        VideoItemComponent,
        VideoItemListComponent,
        CarouselCardInfoComponent,
        DialogStartLiveComponent,
        DialogInteractComponent,
        PartnersComponent,
        WalletComponent,
        AllAccountsComponent,
        PermissionsComponent,
        SearchComponent,
        SearchInputComponent,
        MaintenanceComponent,
        ApplicationComponent,
        ChannelsPageComponent,
        TermsAndConditionsComponent,
        PrivacyPolicyComponent,
        HeartComponent,
        DonationReceivedComponent,
        CookiesBarComponent,
        CookiesBarModalComponent,
        CookiePolicyComponent,
        PishingAlertBarComponent,
        TwitterComponent,
        DemoDisclaimerComponent,
        DemoDisclModalComponent,
        TrendingContentComponent,
        VideoStreamComponent,
        HomeVideosComponent,
        HomePopsComponent,
        UploadedPopsComponent,
        SignatureModalComponent,
        UploadVideoModalComponent,
        ChannelViewProfileComponent,
        CommentsComponent,
        ChannelViewLiveRecordingsListComponent,
        ChannelViewVideosListComponent,
        StreamDetailsModalComponent,
        TopicsMenuComponent,
        LiveStreamTitleComponent,
        CreatorBenefitsComponent,
        VideoDataComponent,
        CommunityGuidelinesComponent,
        LiveStreamViewComponent,
        ShareModalComponent,
        SignUpBarComponent,
        ChannelViewProfileMobComponent,
        AvatarComponent,
        LiveCounterComponent,
        VideoSnapshotSelectComponent,
        EarnProgressComponent,
        AdminEditProfileButtonComponent,
        AdminPremiumProfileComponent,
        AvailableSoonChipComponent,
        TopicsComponent,
        DisclaimerVideoModal,
        VideoDisclaimerComponent,
        WatchToEarnPageComponent,
        AccountEarningsComponent,
        AccountEarningWithdrawalsTabComponent,
        AccountEarningsEarningsTabComponent,
        AccountEarningsRedeenDialogComponent,
        TwoDecimalNumberDirective,
        ResetPasswordComponent,
        RewardsOpportunitiesComponent,
        RewardCardComponent,
        HowToEarnComponent,
        LikeButtonComponent,
        WithdrawalChangeStatusDialog,
        WithdrawalTransferDialog,
        WithdrawalsTableComponent,
        WithdrawalsComponent,
        FileCoinComponent,
        RegistrationModalComponent,
        LoginPopupCreateAccountComponent,
        EmailLoginComponent,
        SignUpComponent,
        ForgotPasswordComponent,
        LoginPopupLoginComponent,
        WalletLoginButtonComponent,
        LoginPopupWelcomeComponent,
        NextEventsComponent,
        ScrollingEventsComponent,
        DonateButtonComponent,
        SubscribeButtonComponent,
        RaiseHandButtonComponent,
        DolbyIoVideoPlayerComponent,
        ChooseLiveStreamModalComponent,
        ObsComponent,
        PopsComponent,
        PopsVideoComponent,
        ThetaKeyComponent,
        HomePageV2Component,
        InvitationCodesComponent,
        InvitationCodeModalComponent,
        ChannelViewPopsListComponent,
        TwCarouselComponent,
    ],
    imports: [
        SharedModule,
        GtagModule.forRoot({ trackingId: 'G-5ZJ7WNVQGL', trackPageviews: true }),
        SocialLoginModule,
        // Ng2ImgMaxModule,
        MatSlideToggleModule,
        MatChipsModule,
        MatSnackBarModule,
        MatListModule,
        MatDialogModule,
        MatToolbarModule,
        MatSelectModule,
        MatInputModule,
        MatGridListModule,
        MatIconModule,
        MatTabsModule,
        MatTableModule,
        MatDialogModule,
        MatPaginatorModule,
        MatDividerModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatButtonModule,
        MatRadioModule,
        MatSidenavModule,
        MatSidenavModule,
        MatCardModule,
        ImageCropperModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatMenuModule,
        NgxEmojiPickerModule.forRoot(),
        NgxFileDragDropModule,
        ShareButtonsModule.withConfig({
            debug: true
        }),
        ShareIconsModule,
        MatAutocompleteModule,
        MatExpansionModule,
        NgxFilesizeModule,
        PipesModule
    ],
    providers: [
        CanActivateRouteInterceptor,
        FeatureToggleService,
        LensService,
        NFTPopupService,
        Web3UtilitiesService,
        RegistrationModalState,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(environment.fbClientId)
                    },
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(environment.gmailClientId)
                    }
                ]
            } as SocialAuthServiceConfig,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JWTInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
