import axios from "axios";
import { alertController } from "@ionic/vue";
import {Preferences} from "@capacitor/preferences";

const apiClient = axios.create({
    baseURL: 'https://www.comma-coders.com:8998',
    timeout: 10000,
    withCredentials: true
})

async function setTokens(accessToken, refreshToken) {
    await Preferences.set({key: 'access_token', value: accessToken})
    await Preferences.set({key: 'refresh_token', value: refreshToken})
    console.log(`엑세스토큰: ${accessToken}, 리프레시토큰: ${refreshToken}`);
}

async function getAccessToken() {
    const { value } = await Preferences.get({key: 'access_token '})
    return value;
}

async function getRefreshToken() {
    const { value } = await Preferences.get({key: 'refresh_token'})
    return value;
}


async function showAlert(header, message) {
    const alert = await alertController.create({
        header: header,
        message: message,
        buttons: ['확인'],
        cssClass: 'error-alert'
    })
    await alert.present();
}

apiClient.interceptors.request.use(async config => {
    let token = await getAccessToken();
    let tokenName = "accessToken";

    if (token && isTokenExpired(token)) {
        token = await getRefreshToken();
        tokenName = 'refreshToken';
    }

    if (token) {
        config.headers['Cookie'] = `${tokenName}=${token}`;
    }
    console.log(`쿠키 보냈음 ${tokenName} ${token}`)
    return config;
}, error => {
    return Promise.reject(error);
    }
)

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

function isTokenExpired(token) {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    return (decoded.exp * 1000) < Date.now();
}

apiClient.interceptors.response.use(
    async response => {
        const setCookieHeader = response.headers['Set-Cookie'];

        if (setCookieHeader) {
            let newAccessToken = '';
            let newRefreshToken = '';

            setCookieHeader.forEach((cookie: string) => {
                if (cookie.includes('accessToken')) {
                    newAccessToken = cookie.split('=')[1].split(';')[0];
                    console.log(`add accesstoken ${newAccessToken}`)
                }
                if (cookie.includes('refreshToken')) {
                    newRefreshToken = cookie.split('=')[1].split(';')[0];
                    console.log(`add refreshtoken ${newRefreshToken}`)

                }
            });
            if (newAccessToken && newRefreshToken) {
                await setTokens(newAccessToken, newRefreshToken);
            }
        }
        return response;
    },
    error => {
        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            if (errorData.errorCode) {
                handleGlobalError(errorData.errorCode, errorData.detail);
            } else {
                showAlert(status, errorData.detail);
            }

        } else {
            console.error('Network Error or No Response from Server');
        }
        return Promise.reject(error);
    }
);

function handleGlobalError(errorCode, message) {
    showAlert(`Error Code: ${errorCode}`, message);
}



export default apiClient;