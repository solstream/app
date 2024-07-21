import * as UAuthWeb3Modal from '@uauth/web3modal';
import UAuthSPA from '@uauth/js';
import WalletConnectProvider from '@walletconnect/web3-provider';
// These options are used to construct the UAuthSPA instance.
export const uauthOptions = {
    clientID: '3b29ebd3-f405-4aa6-846c-0e569ea661f0',
    redirectUri: 'https://beta.solstream.io/',

    // Must include both the openid and wallet scopes.
    scope: 'openid wallet',
};

export const providerOptions = {
    'custom-uauth': {
        // The UI Assets
        display: UAuthWeb3Modal.display,

        // The Connector
        connector: UAuthWeb3Modal.connector,

        // The SPA libary
        package: UAuthSPA,

        // The SPA libary options
        options: uauthOptions,
    },
    walletconnect: {
        package: WalletConnectProvider,
        network: 'binance',
        options: {
            rpc: {
                56: 'https://bsc-dataseed.binance.org/',
                97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
            },
            network: 'binance',
            infuraId: 'f5fb1177ba0f4e3d83a97dca27d3974c',
        }
    },
};
export const message = 'Welcome to Solstream TV.\n\n' +
    'Click Sign/Ok to sign in. No password needed!\n\n' +
    'This request will not trigger any transaction or' +
    ' consume any gas fee.\n\n' +
    ' Wallet address:\n';


