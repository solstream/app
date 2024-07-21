import {TOKEN_PRICE_DOLLARS} from '../constants/fees';

export const convertsolstreamToDollar = (solstream: number, decimals = 2): string => {
    return (solstream * TOKEN_PRICE_DOLLARS).toFixed(decimals);
};
