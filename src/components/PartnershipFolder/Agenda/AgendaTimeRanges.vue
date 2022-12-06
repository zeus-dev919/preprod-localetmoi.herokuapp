<template>
    <b-container fluid>
        <b-row class="mt-3">
            <b-col sm="12" md="2" class="p-0">
                <label class="label row-display-times">Horaires de prise de RDV :</label>
            </b-col>
        </b-row>
        <TimeRanges
            parentEntityName="agenda"
            v-bind:parentEntity="currentPartner.agenda"
            v-bind:timeRanges="currentPartner.agenda.appointmentTimeRanges"
            v-bind:allowedToEdit="identity.allowedToEdit"
            customClassName="justify-content-center"
        />
    </b-container>
</template>

<script>
import { mapState } from "vuex";
import TimeRanges from "../TimeRanges";

export default {
    name: "AgendaTimeRanges",
    components: {
        TimeRanges
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
    },
}
</script>

