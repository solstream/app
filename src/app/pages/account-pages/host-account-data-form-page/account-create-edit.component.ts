import { Component, OnInit } from '@angular/core';
import { ChannelsService } from '../../../_core/services/channels.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounce, switchMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, of, timer } from 'rxjs';
import { LocalStorageService } from '../../../_core/services/auth-store.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterService } from '../../../_core/services/router.service';
import { AvatarGenerator } from 'random-avatar-generator';
import { CurrentUserState } from '../../../_core/services/current-user-state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AccountModel } from '../../../_core/model/accountModel';
import {
  ImageCropDialogComponent
} from '../host-account-edit-page/host-profile/image-crop-dialog/image-crop-dialog.component';
import { TopicsService } from '../../admin-pages/topics/topics.service';
import { AccountFormMapper } from './account-form.mapper';

@Component({
  selector: 'app-host-console',
  templateUrl: './account-create-edit.component.html',
  styleUrls: ['./account-create-edit.component.scss']
})
export class AccountCreateEditComponent implements OnInit {
  editMode = false;
  accountForm: FormGroup = null;
  userName = '';
  roomName = '';
  initialRoomModel: AccountModel;
  roomNameIsFree = true;

  generator: AvatarGenerator;
  avatarSrc: string | SafeUrl;
  avatarFile: File;

  pageReady = false;
  savingRoom = false;
  roomNameChanged = false;
  cancelButtonVisible = true;
  topicsOptions: string[] = [];

  constructor(private roomService: ChannelsService,
              private localStorageService: LocalStorageService,
              private router: Router,
              private snackBar: MatSnackBar,
              private routerService: RouterService,
              private activatedRoute: ActivatedRoute,
              private currentUserState: CurrentUserState,
              private sanitizer: DomSanitizer,
              private topicService: TopicsService,
              private formMapper: AccountFormMapper,
              private dialog: MatDialog) {
    this.generator = new AvatarGenerator();
  }

  ngOnInit(): void {
    this.topicService.getAllTopics().subscribe(resp => {
      // this.topicsOptions = resp.map(x => x.topicName);
      this.topicsOptions = ['Gaming', 'Crypto'];
    });
    if (this.router.url.indexOf('/edit') > -1) {
      this.initEdit();
    } else {
      this.generateAvatar();
      if (this.currentUserState.isAdmin()) {
        this.initCreateAdminAction();
      } else {
        if (this.currentUserState.currentUserAccount$.value) {
          this.routerService.navigateToEditProfile(this.currentUserState.currentUserAccount$.value.id);
        }
        this.initCreateRegularUser();
      }
    }
    this.accountForm.get('roomName').valueChanges.subscribe((value) => {
      // Check if the account name is valid, you might need to adjust this condition based on your validation
      if (this.accountForm.get('roomName').valid) {
        // Copy the account name to the account title
        this.accountForm.get('roomTitle').setValue(value);
      }
    });
  }

  generateAvatar(): void {
    this.avatarSrc = this.generator.generateRandomAvatar();
  }

  private initCreateAdminAction(): void {
    this.accountForm = this.formMapper.createEmptyForm(true);
    this.monitorRoomNameChanges();
  }

  private initCreateRegularUser(): void {
    this.cancelButtonVisible = false;
    this.accountForm = this.formMapper.createEmptyForm();
    const userName = this.localStorageService.getSecurityUserName();
    this.accountForm.controls.roomName.setValue(userName);
    if (this.localStorageService.isWallet()) {
      this.accountForm.controls.qrCode.setValue(userName);
    }
    this.monitorRoomNameChanges();
  }

  private initEdit(): void {
    this.editMode = true;
    const roomId = this.activatedRoute.snapshot.params.roomId;
    if (!this.currentUserState.isAdmin() && this.currentUserState.currentUserAccount$.value.id !== roomId) {
      this.routerService.navigateHome();
    }
    this.roomService.getRoom(roomId).subscribe((room) => {
      this.userName = room.userName;
      this.roomName = room.roomName;
      this.initialRoomModel = room;
      if (room.avatarAzureUrl) {
        this.avatarSrc = room.avatarAzureUrl;
      } else {
        this.generateAvatar();
      }
      const canEditWallet = !Boolean(room.qrCode) || room.qrCode === 'wallet-id';
      this.accountForm = this.formMapper.createRoomForm(room, canEditWallet);
      if (this.accountForm.invalid) {
        this.accountForm.markAllAsTouched();
      }
      this.monitorRoomNameChanges();
    });
  }

  private monitorRoomNameChanges(): void {
    this.accountForm.controls.roomName.valueChanges.pipe(
      tap(() => this.roomNameChanged = true),
      debounce(() => timer(1000))).subscribe((value: string) => {

      if (value === this.roomName) {
        this.roomNameChanged = false;
        this.roomNameIsFree = false;
        this.accountForm.controls.roomName.setErrors(null);
        return;
      }

      if (value.length !== 0) {
        this.roomService.roomExists(value).subscribe(roomExists => {
          this.roomNameChanged = false;
          this.roomNameIsFree = !roomExists;
          if (roomExists) {
            this.accountForm.controls.roomName.setErrors({ taken: true });
          } else {
            this.accountForm.controls.roomName.setErrors(null);
          }
        });
      }
    }, () => {
      this.roomNameChanged = true;
    });
  }

  saveRoom(): void {
    if (this.savingRoom) {
      return;
    }
    this.savingRoom = true;
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const room: AccountModel = this.accountForm.getRawValue();
    if (!Boolean(this.avatarFile)) {
      // generated avatar
      room.avatarAzureUrl = this.avatarSrc as string;
    }

    const saveAccountCall = this.currentUserState.isAdmin() ?
      this.roomService.saveAccountByAdmin(room, this.editMode) :
      this.roomService.saveAccount(room, this.editMode);

    saveAccountCall.pipe(
      // checks if custom avatar file, then saves it to IPFS
      switchMap((updatedAccount) => this.avatarFile ? this.roomService.saveAvatarImageIpfs(updatedAccount.id, this.avatarFile) : of(updatedAccount)),
      // re-fetch user data to state
      switchMap((updatedAccount) => forkJoin([this.currentUserState.fetchCurrentUserData(), of(updatedAccount)])))
      .subscribe(([, account]) => {
        const isAdminUpdatingOthersAccount = this.currentUserState.isAdmin() && this.currentUserState.currentUserAccount$.getValue().roomName !== account.name;
        if (isAdminUpdatingOthersAccount) {
          this.routerService.navigateMyTvAdminMode(account.roomName);
        } else {
          this.routerService.navigateToMyTv(this.currentUserState.getCurrentUserRoom().roomName);
        }
      }, (e) => {
        this.snackBar.open('Error: something went wrong please try again. ', 'Close');
        this.savingRoom = false;
        console.error(e);
      });
  }

  onCancel(): void {
    if (this.currentUserState.isAdmin()) {
      this.routerService.navigateToAdmin();
    }
    if (this.editMode) {
      this.routerService.navigateToMyTv(this.currentUserState.getCurrentUserRoom().roomName);
    }
  }

  profileImageSelected(imageChangeEvent: File[]): void {
    const dialogRef = this.dialog.open(ImageCropDialogComponent, {
      data: {
        ctaText: 'CROP',
        imageChangeEvent,
        imageCropRatioInput: 9 / 9
      }
    });
    dialogRef.afterClosed().subscribe((selectedFile: File) => {
      if (selectedFile) {
        if (selectedFile.size > 300000) {
          this.snackBar.open('File size is too big, try selecting images smaller than 2MB. ', 'Close');
          return;
        }
        this.avatarFile = selectedFile;
        const objectURL = URL.createObjectURL(selectedFile);
        this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    });
  }
}
