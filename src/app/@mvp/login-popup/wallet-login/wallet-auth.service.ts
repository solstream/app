import {Injectable} from '@angular/core';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import * as UAuthWeb3Modal from '@uauth/web3modal';
import UAuthSPA from '@uauth/js';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {providers, Signer, utils} from 'ethers';
import {HttpClient} from '@angular/common/http';
import WalletConnect from '@walletconnect/client';
import {environment} from '../../../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {SignatureModalComponent} from '../../shared-components/nav-bar/signatureModal/signature-modal/signature-modal.component';
import {LoginPopupState, RegistrationModalState} from '../registration-modal-state.service';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {message, providerOptions} from './wallet.data';
import {MatDialogRef} from '@angular/material/dialog/dialog-ref';
import {Web3Provider} from '@ethersproject/providers/src.ts/web3-provider';
import {promise} from 'protractor';

declare const window: any;

export interface WalletConnection {
    walletAddress: string;
    authToken: string;
    web3: Web3;
}

@Injectable({
    providedIn: 'root'
})
export class WalletAuthService {

    provider: any;
    connection: ConnectResponse = {};
    signer: Signer;
    web3: Web3Provider;
    account: string;
    signatureModalRef: MatDialogRef<any>;

    constructor(private httpClient: HttpClient,
                private modalService: RegistrationModalState,
                public dialog: MatDialog) {
    }


    public connect = async (): Promise<ConnectResponse> => {
        const web3Modal = new Web3Modal({
            cacheProvider: true, // optional
            providerOptions, // required
            disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        });
        try {
            this.provider = await web3Modal.connect();
            this.web3 = new providers.Web3Provider(this.provider, 'any');
            this.signer = this.web3.getSigner();
        } catch (e) {
            console.log('Could not get a wallet connection', e);
            return !e ? {status: 'user-cancel'} : {status: 'error'};
        }
        const account = await this.signer.getAddress();
        this.account = account;
        return {
            walletAddress: account,
            web3: this.web3,
            status: 'success'
        };
    };

    async signRequest(): Promise<string | 'user-cancel'> {
        const bridge = 'https://bridge.walletconnect.org';
        const connector = new WalletConnect({bridge});
        if (connector.connected) {
            return await this.promptMessageToSign(connector);
        } else {
            this.modalService.closeModal();
            this.connection = await this.connect();
            if (this.connection.status === 'user-cancel') {
                return Promise.resolve('user-cancel');
            }
            // timeout to make sure message sign request goes through to trust wallet, without a delay not stable
            await new Promise((res) => setTimeout(res, 500));
            const connector2 = new WalletConnect({bridge});
            return await this.promptMessageToSign(connector2);
        }
    }

    private async promptMessageToSign(connector: WalletConnect): Promise<string> {
        this.account = connector.accounts[0];
        this.connection.walletAddress = this.account;
        const signMessage = message + this.account;
        const msgParams = [
            this.account,
            signMessage,
        ];
        this.showInfoModalAboutSigning();
        return await connector.signMessage(msgParams);
    }

    public async authenticateWithWallet(action: 'login' | 'signup', invitationCode?: string): Promise<WalletLoginResponse> {
        try {
            const result = await this.signRequest();
            if (result === 'user-cancel') {
                return Promise.resolve({wToken: null, gToken: null, userError: 'user-cancel'});
            }
            this.hideSignatureModal();
            // TODO post instead of get for login
            if (action === 'login') {
                return await this.httpClient
                    .get<WalletLoginResponse>(`${environment.privateAzure}/login/v?address=${this.account}&signature=${result}`)
                    .pipe(catchError((error) => {
                        return of({wToken: null, gToken: null, userError: error.error.error});
                    }))
                    .toPromise();
            }
            return await this.httpClient
                .get<WalletLoginResponse>(`${environment.privateAzure}/sign-up/v?address=${this.account}&signature=${result}&invitationCode=${invitationCode}`)
                .pipe(catchError((error) => {
                    return of({wToken: null, gToken: null, userError: error.error.error});
                }))
                .toPromise();

        } catch (e) {
            return Promise.resolve({wToken: null, gToken: null, userError: 'Unexpected error occurred please try again later.'});
        }

    }

    private showInfoModalAboutSigning(): void {
        this.signatureModalRef = this.dialog.open(
            SignatureModalComponent, {
                width: '650px',
                data: {}
            });
    }

    hideSignatureModal(): void {
        this.signatureModalRef.close();
    }

    async switchToNetwork(selectedChain) {
        let network;
        if (this.connection?.web3) {
            network = await this.connection.web3.getNetwork();
        }
        if (network && network.chainId === selectedChain.chainId) {
            confirm('You are already on the selected network');
        } else {
            // confirm('Current network not supported. Please switch to Binance Smart Chain');
            try {
                this.connection = await this.connect();
                network = await this.connection.web3.getNetwork();
                if (selectedChain.id !== 1) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [selectedChain.networkMap],
                    });
                }
                await this.connection.web3.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{
                        chainId:
                            utils.hexValue(selectedChain.networkMap.chainId)
                    }]
                });
                // this.account = this.connection.walletAddress;
                // message = message + this.account;
                // return await this.signer.signMessage(message);
            } catch (error) {
                alert(error.message);
            }
        }
    }


    // private async sendRequest(httpMethod: string, url: string, headers: any, body: any = null): Promise<Response> {
    //     const {auth, signature} = headers || {};
    //
    //     const requestOptions = {
    //         method: httpMethod,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${auth}`,
    //             'x-signature': signature,
    //         },
    //         body: body ? JSON.stringify(body) : undefined,
    //     };
    //
    //     return fetch(url, requestOptions);
    // }


}

export interface WalletLoginResponse {
    gToken: string;
    wToken: string;
    userError?: string | 'user-cancel' | 'error';
}

export interface ConnectResponse {
    walletAddress?: string;
    web3?: any;
    status?: 'success' | 'error' | 'user-cancel';
}
