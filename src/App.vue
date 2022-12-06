<template>
    <div id="app">
        <div :class="{'blur-content': null === performance && null === targeting}">
            <LogoutModal v-if="isShowLogoutModal">{{refreshTtl}}</LogoutModal>
            <AccessPfModal v-if="isShowAccessPfModal && isCurrentMainUserOnPf"/>
            <router-view></router-view>
        </div>
        <Cookie/>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import LogoutModal from './components/LogoutModal';
import Cookie from "./components/Cookies/Cookie";
import cookieMixin from "./mixins/cookie-mixin";
import AccessPfModal from "./components/AccessPfModal";

require('./assets/style/footer-header.css');
require('./assets/style/menus.css');

export default {
    name: 'App',
    mixins: [cookieMixin],
    components: {
        Cookie,
        LogoutModal,
        AccessPfModal
    },
    data () {
        return {
            refreshTtl: null
        };
    },
    computed: {
        ...mapState({
            showAlert: state => state.alert.show,
            isLoggedIn: state => state.account.status.loggedIn,
            refreshTokenExpiresAt: state => state.account.status.logoutModal.refreshTokenExpiresAt,
            isShowLogoutModal: state => state.account.status.logoutModal.isShowLogoutModal,
            isRefreshToken: state => state.account.status.logoutModal.refreshTokenTtlState,
            isShowAccessPfModal: state => state.account && state.account.accessPfModal && state.account.accessPfModal.isShowAccessPfModal,
            isCurrentMainUserOnPf: state => state.account.isCurrentMainUserOnPf,
            identity: state => state.account.identity,
            currentPartner: state => state.account.currentPartner,

        })
    },
    methods: {
        ...mapActions({
            clearAlert: 'alert/clear'
        }),
        ...mapActions('account', ['setIsShowLogoutModal', 'refreshTokenUpdated', 'logout', 'disconnectUserFromSocket']),
        ...mapMutations('alert', [
            'disableNotify'
        ]),
        logoutAndClearInterval() {
            if (this.currentPartner && this.identity) {
                this.logout({customerCode: this.currentPartner.customerCode, identity: this.identity});
            }
            this.setIsShowLogoutModal(false);
            if (window.timeout) {
                clearInterval(window.timeout);
            }
        },
        startInterval() {
            if (window.timeout) {
                clearInterval(window.timeout);
            }

            window.timeout = setInterval(() => {
                if (this.isRefreshToken) {
                    this.refreshTokenUpdated(false);
                    return;
                }

                this.refreshTtl = parseInt(((this.refreshTokenExpiresAt || new Date()) - new Date()) / 1000);
                if (this.refreshTtl > 0 && this.refreshTtl <= 55) {
                    this.setIsShowLogoutModal(true);
                    return;
                }

                if (!this.isLoggedIn || this.refreshTtl <= 0) {
                    this.logoutAndClearInterval();
                }
            }, 1000);
        }
    },
    mounted() {
        new Promise((resolve) => {
            let timeout = setInterval(() => {
                if (!this.isLoggedIn) {
                    return;
                }
                clearInterval(timeout);
                resolve();
            }, 100);
        }).then(() => {
            this.startInterval();
        })
    },
    watch: {
        $route(to, from) {
            // clear alert on location change
            this.clearAlert();
        },
        showAlert() {
            if (this.showAlert) {
                this.$notify({
                    group: this.$store.state.alert.group,
                    text: this.$store.state.alert.message,
                    title: this.$store.state.alert.title,
                    type: this.$store.state.alert.type,
                    duration: this.$store.state.alert.duration
                });
                this.disableNotify();
            }
        },
    }
};
</script>

<style>
#app {
    font-family: Arial, 'Avenir', Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.btn-primary {
    background-color: #eC008c;
    border-color: #eC008c;
}

.btn-primary:hover {
    background-color: #bcbdc0;
    border-color: #bcbdc0;
}

.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
}

@media screen and (max-width: 578px) {
    .image-log {
        width: 100%
    }
}
</style>
