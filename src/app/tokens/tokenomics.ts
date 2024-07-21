import { utils } from 'ethers';

export const tokenomicsConf = {
    chain: 'BSC',
    currencyBNB: 'BNB',
    currencyMATIC: 'MATIC',
    solstreamSymbol: '$STREAM',
    solSymbol: '$SOL',
    tokenSymbol: 'BUSD',
    currencyValueAPI: 'https://coinograph.io/ticker/?symbol=binance:bnbusdt',
    currencyLogo: 'assets/logos/bnb.png',
    tokenLogo: 'assets/logos/busd.png',
};

export const chains = {
    bnb: {
        id: 56,
        ex: '0x38',
        name: 'Binance Smart Chain',
        networkMap: {
            chainName: 'Binance Smart Chain',
            chainId: utils.hexValue(56), // '0x38'
            nativeCurrency: {
                name: 'Binance Coin',
                symbol: 'BNB',
                decimals: 18
            },
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            blockExplorerUrls: ['https://bscscan.com']
        }
    },
    matic: {
        id: 137,
        ex: '0x313337',
        name: 'Matic',
        networkMap: {
        chainId: utils.hexValue(137), // '0x89'
        chainName: 'Matic(Polygon) Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://www.polygonscan.com/'],
        }
    },
    ethereum: {
        id: 1,
        ex: '0x1',
        name: 'ETH',
        networkMap: {
            networkMap: {
                chainId: '0x1',
            },
            chainId: '0x1'
        }
    }
};
