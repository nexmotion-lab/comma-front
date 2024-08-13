import axios from "axios";
import {alertController, useIonRouter} from "@ionic/vue";
import {Preferences} from "@capacitor/preferences";


const apiClient = axios.create({
    baseURL: 'https://www.comma-coders.com:8998',
    timeout: 10000,
    withCredentials: false
})

export async function setTokens(accessToken, refreshToken) {
    await Preferences.set({key: 'access_token', value: accessToken})
    await Preferences.set({key: 'refresh_token', value: refreshToken})
    console.log(`엑세스토큰: ${accessToken}, 리프레시토큰: ${refreshToken}`);
}

export async function getAccessToken() {
    const { value } = await Preferences.get({key: 'access_token'})
    return value;
}

export async function getRefreshToken() {
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

export async function isLogin() {
    console.log("첫 로그인 로직 시작")
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    console.log("엑세스토큰, 리프레시토큰", accessToken, refreshToken)
    if (!accessToken && !refreshToken) {
        return false;
    }
    return (!isTokenExpired(accessToken) || !isTokenExpired(refreshToken));
}

apiClient.interceptors.request.use(async config => {
    console.log("axios request 로직 시작")

    let token = await getAccessToken();

    if (isTokenExpired(token)) {
        token = await getRefreshToken();
        console.log("axios 리프레시 토큰")
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

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

function isTokenExpired(token: string) {
    console.log("넘어온 토큰", token)
    if (!token) {
        return true;
    }
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    return (decoded.exp * 1000) < Date.now();
}

apiClient.interceptors.response.use(
    async response => {
        const authorizationHeader = response.headers['authorization'];

        console.log(response.headers, "헤더값");

        if (authorizationHeader) {
            let newAccessToken = '';
            let newRefreshToken = '';

            const tokens = authorizationHeader.split(',');

            tokens.forEach((token: string) => {
                token = token.trim();

                // Access Token 처리 (Bearer로 시작하는 토큰)
                if (token.startsWith('Bearer ')) {
                    const jwtToken = token.replace('Bearer ', '').trim();
                    const decodedToken = parseJwt(jwtToken);

                    if (decodedToken && decodedToken.sub === 'AccessToken') {
                        newAccessToken = jwtToken;
                        console.log(`add accesstoken ${newAccessToken}`);
                    }
                }
                // Refresh Token 처리 (Bearer 없이 그냥 오는 토큰)
                else {
                    const jwtToken = token.trim();
                    const decodedToken = parseJwt(jwtToken);

                    if (decodedToken && decodedToken.sub === 'RefreshToken') {
                        newRefreshToken = jwtToken;
                        console.log(`add refreshtoken ${newRefreshToken}`);
                    }
                }
            });

            // 토큰이 모두 있는 경우 저장
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
                showAlert(status, errorData.message);
                console.log(error)
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