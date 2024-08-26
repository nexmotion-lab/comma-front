import axios from "axios";
import { alertController } from "@ionic/vue";
import {KeychainAccess, SecureStorage} from "@aparajita/capacitor-secure-storage";
import router from "@/router";
import {Capacitor} from "@capacitor/core";

const isIOS = Capacitor.getPlatform() === 'ios';
const syncOption = isIOS ? false : undefined;

const apiClient = axios.create({
    baseURL: "https://www.comma-coders.com:8998",
    timeout: 10000,
    withCredentials: false,
});

export async function setTokens(accessToken, refreshToken) {
    await SecureStorage.set("access_token", accessToken, true, syncOption, KeychainAccess.whenUnlocked);
    await SecureStorage.set("refresh_token", refreshToken, true, syncOption, KeychainAccess.whenUnlocked);
    console.log(`엑세스토큰: ${accessToken}, 리프레시토큰: ${refreshToken}`);
}

export async function getAccessToken() {
    const accessToken = await SecureStorage.get("access_token", true, syncOption);
    return accessToken;
}

export async function getRefreshToken() {
    const refreshToken = await SecureStorage.get("refresh_token", true, syncOption);
    return refreshToken;
}

async function showAlert(header, message) {
    const alert = await alertController.create({
        header: header,
        message: message,
        buttons: ["확인"],
        cssClass: "error-alert",
    });
    await alert.present();
}

export async function isLogin() {
    console.log("첫 로그인 로직 시작");
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    console.log("엑세스토큰, 리프레시토큰", accessToken, refreshToken);
    if (!accessToken && !refreshToken) {
        return false;
    }
    return !isTokenExpired(accessToken) || !isTokenExpired(refreshToken);
}

apiClient.interceptors.request.use(
    async (config) => {
        console.log("axios request 로직 시작");

        let token = await getAccessToken();

        if (isTokenExpired(token)) {
            token = await getRefreshToken();
            console.log("axios 리프레시 토큰");
        }

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
}

function isTokenExpired(token) {
    console.log("넘어온 토큰", token);
    if (!token) {
        return true;
    }
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    console.log(Date.now());
    console.log(decoded.exp * 1000);
    console.log(decoded.exp * 1000 < Date.now());
    return decoded.exp * 1000 < Date.now();
}
apiClient.interceptors.response.use(
    async (response) => {
        const authorizationHeader = response.headers["authorization"];

        console.log(response.headers, "헤더값");

        if (authorizationHeader) {
            let newAccessToken = "";
            let newRefreshToken = "";

            const tokens = authorizationHeader.split(",");

            tokens.forEach((token) => {
                token = token.trim();

                if (token.startsWith("Bearer ")) {
                    const jwtToken = token.replace("Bearer ", "").trim();
                    const decodedToken = parseJwt(jwtToken);

                    if (decodedToken && decodedToken.sub === "AccessToken") {
                        newAccessToken = jwtToken;
                        console.log(`add accesstoken ${newAccessToken}`);
                    }
                }
                else {
                    const jwtToken = token.trim();
                    const decodedToken = parseJwt(jwtToken);

                    if (decodedToken && decodedToken.sub === "RefreshToken") {
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
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            if (error.response.headers["X-Redirect"] === "login") {
                router.replace({ name: "Login" });
            }

            if (errorData.errorCode) {
                handleGlobalError(errorData.errorCode, errorData.detail);
            } else {
                showAlert(status, errorData.detail);
                console.log(error);
            }
        } else {
            console.error("Network Error or No Response from Server");
        }
        return Promise.reject(error);
    }
);

function handleGlobalError(errorCode, message) {
    showAlert(`Error Code: ${errorCode}`, message);
}

export default apiClient;
