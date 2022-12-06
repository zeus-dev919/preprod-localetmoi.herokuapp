<template>
    <div id="authentification">
        <div v-if="status.loggingIn || $store.state.globalStore.status.isPasswordResetting" class="overlay-loader">
            <fade-loader :color="color" class="loader-auth"></fade-loader>
        </div>
        <app-mainheader></app-mainheader>
        <b-container fluid class="bv-example-row">
            <b-row>
                <notifications group="auth-error" position="bottom right" class="notification-container" />
                <notifications group="mail-sent" position="bottom right" class="notification-container" />
                <b-col class="img-section" offset-lg="1" lg="6">
                    <img class="image-left-auth" src="../assets/visuel-authentification.png" />
                </b-col>
                <b-col @keyup.enter="authenticate" v-if="!$store.state.globalStore.status.passwordResetForm" lg="4" offset-lg="0" offset-sm="3" class="labels-input">
                    <b-row>
                        <b-col offset-lg="1" lg="8" md="6" sm="6">
                            <b-row>
                                <b-col lg="7" md="12" sm="12" class="id-section">Identifiant</b-col>
                                <b-col lg="4" md="12" sm="12" class="id-section">
                                    <input v-model="username" class="log-input" type="text" placeholder="" name="username" required>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col offset-lg="1" lg="8" md="6" sm="6">
                            <b-row>
                                <b-col lg="7" md="12" sm="12" class="id-section">Mot de passe</b-col>
                                <b-col lg="4" md="12" sm="12" class="id-section">
                                    <input v-model="password" type="password" placeholder="" name="current-password" required>
                                </b-col>
                                <p class="frgt-pwd" @click="togglePasswordResetForm(true)">Mot de passe oublié ?</p>
                            </b-row>
                        </b-col>
                        <b-col offset-lg="1" lg="8" md="6" sm="6">
                            <b-row>
                                <b-col lg="7" md="12" sm="12" class="id-section"></b-col>
                                <b-col lg="4" md="12" sm="12" class="id-section">
                                    <button @click="authenticate" class="uppercase auth" type="submit" v-bind:disabled="status.loggingIn">Se connecter</button>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col @keyup.enter="reset_password" v-if="$store.state.globalStore.status.passwordResetForm" lg="5" offset-lg="0" offset-sm="3" class="labels-input">
                    <b-row>
                        <b-col offset-lg="2" lg="12" md="6" sm="6">
                            <b-row>
                                <b-col lg="8" md="12" sm="12" class="id-section">Saisissez votre adresse mail pour réinitialiser votre mot de passe :</b-col>
                                <b-col lg="6" md="12" sm="12" class="id-section">
                                    <input type="text" placeholder="Adresse mail" v-model="emailReset" class="forgot-pswd-input" required>
                                </b-col>
                                <b-col lg="8" md="6" sm="6">
                                    <p class="frgt-pwd" @click="togglePasswordResetForm(false)">Revenir à l'authentification</p>
                                    <button @click="reset_password()" class="uppercase submit-button" type="submit" v-bind:disabled="$store.state.globalStore.status.isPasswordResetting">Réinitialiser</button>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
        <app-footer class="footer-auth"></app-footer>
    </div>
</template>

<script>

import { mapState, mapActions, mapMutations } from 'vuex';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import cookieMixin from "../mixins/cookie-mixin";

require('../assets/style/authentification.css');

export default {
    app: 'app',
    mixins: [cookieMixin],
    components: {
        FadeLoader
    },
    data () {
        return {
            username: '',
            password: '',
            emailReset: '',
            color: '#ec008c'
        };
    },
    computed: {
        ...mapState('account', ['status'])
    },
    created () {
        // reset login status
        localStorage.clear();
        sessionStorage.clear();
        this.resetState();
        this.togglePasswordResetForm(false);
    },
    mounted: function () {
        this.resetPartnerOffers();
        if (null === this.$route.query['mot-de-passe-oublie']) {
            this.togglePasswordResetForm(false);
        }
    },
    methods: {
        ...mapActions('account', ['login', 'logout']),
        ...mapActions('globalStore', [
            'resetPartnerOffers',
            'sendResetPasswordMail',
            'resetState',
        ]),
        ...mapMutations('globalStore', [
            'togglePasswordResetForm'
        ]),
        authenticate: function () {
            const username = this.username.trim();
            const password = this.password.trim();

            this.login({username, password, next: this.$route.query.next});
        },
        reset_password: function () {
            const data = {
                email: this.emailReset.trim()
            };

            this.sendResetPasswordMail({ data });
        }
    }
};
</script>
