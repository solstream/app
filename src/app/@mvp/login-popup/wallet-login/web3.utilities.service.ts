import {Injectable} from '@angular/core';
import { chains } from 'src/app/tokens/tokenomics';
import Web3 from 'web3';


@Injectable({
    providedIn: 'root'
})
export class Web3UtilitiesService {
    connection;
    chains = chains;
    currentNetwork;

    constructor() {
    }

    public isMATICNetwork = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            this.currentNetwork = await web3.eth.net.getId();
            return this.currentNetwork === this.chains.matic.id;
        } catch (e) {
            console.log('Error', e);
            return;
        }
    }

    public isBNBNetwork = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            this.currentNetwork = await web3.eth.net.getId();
            return this.currentNetwork === this.chains.bnb.id;
        } catch (e) {
            console.log('Error', e);
            return;
        }
    }
}
