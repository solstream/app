import {Injectable} from '@angular/core';
import {WalletAuthService} from '../../@mvp/login-popup/wallet-login/wallet-auth.service';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import WalletConnect from '@walletconnect/browser';
import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import {ethers, providers} from 'ethers';
import {toBN} from 'web3-utils';
import {User} from '../../pages/admin-pages/admin.component';

// This interface presents the return value of the transfer
export interface TransactionResult {
    succeed: boolean;
    txId: string | undefined;
}

@Injectable({
    providedIn: 'root'
})
export class TxService {
// token address should be configured somewhere, not hard-coded like here, contract abi can also be read from json instead of here
// _tokenAddress:string = '0x557dd6700e66818AF340ccE17FD4508CED81fBc1'; // contract address on Mainnet
    _tokenAddress = '0xFCF52B627f1c4B813D8813441e378868C72d7BeE'; // contract address on Testnet
    _contractAbi: any = [
        {inputs: [], stateMutability: 'nonpayable', type: 'constructor'}, {
            anonymous: false,
            inputs: [{
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address'
            }, {indexed: true, internalType: 'address', name: 'spender', type: 'address'}, {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            }],
            name: 'Approval',
            type: 'event'
        }, {
            anonymous: false,
            inputs: [{indexed: false, internalType: 'uint256', name: 'minTokensBeforeSwap', type: 'uint256'}],
            name: 'MinTokensBeforeSwapUpdated',
            type: 'event'
        }, {
            anonymous: false,
            inputs: [{
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address'
            }, {indexed: true, internalType: 'address', name: 'newOwner', type: 'address'}],
            name: 'OwnershipTransferred',
            type: 'event'
        }, {
            anonymous: false,
            inputs: [{
                indexed: false,
                internalType: 'uint256',
                name: 'tokensSwapped',
                type: 'uint256'
            }, {
                indexed: false,
                internalType: 'uint256',
                name: 'ethReceived',
                type: 'uint256'
            }, {indexed: false, internalType: 'uint256', name: 'tokensIntoLiqudity', type: 'uint256'}],
            name: 'SwapAndLiquify',
            type: 'event'
        }, {
            anonymous: false,
            inputs: [{indexed: false, internalType: 'bool', name: 'enabled', type: 'bool'}],
            name: 'SwapAndLiquifyEnabledUpdated',
            type: 'event'
        }, {
            anonymous: false,
            inputs: [{
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address'
            }, {indexed: true, internalType: 'address', name: 'to', type: 'address'}, {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            }],
            name: 'Transfer',
            type: 'event'
        }, {
            inputs: [],
            name: '_liquidityFee',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: '_maxTxAmount',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: '_taxFee',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'owner', type: 'address'}, {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            }],
            name: 'allowance',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'spender', type: 'address'}, {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }],
            name: 'approve',
            outputs: [{internalType: 'bool', name: '', type: 'bool'}],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'account', type: 'address'}],
            name: 'balanceOf',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: 'decimals',
            outputs: [{internalType: 'uint8', name: '', type: 'uint8'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'spender', type: 'address'}, {
                internalType: 'uint256',
                name: 'subtractedValue',
                type: 'uint256'
            }],
            name: 'decreaseAllowance',
            outputs: [{internalType: 'bool', name: '', type: 'bool'}],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'uint256', name: 'tAmount', type: 'uint256'}],
            name: 'deliver',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'account', type: 'address'}],
            name: 'excludeFromFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'account', type: 'address'}],
            name: 'excludeFromReward',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [],
            name: 'geUnlockTime',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'account', type: 'address'}],
            name: 'includeInFee',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'account', type: 'address'}],
            name: 'includeInReward',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'spender', type: 'address'}, {
                internalType: 'uint256',
                name: 'addedValue',
                type: 'uint256'
            }],
            name: 'increaseAllowance',
            outputs: [{internalType: 'bool', name: '', type: 'bool'}],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'account', type: 'address'}],
            name: 'isExcludedFromFee',
            outputs: [{internalType: 'bool', name: '', type: 'bool'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'account', type: 'address'}],
            name: 'isExcludedFromReward',
            outputs: [{internalType: 'bool', name: '', type: 'bool'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'uint256', name: 'time', type: 'uint256'}],
            name: 'lock',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [],
            name: 'name',
            outputs: [{internalType: 'string', name: '', type: 'string'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: 'owner',
            outputs: [{internalType: 'address', name: '', type: 'address'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'uint256', name: 'tAmount', type: 'uint256'}, {
                internalType: 'bool',
                name: 'deductTransferFee',
                type: 'bool'
            }],
            name: 'reflectionFromToken',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'uint256', name: 'liquidityFee', type: 'uint256'}],
            name: 'setLiquidityFeePercent',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'uint256', name: 'maxTxPercent', type: 'uint256'}],
            name: 'setMaxTxPercent',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'bool', name: '_enabled', type: 'bool'}],
            name: 'setSwapAndLiquifyEnabled',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'uint256', name: 'taxFee', type: 'uint256'}],
            name: 'setTaxFeePercent',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [],
            name: 'swapAndLiquifyEnabled',
            outputs: [{internalType: 'bool', name: '', type: 'bool'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: 'symbol',
            outputs: [{internalType: 'string', name: '', type: 'string'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'uint256', name: 'rAmount', type: 'uint256'}],
            name: 'tokenFromReflection',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: 'totalFees',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: 'totalSupply',
            outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'recipient', type: 'address'}, {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }],
            name: 'transfer',
            outputs: [{internalType: 'bool', name: '', type: 'bool'}],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'sender', type: 'address'}, {
                internalType: 'address',
                name: 'recipient',
                type: 'address'
            }, {internalType: 'uint256', name: 'amount', type: 'uint256'}],
            name: 'transferFrom',
            outputs: [{internalType: 'bool', name: '', type: 'bool'}],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [{internalType: 'address', name: 'newOwner', type: 'address'}],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {
            inputs: [],
            name: 'uniswapV2Pair',
            outputs: [{internalType: 'address', name: '', type: 'address'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: 'uniswapV2Router',
            outputs: [{internalType: 'contract IUniswapV2Router02', name: '', type: 'address'}],
            stateMutability: 'view',
            type: 'function'
        }, {
            inputs: [],
            name: 'unlock',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        }, {stateMutability: 'payable', type: 'receive'}
    ];

    public txInProgress = new BehaviorSubject<boolean>(false);

    constructor(private walletService: WalletAuthService) {
    }

    private async connect(): Promise<any> {
        const providerOptions = {
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

        const web3Modal = new Web3Modal({
            providerOptions
        });
        const provider = await web3Modal.connect();
        return new Web3(provider);
    }

    public async sendBEP20(receiverAddress: string, amount: number): Promise<TransactionResult> {
        try {
            let connection;
            connection = await this.walletService.connect();
            const {web3, walletAddress} = connection;
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);

// it' also possible to take the sender address from what is selected in Metamask :
            console.log((web3.currentProvider as any).selectedAddress);


            const contract = await new web3.eth.Contract(this._contractAbi, this._tokenAddress);

            const tx = await contract.methods.transfer(receiverAddress, amount).send({from: walletAddress});
            return {
                succeed: true, txId: tx
            };
        } catch (err: any) {
            console.error(err);
            return {succeed: false, txId: undefined};
        }
    }

    public async sendBNB(receiverAddress: string, amount: number): Promise<TransactionResult> {
        try {
            amount = this.convertToSendableBNB(amount);
            const web3 = await this.connect();
            const walletAddress = await web3.eth.getAccounts();


            // it' also possible to take the sender address from what is selected in Metamask :
            console.log((web3.currentProvider as any).selectedAddress);

            const txConfig = {
                from: walletAddress[0],
                to: receiverAddress,
                value: web3.utils.toBN(amount),
                maxPriorityFeePerGas: null,
                maxFeePerGas: null
            };

            let tx;
            this.txInProgress.next(true);
            web3.eth.sendTransaction(txConfig)
                .once('transactionHash', (hash) => {
                    console.log(hash);
                    // Backend should trigger this and save the interaction in DB donator and receiver
                    this.txInProgress.next(false);
                    return {succeed: 'progress', txId: hash};
                }).on('confirmation', (confNumber, receipt, latestBlockHash) => {
                console.log(confNumber, receipt, latestBlockHash);
            }).then((trx) => {
                tx = trx;
            }, (err) => {
                console.log(err);
                this.txInProgress.next(false);
                return {succeed: true, txId: tx.transactionHash};
            });

        } catch (err: any) {
            console.error(err);
            this.txInProgress.next(false);
            return {
                succeed: false, txId: undefined
            };
        }
    }

    convertToSendableBNB(amount: number): number {
        // // const amountBNB = 10000000000000; // this is 0.001 BNB
        const fixedAmount = amount.toFixed(3);
        const floatAmount = parseFloat(fixedAmount);
        const toParse = floatAmount * 1000000000000000000;

        return toParse;
    }

    public async checkAndSwitchBSC(provider): Promise<any> {
        // const network = await provider.eth.getChainId();
        // if (network.chainId !== 56) {
        //     confirm('Current network not supported. Please switch to Binance Smart Chain');
        //     try {
        //         await window.ethereum.request({
        //             method: 'wallet_switchEthereumChain',
        //             params: [{chainId: '0x38'}]
        //         });
        //         return Promise.resolve();
        //     } catch (error) {
        //         alert(error.message);
        //         return Promise.reject(error.message);
        //     }
        // } else {
        return Promise.resolve();
        // }
    }

    sendBNB$(receiverAddress: string, amount: number): Observable<any> {
        return Observable.create(observer => {
            try {
                const bridge = 'https://bridge.walletconnect.org';
                const connector = new WalletConnect({bridge});
                if (!connector.connected) { // if not trustwallet or not trustwalelt yet
                    // if injected wallet is there
                    if (window.ethereum) {
                        const provider = new Web3(window.web3.currentProvider);
                        provider.eth.getAccounts().then((accounts) => {
                            // is connected to metamask
                            if (accounts.length > 0) {
                                this.checkAndSwitchBSC(provider).then(() => {
                                    this.sendStandardETH(provider, accounts[0], receiverAddress, amount, observer);
                                });
                            } else {
                                // Modal should say, do you want to donate in anonymous way or login
                                // for now we just donate anonymously
                                const providerOptions = {
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
                                const web3Modal = new Web3Modal({
                                    cacheProvider: false, // optional
                                    providerOptions, // required
                                    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
                                });
                                try {
                                    web3Modal.connect().then(() => {
                                        const newConnector = new WalletConnect({bridge});
                                        // Send transaction
                                        const txConfig: any = {
                                            from: newConnector.accounts[0],
                                            to: receiverAddress,
                                            value: Web3.utils.toWei(amount.toString(), 'ether'),
                                            maxPriorityFeePerGas: null,
                                            maxFeePerGas: null
                                        };
                                        this.txInProgress.next(true);
                                        newConnector
                                            .sendTransaction(txConfig)
                                            .then(result => {
                                                this.txInProgress.next(false);
                                                observer.next({succeed: 'progress', txId: result});
                                            })
                                            .catch(error => {
                                                this.txInProgress.next(false);
                                                observer.error({succeed: false, txId: error});
                                            });
                                    }, (error) => {
                                        // closed by user
                                        this.txInProgress.next(false);
                                        observer.error({succeed: false, txId: error});
                                    });
                                } catch (e) {
                                    console.log('Could not get a wallet connection', e);
                                    return;
                                }
                            }
                        });
                    } else {
                        // Modal should say, do you want to donate in anonymous way or login
                        // for now we just donate anonymously
                        const providerOptions = {
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
                        const web3Modal = new Web3Modal({
                            cacheProvider: false, // optional
                            providerOptions, // required
                            disableInjectedProvider: true, // optional. For MetaMask / Brave / Opera.
                        });
                        try {
                            web3Modal.connect().then(() => {
                                const newConnector = new WalletConnect({bridge});
                                // Send transaction
                                const txConfig: any = {
                                    from: newConnector.accounts[0],
                                    to: receiverAddress,
                                    value: Web3.utils.toWei(amount.toString(), 'ether'),
                                    maxPriorityFeePerGas: null,
                                    maxFeePerGas: null
                                };
                                this.txInProgress.next(true);
                                newConnector
                                    .sendTransaction(txConfig)
                                    .then(result => {
                                        this.txInProgress.next(false);
                                        observer.next({succeed: 'progress', txId: result});
                                    })
                                    .catch(error => {
                                        this.txInProgress.next(false);
                                        observer.error({succeed: false, txId: error});
                                    });
                            }, (error) => {
                                // closed by user
                                this.txInProgress.next(false);
                                observer.error({succeed: false, txId: error});
                            });
                        } catch (e) {
                            console.log('Could not get a wallet connection', e);
                            return;
                        }
                    }
                } else {
                    // Send transaction
                    const txConfig: any = {
                        from: connector.accounts[0],
                        to: receiverAddress,
                        value: Web3.utils.toWei(amount.toString(), 'ether'),
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null
                    };
                    this.txInProgress.next(true);

                    connector
                        .sendTransaction(txConfig)
                        .then(result => {
                            this.txInProgress.next(false);
                            observer.next({succeed: 'progress', txId: result});
                        })
                        .catch(error => {
                            this.txInProgress.next(false);
                            observer.error({succeed: false, txId: error});
                        });
                }

                // Subscribe to connection events
                connector.on('connect', (error, payload) => {
                    if (error) {
                        throw error;
                    }

                    // Close QR Code Modal
                    WalletConnectQRCodeModal.close();

                    // Get provided accounts and chainId
                    const {accounts, chainId} = payload.params[0];
                });

                connector.on('session_update', (error, payload) => {
                    if (error) {
                        throw error;
                    }

                    // Get updated accounts and chainId
                    const {accounts, chainId} = payload.params[0];
                });

                connector.on('disconnect', (error, payload) => {
                    if (error) {
                        throw error;
                    }

                    // Delete connector
                });
            } catch (err: any) {
                console.error(err);
                observer.error({
                    succeed: false, txId: undefined
                });
            }
        });
    }

    sendStandardETH(provider, account, receiverAddress, amount, observer): void {
        amount = this.convertToSendableBNB(amount);
        this.txInProgress.next(true);
        const txConfig = {
            from: account,
            to: receiverAddress,
            value: toBN(amount),
            maxPriorityFeePerGas: null,
            maxFeePerGas: null
        };
        let tx;
        provider.eth.sendTransaction(txConfig)
            .once('transactionHash', (hash) => {
                console.log(hash);
                // Backend should trigger this and save the interaction in DB donator and receiver
                this.txInProgress.next(false);
                observer.next({succeed: 'progress', txId: hash});
            }).on('confirmation', (confNumber, receipt, latestBlockHash) => {
            this.txInProgress.next(false);
            observer.next({confNumber, receipt, latestBlockHash});
        }).then((trx) => {
            tx = trx;
        }, (err) => {
            console.log(err);
            this.txInProgress.next(false);
            observer.error({succeed: false, txId: tx?.transactionHash});
        });
    }

    iOS(): boolean {
        return (
            [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod',
            ].includes(navigator.platform) ||
            // iPad on iOS 13 detection
            (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
        );
    }

}
