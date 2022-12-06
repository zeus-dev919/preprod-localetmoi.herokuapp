<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-modal id="modal-center" centered title="Votre session va bientôt expirer" no-close-on-backdrop visible hide-header-close
                         ok-title="Rester connecté" cancel-title="Se déconnecter" ok-variant="success" cancel-variant="danger"
                         @ok="refreshToken()" @cancel="cancelRefresh()">
                    <p>Votre session va expirer dans :
                        <slot></slot>
                        secondes.
                    </p>
                    <p>Que souhaitez-vous faire ?</p>
                </b-modal>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

import {mapActions, mapState} from 'vuex';
import { userService } from '../_services';

require('../assets/style/modal.css');

export default {
    name: 'LogoutModal',
    computed: {
        ...mapState({
            identity: state => state.account.identity,
            currentPartner: state => state.account.currentPartner,
        }),
    },
    methods: {
        ...mapActions('account', ['logout', 'setIsShowLogoutModal']),
        refreshToken() {
            userService.refreshToken();
            location.reload();
        },
        cancelRefresh() {
            this.setIsShowLogoutModal(false);
            this.logout({customerCode: this.currentPartner.customerCode, identity: this.identity});
        }
    }
};
</script>
