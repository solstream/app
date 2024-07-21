import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ChatService, MessageApiModel} from '../../../../_core/services/chat.service';
import {constantEmoji} from '../../../../constant-emoji';
import {AccountModel} from '../../../../_core/model/accountModel';
import {TxService} from '../../../../_core/services/tx.service';
import {LocalStorageService} from '../../../../_core/services/auth-store.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Web3UtilitiesService} from '../../../login-popup/wallet-login/web3.utilities.service';

@Component({
  selector: 'app-donate-button',
  templateUrl: './donate-button.component.html',
  styleUrls: ['./donate-button.component.scss']
})
export class DonateButtonComponent implements OnInit {

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  @Input()
  room: AccountModel;

  sendingTransaction = false;
  userName: string;
  isBNBNetwork;
  isMATICNetwork;
  amountToDonate = 1;
  walletProvided = false;


  public isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(
      public dialog: MatDialog,
      private breakpointObserver: BreakpointObserver,
      private txService: TxService,
      private authStore: LocalStorageService,
      private mes: ChatService,
      private cus: CurrentUserState,
      public web3Utilities: Web3UtilitiesService
  ) { }

  ngOnInit(): void {
    this.userName = this.authStore.getSecurityUserName();
    this.walletProvided = this.room.qrCode !== null;
    this.checkNetwork();

    if (!Boolean(this.userName)) {
      this.userName = this.authStore.getUserNameObserver();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(this.callAPIDialog, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        room: this.room
      }
    });

    const smallDialogSubscription = this.isExtraSmall.subscribe(size => {
      if (size.matches) {
        dialogRef.updateSize('100%', '100%');
      } else {
        dialogRef.updateSize('70vh', '40vh');
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      smallDialogSubscription.unsubscribe();
    });
  }
  public donateMatic(amount?): void {
    this.dialog.closeAll();
    const amountBNB = 0.1 || amount; // this is 0.001 BNB
    this.sendingTransaction = true;
    // receiver should be replace from user wallet
    this.txService.sendBNB$(
        this.room.qrCode,
        amountBNB).subscribe((res) => {
      if (res && res.txId) {
        // Transaction in blockchain$
        this.sendDonationMessage(amountBNB.toString(), 'MATIC');
      }
      // we can manage any kind of event, like showing coriandoli
      console.log(res);
      this.sendingTransaction = false;
    }, (err) => {
      this.sendingTransaction = false;
      console.log(err);
    });
  }
  public donateBNB(amount?): void {
    this.dialog.closeAll();
    const amountBNB = 0.01 || amount; // this is 0.001 BNB
    this.sendingTransaction = true;
    // receiver should be replace from user wallet
    this.txService.sendBNB$(
        this.room.qrCode,
        amountBNB).subscribe((res) => {
      if (res && res.txId) {
        // Transaction in blockchain$
        this.sendDonationMessage(amountBNB.toString(), 'BNB');
      }
      // we can manage any kind of event, like showing coriandoli
      console.log(res);
      this.sendingTransaction = false;
    }, (err) => {
      this.sendingTransaction = false;
      console.log(err);
    });
  }

  public isLoggedIn(): boolean {
    return this.cus.isLoggedIn();
  }

  private sendDonationMessage(amount: string, currency: string, customMessage?: string): void {
    const messageApi: MessageApiModel = {
      confId: this.room.conferenceId,
      roomName: this.room.roomName,
      userName: this.room.userName + '/helper',
      text: this.userName + ' has donated ' + amount + ' ' + currency + ' ' + constantEmoji.money
    };
    this.mes.createMessage(messageApi).subscribe();
  }

  private checkNetwork = async () => {
    this.isBNBNetwork = await this.web3Utilities.isBNBNetwork();
    this.isMATICNetwork = await this.web3Utilities.isMATICNetwork();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
