import {Component, Inject, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StreamingDialogData} from './room-header.component';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TxService} from '../../../../../_core/services/tx.service';
import {ChatService, MessageApiModel} from '../../../../../_core/services/chat.service';
import {constantEmoji} from '../../../../../constant-emoji';
import {LocalStorageService} from '../../../../../_core/services/auth-store.service';
import EventEmitter from 'events';
import {Web3UtilitiesService} from '../../../../../@mvp/login-popup/wallet-login/web3.utilities.service';

export enum Interactions {
    Donate = 1,
    Sound = 2,
    Message = 3
}

@Component({
    selector: 'app-dialog-interact',
    templateUrl: 'dialog-interact.html',
    styleUrls: ['./dialog-interact.scss']
})


export class DialogInteractComponent implements OnInit {
    // @ts-ignore
    @Output() notifyTransaction: EventEmitter<any> = new EventEmitter();

    wrongStreamingCode = true;
    interactions = Interactions;
    currentChoice: Interactions;
    bnbAmount;
    isBNBNetwork;
    isMATICNetwork;
    isEthNetwork;
    currentBnbPrice;
    dollarAmount;
    room;
    bnbToSend;
    bnbToSendScren;
    loadingAmount = false;
    errorBNBPrice = false;
    sendingTransaction = false;
    userName;
    codeForm = new FormGroup({
        code: new FormControl(''),
        dollarAmount : new FormControl('', [Validators.min(0.01), Validators.required])
    });

    constructor(
        private http: HttpClient,
        public dialogRef: MatDialogRef<DialogInteractComponent>,
        private txService: TxService,
        private authStore: LocalStorageService,
        private mes: ChatService,
        public web3Utilities: Web3UtilitiesService,
        @Inject(MAT_DIALOG_DATA) public data: StreamingDialogData) {
    }

    ngOnInit(): void {
        this.userName = this.authStore.getUserNameObserver();
        this.checkNetwork();
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    chooseInteraction(interaction: Interactions): void {
        this.currentChoice = interaction;
    }

    back(): void {
        this.currentChoice = null;
    }

    getBNBprice(): void {
        this.loadingAmount = true;
        this.errorBNBPrice = false;
        this.getBNBAPI().subscribe((result: any) => {
            this.loadingAmount = false;
            const coin = result.binancecoin || result['matic-network'];
            this.currentBnbPrice = parseInt(coin.usd, 10);
        }, () => {
            this.errorBNBPrice = true;
        });
    }

    getBNBAPI(): Observable<[]> {
        return this.http.get<[]>('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
    }


    public setBnbPriceAfterAmountChange = async () => {
        const priceAPI = this.isBNBNetwork ? 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd' :
            'https://api.coingecko.com/api/v3/simple/price?ids=matic=network&vs_currencies=usd';
        this.http.get<[]>(priceAPI).subscribe((result: any) => {
            // tslint:disable-next-line:radix
            const coin = result.binancecoin || result['matic-network'];
            this.currentBnbPrice = parseFloat(coin.usd);
            this.bnbToSend = this.dollarAmount / this.currentBnbPrice;
            this.bnbToSendScren = this.bnbToSend.toFixed(5);
        });
    }

    donateBNB(): void {
        this.bnbToSend = this.dollarAmount / this.currentBnbPrice;
        this.bnbToSend = parseFloat(this.bnbToSend);
        this.sendingTransaction = true;
        this.dialogRef.close();
        this.txService.txInProgress.next(true);

        this.txService.sendBNB$(
            this.data.room.qrCode,
            this.bnbToSend).subscribe((res) => {
            if (res && res.txId) {
                // Transaction in blockchain$
                this.sendDonationMessage(this.bnbToSend.toString(), 'BNB');
                this.sendingTransaction = false;
                this.txService.txInProgress.next(false);
            }
        }, (error) => {
            this.txService.txInProgress.next(false);
        });
    }

    private sendDonationMessage(amount: string, currency: string): void {
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

}
