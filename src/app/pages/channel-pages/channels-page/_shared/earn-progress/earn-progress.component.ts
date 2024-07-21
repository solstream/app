import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {EarningsService} from '../../../../../_core/services/earnings.service';
import {VideoState} from '../../../../../_core/model/video.model';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {CurrentUserState} from 'src/app/_core/services/current-user-state.service';
import {RegistrationModalState, LoginPopupState} from '../../../../../@mvp/login-popup/registration-modal-state.service';

@Component({
  selector: 'app-earn-progress',
  templateUrl: './earn-progress.component.html',
  styleUrls: ['./earn-progress.component.scss']
})
export class EarnProgressComponent implements OnInit, OnChanges, OnDestroy {

  @Input() videoId;
  @Input() videoState: VideoState;
  @Input() isMobile = false;

  public progress: number;
  public strokeDashoffset = 0;
  public tokenEarned = false;
  public tokensEarned = 0.00;
  public hideEarnProgress = false;

  private progressSubscription: Subscription;

  constructor(
      public earningsService: EarningsService,
      public router: Router,
      private cus: CurrentUserState,
      private loginPopupService: RegistrationModalState
  ) {
  }

  ngOnInit(): void {
    this.hideEarnProgress = !!localStorage.getItem('hideEarnProgress') && !this.cus.isLoggedIn;

    this.progressSubscription = this.earningsService.getProgress().subscribe(progress => {
      this.progress = progress;
      this.setProgress(progress);

      if (progress === 100 && this.cus.isLoggedIn()) {
        this.earningsService.earnV3(this.videoId).subscribe(
                () => {
                  this.tokenEarned = true;
                  this.tokensEarned = parseFloat((this.tokensEarned + 0.01).toFixed(4));
                  setTimeout(() => this.tokenEarned = false, 3000);
                },
                error => console.log(error)
            );
      } else if (progress === 100 && !this.cus.isLoggedIn()) {
        this.tokenEarned = true;
        this.tokensEarned = parseFloat((this.tokensEarned + 0.01).toFixed(4));
        setTimeout(() => this.tokenEarned = false, 3000);
      }
    });

    // Pausing progress whenever a user navigates to any other page.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.earningsService.pauseProgress();
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes.videoState && changes.videoState.currentValue === VideoState.PLAYING) {
      this.earningsService.startProgress();
    }

    if (
        changes.videoState && changes.videoState.currentValue === VideoState.PAUSED ||
        changes.videoState && changes.videoState.currentValue === VideoState.DEFAULT
    ) {
      this.earningsService.pauseProgress();
    }

  }


  setProgress(val: number): void {
    const r = 98;
    const c = Math.PI * r * 2;
    const pct = ((100 - val) / 100) * c;

    this.strokeDashoffset = pct;
  }

  ngOnDestroy(): void {
    this.progressSubscription.unsubscribe();
  }

  isLoggedIn(): boolean {
    return this.cus.isLoggedIn();
  }

  goToLogin(): void {
    this.loginPopupService.openModal(LoginPopupState.WELCOME);
  }

  close(e): void {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem('hideEarnProgress', 'true');
    this.hideEarnProgress = true;
  }

}
