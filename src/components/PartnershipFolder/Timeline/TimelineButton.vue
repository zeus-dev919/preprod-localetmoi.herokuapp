<template>
    <b-col md="3" class="px-0 timeline-item-container">
        <b-row class="px-0">
            <b-col md="12" class="px-0">
                <div class="display-step-button">
                    <div class="display-step-button-elements" :class="!isTimeLineAvailable ? 'unavailable-timeline' : ''">
                        <div v-if="isValidated" class="transmit-valid"></div>
                        <img v-else-if="step === nextLogicalStep || !!currentTimelineStep" alt="Etape en cours" class="timeline-step to-transmit" src="../../../assets/circle-active-step-button.svg"/>
                        <img v-else alt="Etape non validée" src="../../../assets/circle-disabled-step-button.svg" class="timeline-step" v-b-tooltip.hover title="Étape non validée"/>
                        <div v-if="!isValidated && !isLast" class="timeline-line timeline-disabled"></div>
                        <div v-else-if="isValidated && !isLast" class="timeline-line timeline-valid"></div>
                        <div v-else-if="isCurrent && !isLast" class="timeline-line timeline-active"></div>
                    </div>
                    <div class="p-0 mt-5 step-text">
                        <span class="step-level-text">Etape {{ step }}</span>
                        <br />
                        <span class="step-profile-text">{{ name }}</span>
                    </div>
                </div>
            </b-col>
        </b-row>
        <b-row class="btn-validate-container" v-if="isAllowedToTransmitPf">
            <b-col>
                <img v-if="isValidated" @click="transmitPf()" class="transmit-btn" src="../../../assets/switch_on.svg" />
                <img v-else class="transmit-btn" @click="transmitPf()" src="../../../assets/switch_off.svg" />
                <span :class="isValidated ? 'is-valid-text' : ''">
                    {{ isValidated ? 'DP validé' : 'Je valide le DP' }}
                </span>
                <b-row v-if="isSalesmanStep && isSalesmanCurrentUserStep && countDownTime && !isValidated" class="justify-center count-down">
                    <p class="count-down-value m-0">{{ formattedTime }}</p>
                    <p class="count-down-text mb-0">Temps restant</p>
                </b-row>
            </b-col>
        </b-row>
    </b-col>
</template>
<script>

import { mapActions, mapMutations, mapState } from 'vuex';
import { authDpHelper, normalizer, readyState } from '../../../_helpers';
import { store } from '@/_store';
import momentBusinessDays from "moment-business-days";

require('../../../assets/style/Pfolder/TimeLine/timeline.css');
export default {
    name: 'TimelineButton',
    props: ['name', 'isLast', 'step'],
    data() {
        return {
            countDownTime: null
        }
    },
    computed: {
        ...mapState('account', ['status', 'timelineSteps', 'identity', 'currentPartner', 'salesforceUser']),
        ...mapState('globalStore', ['salesforce']),
        currentUserStep() {
            return authDpHelper.getCurrentUserStep();
        },
        isSalesmanStep() {
            return 1 === this.step;
        },
        isSalesmanCurrentUserStep() {
            return 1 === this.currentUserStep;
        },
        hasPartnerHistories() {
            return !!(
                this.currentPartner &&
                this.currentPartner.partnerHistories &&
                this.currentPartner.partnerHistories.length
            );
        },
        currentPartnerHistory() {
            return this.hasPartnerHistories ?
                this.currentPartner.partnerHistories.find(partnerHistory => partnerHistory.userId === this.salesforceUser.Id) : null;
        },
        currentTimelineStep() {
            return this.timelineSteps.find(timeline => this.step === timeline.step);
        },
        isValidated() {
            return this.currentTimelineStep && this.currentTimelineStep.isValidated;
        },
        isTimeLineAvailable() {
            return this.currentTimelineStep && this.currentTimelineStep.snapshot;
        },
        isCurrent() {
            return undefined !== this.currentUserStep && this.currentUserStep === this.step;
        },
        nextLogicalStep() {
            if (!this.timelineSteps || !this.timelineSteps.length) {
                return 1;
            }

            return Math.max(...this.timelineSteps.map((timeline) => {
                if (timeline.isValidated) {
                    return timeline.step;
                }
            })) + 1;
        },
        isAllowedToTransmitPf() {
            return this.salesforceUser &&
                this.currentPartner && this.currentPartner.id &&
                this.isCurrent &&
                this.identity.allowedToEdit &&
                !this.status.isStopEditing &&
                authDpHelper.canTransmitPf();
        },
        formattedTime() {
            if (!this.countDownTime.hours() && !this.countDownTime.minutes() && this.countDownTime.seconds()) {
                return `${this.countDownTime.seconds()}s`;
            }

            return `${this.countDownTime.hours()}h ${this.countDownTime.minutes()}m`;
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        transmitPf() {
            if (!this.identity.allowedToEdit) {
                return;
            }

            let data = {};
            let partnerHistory = this.currentPartnerHistory;
            if (partnerHistory) {
                data = {
                    partnerHistory,
                    payload: normalizer.normalizePartnerHistory({
                        snapshot: {
                            currentPartner: this.currentPartner,
                            salesforce: this.salesforce
                        },
                        updateDate: new Date(),
                        userId: this.salesforceUser.Id,
                        isValidated: true
                    })
                };
            } else {
                data = {
                    partnerHistory: normalizer.normalizePartnerHistory({
                        partner: this.currentPartner['@id'],
                        userId: this.salesforceUser.Id,
                        creationDate: new Date(),
                        snapshot: {
                            currentPartner: this.currentPartner,
                            salesforce: this.salesforce
                        },
                        isValidated: true
                    })
                };
            }

            this.updatePartnerPropertyFromForm({ data }).then(() => {
                if (this.isSalesmanStep && this.isSalesmanCurrentUserStep && window.myInterval) {
                    window.clearInterval(window.myInterval);
                }
            });
        }
    },
    mounted() {
        if (this.isSalesmanCurrentUserStep && this.isSalesmanStep) {
            readyState.getSalesforceState()
                .then(salesforceState => {
                  // Sort from newest to oldest
                  const opportunities = salesforceState.opportunities.sort((a, b) => a.CreatedDate > b.CreatedDate ? -1 : 1);
                  const newestOpportunity = opportunities[0];

                        if (newestOpportunity && newestOpportunity.CreatedDate && !this.isValidated) {
                            const start = momentBusinessDays(momentBusinessDays.utc(newestOpportunity.CreatedDate).locale('fr')),
                                end = start.businessAdd(1),
                                now = momentBusinessDays();

                            if (now.isBetween(start, end)) {
                                this.countDownTime = momentBusinessDays.duration(end.diff(now, 'milliseconds'));
                                window.myInterval = setInterval(() => {
                                        this.countDownTime = momentBusinessDays.duration(this.countDownTime - 1000, 'milliseconds');
                                        if (this.countDownTime > 0) {
                                            return;
                                        }

                                        clearInterval(window.myInterval);
                                        store.dispatch('account/setIsStopEditing', true, { root: true });
                                    },
                                    1000
                                );
                            } else if (now.isAfter(end)) {
                                store.dispatch('account/setIsStopEditing', true, { root: true });
                            }
                        }
                    }
                );
        }
    },
    destroyed() {
        window.myInterval && window.clearInterval(window.myInterval);
    }
}
</script>
