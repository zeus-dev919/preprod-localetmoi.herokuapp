<template>
    <p>{{ errorMsg }}</p>
</template>

<script>

import axios from 'axios';

export default {
    app: 'SalesforceAutoLogin',
    mounted: function () {
        this.token_check();
    },
    data () {
        return {
            errorMsg: 'Redirection en cours ...'
        };
    },
    methods: {
        token_check: function () {
            if (!this.$route.query.token) {
                window.location.href = '/#/authentification';
            } else {
                var webtoolToken = decodeURIComponent(this.$route.query.token);
                if (!webtoolToken) {
                    window.location.href = '/#/authentification';
                } else {
                    axios.get(process.env.LOCALFR_API_BASE_URL + process.env.LOCALFR_API_TOKEN_CHECK_AUTOLOGIN + '/' + webtoolToken, {
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response => {
                        let cookieKeys = $cookies.keys();
                        for (var cookie in cookieKeys) {
                            $cookies.remove(cookieKeys[cookie]);
                        }
                        sessionStorage.clear();
                        localStorage.clear();
                        localStorage.setItem('fromSF', 'true');
                        localStorage.setItem('source', response.data.source.toLowerCase());
                        sessionStorage.setItem('access_token', response.data.token);
                        localStorage.setItem('sageCode', response.data.customer_codes[0]);
                        localStorage.setItem('showTutorial', response.data.show_tutorial);
                        localStorage.setItem('login', response.data.email);
                        localStorage.setItem('customerEmail', response.data.customer_email);
                        window.location.href = '/#/accueil';
                    }).catch(error => {
                        this.errorMsg = 'Le lien utilisé n\'est pas valide';
                        console.warn(error);
                    });
                }
            }
        }
    }
};
</script>
