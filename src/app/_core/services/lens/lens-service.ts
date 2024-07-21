import {Injectable} from '@angular/core';
import {ethers, providers} from 'ethers';
import {Client} from 'urql';
import ABI from './abi.json';
import {getClient, isSignedIn, signIn} from './api';
import {getChallenge, getProfile, getProfiles, myProfile} from './api/queries';

const ADDRESSES = {
    '137': '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d', // polygon main
    '80001': '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82', // mumbai
    '3': '0xDe0FDE34DB892879b3921CaA829E9A51C7744577'  // ropsten
};

@Injectable({
    providedIn: 'root'
})
export class LensService {
    networkName;

    async follow(authorId: string): Promise<boolean> {
        try {
            const contract = await this.getContract();
            const tx = await contract.follow([authorId], [0x0]);
            const isSuccess = await this.sendTx(tx);
            return isSuccess;
        } catch (err) {
            console.log('error: ', err);
        }
        return false;
    }

    async unfollow(authorId: string): Promise<boolean> {
        try {
            const contract = await this.getContract();
            const tx = await contract.burn(authorId);
            return await this.sendTx(tx);
        } catch (err) {
            console.log('error:', err);
        }
        return false;
    }


    async hasProfile(id: string): Promise<boolean> {
        try {
            const client = await this.getApiClient();
            const response = await client.query(getProfiles, {id}).toPromise();
            const hasProfile = response.data.profiles.items.length !== 0;
            if (hasProfile) {
                if (!isSignedIn()) {
                    const result = confirm('The content creator has a Lens account, do you want to connect to Lens too?');
                    let doc;
                    if (result === true) {
                        await this.signInApi(client, this.networkName);
                    } else {
                        doc = 'Cancel.';
                    }

                }
            }
            return hasProfile;
        } catch (err) {
            console.error('error:', err);
        }
        return false;
    }

    async fetchProfile(id: string): Promise<any> {
        try {
            const client = await this.getApiClient();
            const response = await client.query(getProfiles, {id}).toPromise();
            if (response.data.profiles.items.length !== 0) {
                return response.data.profiles.items[0];
            }
            return null;
        } catch (err) {
            console.error('error:', err);
        }
        return false;
    }

    async isFollowing(authorId: string): Promise<boolean> {
        try {
            const profile = await this.fetchProfile(authorId);
            return profile.isFollowedByMe;
        } catch (err) {
            console.error('error:', err);
        }
        return false;
    }

    async getContract(): Promise<ethers.Contract> {
        const networkId = await this.getNetworkId();
        const address = ADDRESSES[networkId];
        const contract = new ethers.Contract(
            address,
            ABI,
            this.getSigner()
        );
        return contract;
    }

    async sendTx(tx: any): Promise<boolean> {
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const feeData = await provider.getFeeData()

        // tx.gasPrice = feeData.gasPrice;
        // tx.gasLimit = feeData.maxFeePerGas;

        // console.log('TX : ');
        // console.log(tx);

        await tx.wait();
        return true;
    }

    getSigner() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return provider.getSigner();
    }

    async getApiClient(): Promise<Client> {
        const networkId = await this.getNetworkId();
        this.networkName = networkId == 137 ? 'main' : 'testnet';
        const client = await getClient(this.networkName);
        // if (!isSignedIn()) {
        //         await this.signInApi(client, networkName);
        // }
        return client;
    }

    async signInApi(client: Client, networkName: string): Promise<void> {
        const accounts = await window.ethereum.send(
            'eth_requestAccounts'
        );
        const account = accounts.result[0];

        const response = await client.query(getChallenge, {
            address: account
        }).toPromise();

        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(response.data.challenge.text);

        await signIn(networkName, account, signature);
    }

    async getNetworkId(): Promise<number> {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const networkId = (await provider.getNetwork()).chainId;
        return networkId;
    }

}
