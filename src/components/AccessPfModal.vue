<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-modal v-if="hierarchicalFunction === 'CPW'" id="modal-center" centered :title="`${accessPfModal.userName} demande accès au DP`" visible hide-header-close
                         no-close-on-backdrop
                         no-close-on-esc
                >
                    <div class="time-remaining">
                        <img src="../assets/clock-icon.svg">
                        <p>{{ time }} secondes restantes avant validation <br> automatique</p>
                    </div>
                    <template #modal-footer>
                        <!-- Emulate built in modal footer ok and cancel button actions -->
                        <b-button size="sm" variant="refuse" @click="CPWRefuse()">
                            Refuser
                        </b-button>
                        <!-- Button with custom close trigger value -->
                        <b-button size="sm" variant="secondary" @click="takeTimeToGiveAccess()">
                            Me laisser 30 secondes pour finir
                        </b-button>
                        <b-button size="sm" variant="danger" @click="onGiveAccess()">
                            Accepter
                        </b-button>
                    </template>
                </b-modal>
                <b-modal v-else id="modal-center" centered :title="`${accessPfModal.userName} demande accès au DP`" visible hide-header-close
                         ok-title="Accepter" cancel-title="Me laisser 30 secondes pour finir" ok-variant="danger" cancel-variant="secondary"
                         @ok="onGiveAccess()" @cancel="takeTimeToGiveAccess()"
                         no-close-on-backdrop
                         no-close-on-esc
                >
                    <div class="time-remaining">
                        <img src="../assets/clock-icon.svg">
                        <p>{{ time }} secondes restantes avant validation <br> automatique</p>
                    </div>
                </b-modal>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>

import {mapActions, mapMutations, mapState} from 'vuex';
import { socketService } from '../_services';
require('../assets/style/modal.css');

export default {
    name: 'AccessPfModal',
    data:() => ({
        time: 30
    }),
    computed: {
        ...mapState('account', {
            accessPfModal: state => state.accessPfModal,
            identity: state => state.identity,
            customerCode: state => state.currentPartner.customerCode,
            isCurrentMainUserOnPf: state => state.account.isCurrentMainUserOnPf,
            hierarchicalFunction: state => state.salesforceUser.Fonction_hi_rarchique__c
        }),
        ...mapState('globalStore', {
            isStartTimer: state => state.status.isStartTimer
        })
    },
    mounted () {
        if (this.accessPfModal.isShowAccessPfModal) {
            window.intervalToResponse = setInterval(() => {
                this.time--;
                if (0 === this.time) {
                    this.onGiveAccess();
                    window.intervalToResponse && clearInterval(window.intervalToResponse);
                }
            }, 1000);
        }
    },
    methods: {
        ...mapActions('account', ['setIsShowAccessPfModal']),
        ...mapActions('globalStore', ['setIsRequestForAccessIsActive', 'setStartTimer']),
        ...mapMutations('account', ['setAccessPfModalShow']),
        onGiveAccess () {
            socketService.giveAccess(this.customerCode, this.identity, this.accessPfModal.socket, this.accessPfModal.id);
            this.setIsRequestForAccessIsActive(false);
            this.setStartTimer(false);
            this.setAccessPfModalShow(false);
            window.intervalToResponse && clearInterval(window.intervalToResponse);
            window.intervalTimeout && clearInterval(window.intervalTimeout);
        },
        takeTimeToGiveAccess () {
            window.intervalToResponse && clearInterval(window.intervalToResponse);
            socketService.giveAccessAfterInterval(this.customerCode, this.accessPfModal.socket);
            this.setStartTimer(true);
            this.setAccessPfModalShow(false);
            setTimeout(() => {
                if (this.isStartTimer) {
                    this.onGiveAccess();
                }
            }, 30000);
        },
        CPWRefuse () {
            socketService.accessRefused(this.customerCode, this.accessPfModal.socket);
            window.intervalToResponse && clearInterval(window.intervalToResponse);
            window.intervalTimeout && clearInterval(window.intervalTimeout);
            this.setIsRequestForAccessIsActive(false);
            this.setStartTimer(false);
            this.setAccessPfModalShow(false);
        }
    },
    destroyed () {
        this.setAccessPfModalShow(false);
        window.intervalTimeout && clearInterval(window.intervalTimeout);
        window.intervalToResponse && clearTimeout(window.intervalToResponse);
    }
};
</script>
