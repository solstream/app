import {Component, Input, OnInit} from '@angular/core';
import {chains, tokenomicsConf} from '../../../tokens/tokenomics';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {HttpClient} from '@angular/common/http';
import {
    StatsService,
    StreamingStats
} from '../../../pages/account-pages/host-account-edit-page/host-profile/stats/stats.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {AccountModel} from '../../../_core/model/accountModel';
import {EarningsService} from '../../../_core/services/earnings.service';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';
import * as Utils from 'src/app/_core/utils/utils';
import Web3 from 'web3';
import {Observable, of} from 'rxjs';
import {ChannelsService} from '../../../_core/services/channels.service';
import {switchMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RouterService} from '../../../_core/services/router.service';
import {WalletLoginButtonService} from '../../login-popup/wallet-login/wallet-login-button.service';
import {Web3UtilitiesService} from '../../login-popup/wallet-login/web3.utilities.service';
import * as solanaWeb3 from '@solana/web3.js';
import {PublicKey} from '@solana/web3.js';
import { getAllDomains, NameRegistryState, reverseLookupBatch } from "@bonfida/spl-name-service";


const NO_DOMAIN_MESSAGE = "Buy a Sol Domain now";

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

    isMATIC = false;
    isBNB = false;
    tokenomics = tokenomicsConf;
    currentBnbPrice: number;
    currentMaticPrice: number;
    avatarSrc: string;
    roomName: string;
    stats: StreamingStats;
    private _room: AccountModel;
    isPremium = false;
    currentNetwork;
    solstreamBalance = 0;
    chains = chains;

    private solanaConnection: solanaWeb3.Connection;
    readonly solstreamToDollar = Utils.convertsolstreamToDollar;

    private intervalId: any;

    @Input()
    set room(room: AccountModel) {
        if (room) {
            this._room = room;
            this.initializeComponent();
        }
    }

    get room(): AccountModel {
        return this._room;
    }

    constructor(private localStorageService: LocalStorageService,
                private statsService: StatsService,
                private roomService: ChannelsService,
                private cus: CurrentUserState,
                public device: DeviceDetectorService,
                private http: HttpClient,
                private metaMaskService: WalletLoginButtonService,
                private snackBar: MatSnackBar,
                private routerService: RouterService,
                private web3UtilitiesService: Web3UtilitiesService,
                private earningService: EarningsService) {
        this.solanaConnection = new solanaWeb3.Connection("https://methodical-indulgent-energy.solana-mainnet.quiknode.pro/12352d1f25bea2b584667f882041deb3e250fdf6/");
        
        this.getWalletBalance();
        this.getUserDomain();
    }

    private initializeComponent(): void {
        this.avatarSrc = this._room.avatarAzureUrl || '/assets/icons/login-btn.png';
        this.roomName = this._room.roomName;
        this.isPremium = this._room.premium;
        this.statsService.getStats(this._room.id).subscribe(rez => this.stats = rez);
        if (this._room.qrCode) {
            this.getBnbPrice();
            this.getsolstreamBalance();
        }
    }

    hasWallet(): boolean {
        return !Boolean(this._room?.qrCode) || this._room?.qrCode !== 'wallet-id';
    }

    getSolBalance(): string {
        const tokensBalance = parseFloat(this.localStorageService.getSolBalance()).toFixed(2);
        if (tokensBalance) {
            return tokensBalance;
        } else {
            return '0';
        }
    }

    getSolBalanceDollars(): string {
        const tokensBalance = this.localStorageService.getSolBalanceUSD();
        if (tokensBalance) {
            return tokensBalance;
        } else {
            return '0';
        }
    }

    getSolStreamBalance(): string {
        const tokensBalance = this.localStorageService.getSolStreamBalance();
        if (tokensBalance) {
            return tokensBalance;
        } else {
            return '0';
        }
    }

    getSolStreamBalanceDollars(): string {
        const tokensBalance = this.localStorageService.getSolStreamBalanceUSD();
        if (tokensBalance) {
            return tokensBalance;
        } else {
            return '0';
        }
    }

    getDollarMATICBalance(): string {
        const maticBalance = parseFloat(this.localStorageService.getMATICBalance());
        if (this.currentMaticPrice && maticBalance) {
            return (maticBalance * this.currentBnbPrice).toFixed(2);
        } else {
            return '0';
        }
    }
    
    goUserDomainDetail() {
        const walletAddress = localStorage.getItem('ptv_user');
        var url;
        if (this.hasUserDomain()) {
            url = 'https://solscan.io/account/' + walletAddress + '#domains';
        } else {
            url = 'https://www.sns.id/';
        }
        window.open(url, '_blank');
    }

    hasUserDomain(): boolean {
        return this.getUserDomainBalance() !== NO_DOMAIN_MESSAGE;
    }

    getUserDomainBalance(): string {
        const walletAddress = localStorage.getItem('ptv_user');
        // const walletAddress = "6P6m3meiXFjzeWLowQ4aDvkakJjBbSwmBRtFAxbA6D3V";
        const storageKey = "user-domain " + walletAddress;//userAddress;
        let userDomainStr = window.localStorage.getItem(storageKey);
        if(userDomainStr !== "calculating" && JSON.parse(userDomainStr) && JSON.parse(userDomainStr).hasDomain){
            return JSON.parse(userDomainStr).domain;
        }
        return NO_DOMAIN_MESSAGE;
    }

    formatWalletAddress = (address: String) => {
		if (!address) return '';
		const start = address.slice(0, 5);
		const end = address.slice(-4);
		return `${start}...${end}`;
	};
    ngOnInit(): void {
        this.getUserDomain();
        this.intervalId = setInterval(() => {
            this.getUserDomain();
        }, 5000);
    }
    ngOnDestroy(): void {
        clearInterval(this.intervalId);
    }
    async getUserDomain(): Promise<void> {
        const walletAddress = localStorage.getItem('ptv_user');
        // const walletAddress = "6P6m3meiXFjzeWLowQ4aDvkakJjBbSwmBRtFAxbA6D3V";
        const storageKey = "user-domain " + walletAddress;//userAddress;
        let userDomainStr = window.localStorage.getItem(storageKey);
        let registedDomain = "";
        try {
            if(userDomainStr !== "calculating" && JSON.parse(userDomainStr)){
                registedDomain = JSON.parse(userDomainStr).domain;
            }
            let waitCounter = 0;
            while (userDomainStr === "calculating" && waitCounter < 3) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (1 + Math.random())));
                userDomainStr = window.localStorage.getItem(storageKey);
                waitCounter++;
            }
            let userDomain = (userDomainStr && userDomainStr !== "calculating") ? JSON.parse(userDomainStr) : undefined;
            if (userDomain && (userDomain.lastUpdated > Date.now() - (userDomain.hasDomain ? 1000 * 60 : 1000 * 10))) {
                return;
            }
            window.localStorage.setItem(storageKey, "calculating");
            const user = new PublicKey(walletAddress);
            const domains = await getAllDomains(this.solanaConnection, user);
            if (domains.length > 0) {
                    const reverses = await reverseLookupBatch(this.solanaConnection, [...domains]);
                    // TODO: need to find the best one
                    userDomain = {
                        domain: reverses[0] + ".sol",
                        lastUpdated: Date.now(),
                        hasDomain: true
                    };
            }
            else {
                    userDomain = {
                        domain: this.formatWalletAddress(walletAddress),
                        lastUpdated: Date.now(),
                        hasDomain: false
                    };
            }
            window.localStorage.setItem(storageKey, JSON.stringify(userDomain));
            if ( registedDomain != userDomain){
                console.log("userDomain:", userDomain);
            }
        } catch{
        }
    }
    async getWalletBalance(): Promise<void> {
        const walletAddress = localStorage.getItem('ptv_user');
        if (!walletAddress) {
            console.error('Wallet address not found in local storage.');
            return;
        }

        const wallet = new PublicKey(walletAddress);

        console.log("Getting SOL and Token Balances: " + wallet);
        try {
            // Fetch SOL balance and price, then calculate USD value
            const lamports = await this.solanaConnection.getBalance(wallet);
            const solBalance = lamports / 1000000000; // Convert lamports to SOL
            const responseSol = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
            const dataSol = await responseSol.json();
            const solPriceUsd = dataSol.solana.usd;
            const solBalanceUsd = solBalance * solPriceUsd;
            localStorage.setItem('SolBalance', solBalance.toString());
            localStorage.setItem('SolBalanceUSD', solBalanceUsd.toFixed(2));

            // Fetch Token (SolStream) balance
            const tokenMintAddress = new PublicKey('54jVZGHyWURX5evBtZqUsJjwoKzcZJbVokDU93AUZf2h');
            const tokenAccounts = await this.solanaConnection.getParsedTokenAccountsByOwner(wallet, {mint: tokenMintAddress});
            if (tokenAccounts.value.length > 0) {
                const tokenBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
                localStorage.setItem('SolStreamBalance',  tokenBalance.toFixed(2));

                // Fetch SolStream token price and calculate USD value
                const responseToken = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solstream&vs_currencies=usd');
                const dataToken = await responseToken.json();
                const tokenPriceUsd = dataToken.solstream.usd; // Replace 'solstream' with the actual ID
                const tokenBalanceUsd = tokenBalance * tokenPriceUsd;
                localStorage.setItem('SolStreamBalanceUSD', tokenBalanceUsd.toFixed(2));
            } else {
                console.log('No token account found for this wallet and mint address.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    private getsolstreamBalance(): void {
        this.earningService.getTotalEarningsV3().subscribe(data => this.solstreamBalance = data.earnings);
    }

    private getBnbPrice(): any {
        this.getBEP20Assets();
        return this.http.get<[]>('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd').subscribe((result: any) => {
            this.currentBnbPrice = Number(parseFloat(result.binancecoin.usd).toFixed(2));
        });
    }

    private getMaticPrice(): any {
        this.getBEP20Assets();
        return this.http.get<[]>('https://api.coingecko.com/api/v3/simple/price?ids=matic=network&vs_currencies=usd').subscribe((result: any) => {
            this.currentMaticPrice = Number(parseFloat(result['matic-network'].usd).toFixed(2));
        });
    }

    private async getBEP20Assets() {
        const tokenABI = [{
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "type": "function"
        }];
        const tokenAddresses = [{
            address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
            token: 'BUSD'
        }]
        if (typeof window.ethereum !== 'undefined') {
            // Instance web3 with the provided information
            const web3 = new Web3(window.ethereum);
            try {
                // Request account access
                // User denied access
                // const bridge = 'https://bridge.walletconnect.org';
                // const connector = new WalletConnect({ bridge });
                // let account;
                // if (connector.connected) { // if trustwallet connected
                //     account = connector.accounts[0];
                // } else {
                //     await window.ethereum.enable();
                //     const accounts = await web3.eth.getAccounts();
                //     account = accounts[0];
                // }
                const userWallet = this.cus.currentUser$.value.username;
                const regex = /^0x[a-fA-F0-9]{40}$/;
                const isValidWallet = userWallet.match(regex);

                if (userWallet && isValidWallet) {
                    this.isMATIC = await this.web3UtilitiesService.isMATICNetwork();
                    this.isBNB = await this.web3UtilitiesService.isBNBNetwork();

                    if (this.isMATIC) {
                        web3.eth.getBalance(userWallet).then((balance) => {
                            this.localStorageService.setMATICBalance((parseFloat(balance) / 1000000000000000000).toFixed(3).toString());
                        });
                    }


                    // @ts-ignore
                    const tokenInst = new web3.eth.Contract(tokenABI, tokenAddresses[0].address);
                    const busdBalance = await tokenInst.methods.balanceOf(userWallet).call();
                    this.localStorageService.setTokensBalance((parseFloat(busdBalance) / 1000000000000000000).toFixed(3).toString());
                }


            } catch (e) {
                console.log('error');
            }
        }
    }

}
