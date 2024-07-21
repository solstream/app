import { Component, Input, OnInit } from '@angular/core';
import { CurrentUserState } from '../../../../_core/services/current-user-state.service';
import { LensService } from '../../../../_core/services/lens/lens-service';

@Component({
  selector: 'app-lens-follow-button',
  templateUrl: './lens-follow-button.component.html',
  styleUrls: ['./lens-follow-button.component.scss']
})
export class LensFollowButtonComponent implements OnInit {

  disabled = false;
  isVisible = false;
  following = false;
  @Input()
  authorId: string;

  lensId: string;

  constructor(private cus: CurrentUserState, private lensService: LensService) {}

  ngOnInit(): void {
    // this.authorId = '0x650aa5EcdAAc9a068cC5829924F9E0B06A8907a4';
    this.lensService.hasProfile(this.authorId).then(hasProfile => {
      this.disabled = !hasProfile;
      this.isVisible = hasProfile;

      if (hasProfile) {
        this.lensService.fetchProfile(this.authorId).then(p => {
          this.lensId = p.id;
          this.following = p.isFollowedByMe;
        });
      }
    });
  }

  follow(): void {
    this.lensService.follow(this.lensId).then(
      res => {
        if (res) {
          this.cus.toggleSubscribe(this.authorId).subscribe();
        }
      }
    );
  }

  isFollowing(): boolean {
    if (this.disabled) {
      return false;
    }
    return false;
    //return await this.lensService.isFollowing(this.authorId);
  }

}
