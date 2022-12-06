<template>
    <b-col lg="4" offset-lg="0" offset-md="1">
        <b-row class="timeline-main-container">
            <TimelineButton
                v-if="!isLoading"
                :key="index"
                v-for="(timelineDisplayStep, index) in timelineDisplaySteps"
                :name="timelineDisplayStep"
                :step="index + 1"
                :isLast="index === timelineDisplaySteps.length - 1"
            />
        </b-row>
    </b-col>
</template>
<script>

import TimelineButton from './TimelineButton';
import {mapState} from "vuex";
import {authDpHelper} from "../../../_helpers";

export default {
    name: 'Timeline',
    components: {
        TimelineButton
    },
    data() {
        return {
            timelineDisplaySteps: ['Commercial', 'Assistante', 'Planification'],
            isLoading: true
        };
    },
    computed: {
        ...mapState('account', ['currentPartner', 'salesforceUser', 'identity']),
        ...mapState('globalStore', ['status', 'salesforce']),
    },
    mounted() {
        if (4 > this.timelineDisplaySteps.length) {
            if (this.salesforceUser && this.salesforceUser.Fonction_hi_rarchique__c &&
                ('Chargé E-commerce' === this.salesforceUser.Fonction_hi_rarchique__c ||
                    'Coach E-commerce' === this.salesforceUser.Fonction_hi_rarchique__c)
            ) {
                this.timelineDisplaySteps.push('E-commerce');
            } else {
                this.timelineDisplaySteps.push('CPW');
            }
        }

        let timeout = setInterval(() => {
            if (!this.status.isPageLoading
                && this.currentPartner
                && undefined !== this.currentPartner.hasPartnerFolder
                && null !== this.currentPartner.hasPartnerFolder
                && this.salesforce
                && this.salesforce.opportunity
                && this.salesforce.opportunity.Id
            ) {
                clearInterval(timeout);
                this.isLoading = false;
            }
        }, 50);
    },
};
</script>
