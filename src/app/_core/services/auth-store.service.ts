import {Injectable} from '@angular/core';
import {Constants} from '../constants/constants';
import {v4 as uuidv4} from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {
    }

    setPTVToke(token: string): void {
        const save = token.split(' ')[1];
        localStorage.setItem(Constants.PTV_JWT, save);
    }

    setDoblyToken(key: string, secret: string): void {
        localStorage.setItem(Constants.DOLBY_KEY, key);
        localStorage.setItem(Constants.DOLBY_SECRET, secret);
    }

    setUserName(username: string): void {
        localStorage.setItem(Constants.USERNAME, username);
    }

    setUserId(id: string): void {
        localStorage.setItem('userId', id);
    }

    setTokensBalance(amount: string): void {
        localStorage.setItem(Constants.TOKENSBALANCE, amount);
    }

    setMATICBalance(amount: string): void {
        localStorage.setItem(Constants.MATICBALANCE, amount);
    }

    setUserNameObserver(username: string): void {
        localStorage.setItem(Constants.USERNAMEOBSERVER, username);
    }

    private getUserNameObserver1(): string {
        return localStorage.getItem(Constants.USERNAMEOBSERVER);
    }

    getUserNameObserver(): string {
        let userName = this.getUserNameObserver1();
        if (userName === null) {
            userName = 'USER-' + uuidv4().toUpperCase();
            this.setUserNameObserver(userName);
        }
        return userName;
    }

    getSecurityUserName(): string {
        return localStorage.getItem(Constants.USERNAME);
    }

    getTokensBalance(): string {
        return localStorage.getItem(Constants.TOKENSBALANCE);
    }

    getSolBalance(): string {
        return localStorage.getItem(Constants.SOLBALANCE);
    }
    getSolBalanceUSD(): string {
        return localStorage.getItem(Constants.SOLBALANCEUSD);
    }

    getSolStreamBalance(): string {
        return localStorage.getItem(Constants.SOLSTREAMBALANCE);
    }

    getUploadedVideosNumber(): string {
        return localStorage.getItem(Constants.UPLOADEDVIDEOSNUMBER);
    }
    getSolStreamBalanceUSD(): string {
        return localStorage.getItem(Constants.SOLSTREAMBALANCEUSD);
    }

    getMATICBalance(): string {
        return localStorage.getItem(Constants.MATICBALANCE);
    }

    isAdmin(): boolean {
        return this.getSecurityUserName() === 'admin';
    }

    isWallet(): boolean {
        return localStorage.getItem(Constants.METAMASK) === 'true';
    }

    setIsWallet(val: boolean): void {
        return localStorage.setItem(Constants.METAMASK, val.toString());
    }

    getDolbyKey(): string {
        return 'I1m1J4ZNcxGq_JO5BrSGhg==';
        // return localStorage.getItem(Constants.DOLBY_KEY);
    }

    getDolbySecret(): string {
        return '37GCjmDAOkgpra9KsnQYEkrfhtGxTdR1PtgHDEZa58w=';
        // return localStorage.getItem(Constants.DOLBY_SECRET);
    }

    getToken(): string {
        return localStorage.getItem(Constants.PTV_JWT);
    }

    storeWToken(token: string): void {
        localStorage.setItem(Constants.W_JWT, token);
    }

    getWToken(): string {
        return localStorage.getItem(Constants.W_JWT);
    }

    setFlagShowCookiesBar(showCookiesBar: string): void {
        localStorage.setItem(Constants.SHOWCOOKIESBAR, showCookiesBar);
    }

    setFlagDemoDisclaimer(showDemo: string): void {
        localStorage.setItem(Constants.DEMO_DISCLAIMER, showDemo);
    }

    setFlagShowPishingAlertBar(showPishingAlertBar: string): void {
        localStorage.setItem(Constants.SHOW_PISHING_ALERT_BAR, showPishingAlertBar);
    }

    setFlagVideoDisclaimer(showVideoDisclaimer: string): void {
        sessionStorage.setItem(Constants.VIDEO_DISCLAIMER, showVideoDisclaimer);
    }

    getFlagShowCookiesBar(): string {
        return localStorage.getItem(Constants.SHOWCOOKIESBAR);
    }

    getFlagDemoDisclaimer(): string {
        return localStorage.getItem(Constants.DEMO_DISCLAIMER);
    }

    getFlagPishingAlertBar(): string {
        return localStorage.getItem(Constants.SHOW_PISHING_ALERT_BAR);
    }

    setWelcomeRoomBotConf(welcomeRoomBotConf: string): void {
        localStorage.setItem(Constants.WELCOME_ROOM_BOT_CONF, welcomeRoomBotConf);
    }

    getWelcomeRoomBotConf(): string {
        return localStorage.getItem(Constants.WELCOME_ROOM_BOT_CONF);
    }

    getFlagVideoDisclaimer(): string {
        return sessionStorage.getItem(Constants.VIDEO_DISCLAIMER);
    }

    removeSecrets(): void {
        localStorage.removeItem(Constants.DOLBY_KEY);
        // localStorage.removeItem('walletconnect');
        localStorage.removeItem(Constants.PTV_JWT);
        localStorage.removeItem(Constants.W_JWT);
        localStorage.removeItem(Constants.DOLBY_SECRET);
        localStorage.removeItem(Constants.DOLBY_API_KEY);
        localStorage.removeItem(Constants.USERNAME);
        localStorage.removeItem(Constants.TOKENSBALANCE);
        localStorage.removeItem(Constants.BNBBALANCE);
        localStorage.removeItem(Constants.MATICBALANCE);
        localStorage.removeItem(Constants.METAMASK);
        localStorage.removeItem(Constants.WALLET_CONNECT);
        localStorage.removeItem(Constants.SOLBALANCE);
        localStorage.removeItem(Constants.SOLBALANCEUSD);
        localStorage.removeItem(Constants.SOLSTREAMBALANCE);
        localStorage.removeItem(Constants.SOLSTREAMBALANCEUSD);
    }

    hasCredentials(): boolean {
        if (this.getSecurityUserName()) {
            return true;
        }
        return false;
    }

}
