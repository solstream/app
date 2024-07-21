import {NgModule} from '@angular/core';
import {PreviewCardComponent} from './preview-card/preview-card.component';
import {PremiumTickComponent} from './premium-tick/premium-tick.component';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from './sidenav/sidenav.component';
import {ChannelSideBarListItemComponent} from './sidenav/channels-list/channel-list-item/channel-side-bar-list-item.component';
import {ChannelsSideBarListComponent} from './sidenav/channels-list/channels-side-bar-list.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {PipesModule} from '../_core/pipes/pipes.module';
import {VideoJsPlayerComponent} from './video-js-player/video-js-player.component';
import {VideoJsItemComponent} from './video-js-player/video/video-js-item.component';
import {LiveChipComponent} from './video-chip/chips/live-chip/live-chip.component';
import {RecordChipComponent} from './video-chip/chips/record-chip/record-chip.component';
import {MatChipsModule} from '@angular/material/chips';
import {UploadedVideoChipComponent} from './video-chip/chips/video-chip/video-chip.component';
import {OfflineChipComponent} from './video-chip/chips/offline-chip/offline-chip.component';
import {VideoChipComponent} from './video-chip/video-chip.component';
import { EarnCardComponent } from './earn-card/earn-card.component';

const components = [
    PreviewCardComponent,
    PremiumTickComponent,
    ChannelSideBarListItemComponent,
    ChannelsSideBarListComponent,
    SidenavComponent,
    VideoJsPlayerComponent,
    VideoJsItemComponent,
    VideoChipComponent,
    UploadedVideoChipComponent,
    LiveChipComponent,
    RecordChipComponent,
    OfflineChipComponent,
];

@NgModule({
    imports: [
        CommonModule,
        MatListModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        PipesModule,
    ],
    declarations: [
        ...components,
        EarnCardComponent,
    ],
    exports: [
        ...components,
        EarnCardComponent
    ]
})
export class SharedModule {
}
