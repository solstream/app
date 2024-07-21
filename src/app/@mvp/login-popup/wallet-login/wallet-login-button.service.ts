import {Injectable} from '@angular/core';
import BUSDABI from 'src/app/tokens/ABI/busd.json';
import {WalletAuthService, WalletLoginResponse} from './wallet-auth.service';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import WalletConnect from '@walletconnect/browser';
import QRCodeModal from '@walletconnect/qrcode-modal';

@Injectable({
    providedIn: 'root'
})
export class WalletLoginButtonService {
    // TODO not used
    connection;

    constructor(private walletAuthService: WalletAuthService, private authService: LocalStorageService) {
    }

    logout(): void {
        const bridge = 'https://bridge.walletconnect.org';
        const connector = new WalletConnect({bridge, qrcodeModal: QRCodeModal});
        if (connector.connected) {
            connector.killSession().then(() => {
            });
        }
    }

    // user in some other places not only button
    public async walletAuthorization(action: 'login' | 'signup', invitationCode?: string): Promise<WalletLoginDetails> {
        try {
            // for stability to start fresh login and kill any session if present
            this.logout();

            // timeout to make sure message sign request goes through to trust wallet, without a delay not stable
            await new Promise((res) => setTimeout(res, 500));

            const authToken = await this.walletAuthService.authenticateWithWallet(action, invitationCode);
            if (authToken.userError) {
                return {error: authToken.userError};
            }
            const {web3, walletAddress} = this.walletAuthService.connection;
            return {web3, walletAddress, authToken};
        } catch (e) {
            console.log('Could not get a wallet this.connection', e);
            return {error: 'failed'};
        }
    }

    public connectMetamask = async () => {
        try {
            const signedRequest = await this.walletAuthService.signRequest();
            this.walletAuthService.hideSignatureModal();
            const {web3, walletAddress} = this.walletAuthService.connection;
            return {web3, walletAddress};
        } catch (e) {
            console.log('Could not get a wallet this.connection', e);
            return;
        }
    };
    public getBUSDBalance = async () => {
        if (!this.connection) {
            return await this.walletAuthorization('login');
        } else {
            const {web3, walletAddress} = this.connection;
            //TODO remove hardcode
            const tokenAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
            const contract = new web3.eth.Contract((BUSDABI as any), tokenAddress);
            const balance = await contract.methods.balanceOf(walletAddress).call();
            let busdBalance = web3.utils.fromWei(balance);
            busdBalance = parseFloat(busdBalance).toFixed(2);

            return {
                busdBalance,
                ...web3
            };
        }
    };
}

export interface WalletLoginDetails {
    web3?: any;
    walletAddress?: string;
    authToken?: WalletLoginResponse;
    error?: string;
}
