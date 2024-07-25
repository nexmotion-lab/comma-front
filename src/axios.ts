import axios from "axios";
import { alertController } from "@ionic/vue";

const apiClient = axios.create({
    baseURL: 'https://www.comma-coders.com:8998',
    timeout: 10000,
    withCredentials: true
})

async function showAlert(header, message) {
    const alert = await alertController.create({
        header: header,
        message: message,
        buttons: ['확인'],
        cssClass: 'error-alert'
    })
    await alert.present();
}

apiClient.interceptors.response.use(
    response => response,
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