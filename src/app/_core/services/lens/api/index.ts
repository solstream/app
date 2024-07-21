import {Client, createClient as createUrqlClient} from 'urql';
import {refresh, authenticate as authenticateMutation} from './mutations';

const API_URLS = {
    main: 'https://api.lens.dev',
    testnet: 'https://api-mumbai.lens.dev/',
};

export const STORAGE_KEY = 'LH_STORAGE_KEY';

export const getClient = async (chain: string): Promise<Client> => {
    const storageData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (storageData) {
        const {accessToken} = await refreshAuthToken(chain);
        return createUrqlClient({
            url: API_URLS[chain],
            fetchOptions: {
                headers: {
                    'x-access-token': `Bearer ${accessToken}`,
                },
            },
        });
    } else {
        return createUrqlClient({
            url: API_URLS[chain],
        });
    }
};

export const getBasicClient = (chain: string) =>
    createUrqlClient({
        url: API_URLS[chain],
    });

export const isSignedIn = (): boolean => {
    const token = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (token) {
        return true;
    }
    return false;
};

export const signIn = async (
    chain: string,
    account: string,
    signature: string
): Promise<void> => {
    const urqlClient = await getClient(chain);
    const authData = await urqlClient
        .mutation(authenticateMutation, {
            address: account,
            signature,
        })
        .toPromise();
    const {accessToken, refreshToken} = authData.data.authenticate;
    const accessTokenData = parseJwt(accessToken);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            accessToken,
            refreshToken,
            exp: accessTokenData.exp,
        })
    );
};

export const refreshAuthToken = async (chain: string) => {
    const token = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!token) {
        return;
    }
    try {
        const client = await getBasicClient(chain);
        const authData = await client
            .mutation(refresh, {
                refreshToken: token.refreshToken,
            })
            .toPromise();

        const {accessToken, refreshToken} = authData.data.refresh;
        const exp = parseJwt(refreshToken).exp;

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                accessToken,
                refreshToken,
                exp,
            })
        );

        return {
            accessToken,
        };
    } catch (err) {
        console.log('error:', err);
    }
};

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
}

export {
    recommendProfiles,
    getProfiles,
    getPublications,
    searchProfiles,
    searchPublications,
    explorePublications,
    doesFollow,
    getChallenge,
} from './queries';

export {
    followUser,
    authenticate,
    refresh,
    createUnfollowTypedData,
    broadcast,
} from './mutations';
