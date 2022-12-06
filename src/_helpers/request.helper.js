import axios from 'axios';
import router from '@/router';
import { authHeader } from './auth-header.helper';
import { store } from '@/_store';
import { userService } from "../_services";

const axiosInstance = createAxiosInstance({ secured: false });
const securedAxiosInstance = createAxiosInstance({ secured: true });

export const requestHelpers = {
    axiosInstance,
    createAxiosInstance,
    handleResponse,
    securedAxiosInstance
};

function handleResponse (response) {
    return response.data;
}

function createAxiosInstance ({ secured }) {
    const instance = axios.create();

    if (secured) {
        instance.interceptors.request.use(
            config => {
                config.headers = Object.assign(
                    {},
                    config.headers,
                    authHeader()
                );
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            response => handleResponse(response),
            error => {
                if (401 === error.response.status) {
                    store.dispatch(
                        'alert/error',
                        {
                            group: 'auth-error',
                            message: 'Votre session a expiré.',
                            show: true,
                            title: 'Erreur de session',
                            type: 'error'
                        },
                        { root: true }
                    );
                    setTimeout(() => {
                        router.push('/authentification');
                    }, 4000);
                }
                return Promise.reject(error);
            }
        );
    } else {
        instance.interceptors.response.use(
            response => handleResponse(response),
            error => {
                return Promise.reject(error);
            }
        );
    }

    return instance;
}
