<template>
    <div id="authentification">
        <b-row class="title-bar">
            <b-col lg="6" md="6" sm="6">
                <img class="image-log" src="../assets/logo-local-et-moi.jpg" />
            </b-col>
            <b-col class="title-right title-bar-words" lg="6" md="6" sm="6">
                Mon espace Partenaire
            </b-col>
        </b-row>
        <b-container fluid class="bv-example-row">
            <b-row>
                <notifications group="connexion-failed" position="bottom right" class="notification-container" />
                <notifications group="mail-sent" position="bottom right" class="notification-container" />
                <b-col offset="2" lg="8" md="12" sm="12" @keyup.enter="checkPassword()">
                    <div v-if="timestampOver" class="ticket-form">
                        Votre lien de réinitialisation de mot de passe a expiré.
                    </div>
                    <div v-if="!timestampOver" class="ticket-form">
                        <h2 class="center">Définir un mot de passe</h2><br />
                        <p :class="`info-pwd ${pwdErrorClass}`">
                            Votre mot de passe doit contenir au moins 
                            <span :class="validPwdLengthClass">8 caractères</span> dont 
                            <span :class="validPwdMinClass">1 minuscule</span>, 
                            <span :class="validPwdMajClass">1 majuscule</span>, 
                            <span :class="validPwdNumericClass">des chiffres</span>, 
                            <span :class="validPwdAlphaClass">des lettres</span> et 
                            <span :class="validPwdSpecialClass">1 caractère spécial de cette liste %, #, :, $, *</span>
                        </p>
                        <p>Saisissez votre mot de passe :</p>
                        <div class="pwd-input">
                            <b-form-input v-model="password" type="password" @keyup="onPasswordChange"></b-form-input>
                            <i :class="`fas fa-check ${this.validPwdCompleteClass}`"></i>
                        </div>
                        <p>Ressaisissez votre mot de passe :</p>
                        <div class="pwd-input">
                            <b-form-input v-model="passwordBis" type="password" @keyup="onPasswordBisChange"></b-form-input><br />
                            <i :class="`fas fa-check ${this.validPwdBisClass}`"></i>
                        </div>
                        <b-col class="center">
                            <button @click="checkPassword()" variant="success" class="submit-button">Valider</button>
                        </b-col>
                        <b-col lg="12" md="12" sm="12" hidden>
                            <label>
                                <input type="file" id="files" ref="files" multiple @change="handle_files_upload()" />
                            </label>
                        </b-col>
                    </div>
                </b-col>
            </b-row>
        </b-container>
        <app-footer class="footer-auth"></app-footer>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { encryptorHelpers } from '@/_helpers';

require('../assets/style/authentification.css');

export default {
    app: 'CreateAccount',
    mounted: function () {
        this.checkToken();
    },
    data () {
        return {
            passwordBis: '',
            password: '',
            pwdErrorClass: '',
            token: null,
            userId: null,
            timestampOver: false,
            validPwdLengthClass: '',
            validPwdMinClass: '',
            validPwdMajClass: '',
            validPwdNumericClass: '',
            validPwdAlphaClass: '',
            validPwdSpecialClass: '',
            validPwdCompleteClass: '',
            validPwdBisClass: '',
        };
    },
    methods: {
        ...mapActions('account', ['changePassword']),
        checkToken: function () {
            if (!this.$route.query.token) {
                window.location.href = '/#/authentification';
            } else {
                try {
                    const token = encryptorHelpers.verifyToken(this.$route.query.token);
                    this.token = this.$route.query.token;
                    this.userId = token.sub;
                } catch (e) {
                    console.error(e);
                    if (e instanceof TokenExpiredException) {
                        this.timestampOver = true;
                    }
                }
            }
        },
        checkPassword: function () {
            if (/[A-Z]/.test(this.password) && /[a-z]/.test(this.password) && /[0-9]/.test(this.password) && this.password.length >= 8 && /[%#:$*]/.test(this.password) && this.password === this.passwordBis) {
                this.pwdErrorClass = '';
                const data = {
                    password: this.password.trim()
                };

                this.changePassword({ userId: this.userId, data, token: this.token });
            } else {
                this.pwdErrorClass = 'error-message';
            }
        },
        onPasswordChange: function() {
            this.validPwdMinClass = /[a-z]/.test(this.password) ? 'subpwd-valid' : '';
            this.validPwdMajClass = /[A-Z]/.test(this.password) ? 'subpwd-valid' : '';
            this.validPwdAlphaClass = /[a-zA-Z]/.test(this.password) ? 'subpwd-valid' : '';
            this.validPwdNumericClass = /[0-9]/.test(this.password) ? 'subpwd-valid' : '';
            this.validPwdLengthClass = this.password.length >= 8 ? 'subpwd-valid' : '';
            this.validPwdSpecialClass = /[%#:$*]/.test(this.password) ? 'subpwd-valid' : '';
            this.validPwdCompleteClass = this.validPwdAlphaClass && this.validPwdNumericClass && this.validPwdLengthClass && this.validPwdSpecialClass ? 'pwd-valid' : '';
        },
        onPasswordBisChange: function() {
            this.validPwdBisClass = this.password.length >= 8 && this.password && this.passwordBis && this.password === this.passwordBis ? 'pwd-valid' : '';
        }
    }
};
</script>
