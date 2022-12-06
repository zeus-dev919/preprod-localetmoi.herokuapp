<template>
    <b-container fluid id="notification-agenda">
        <b-row class="mt-3 my-3">
            <b-col lg="6" md="8" sm="4">
                <span class="mr-3">Par défaut, votre client recevra un rappel du RDV par SMS la veille du RDV. Est-ce que cela vous convient ?</span>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Appel veille rdv" :rules="{ required: false }" ref="currentPartner.agenda.notifyBySms"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { agenda: currentPartner.agenda, type: 'bool' })"
                        type="radio"
                        name="currentPartner.agenda.notifyBySms"
                        v-model="currentPartner.agenda.notifyBySms"
                        :value="true"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Oui
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Appel veille rdv" :rules="{ required: false }" ref="currentPartner.agenda.notifyBySms"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { agenda: currentPartner.agenda, type: 'bool' })"
                        type="radio"
                        name="currentPartner.agenda.notifyBySms"
                        v-model="currentPartner.agenda.notifyBySms"
                        :value="false"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Non
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3">
            <b-col>
                <p class="__important__informations">
                    A titre d’information, toutes les notifications suivantes seront par défaut envoyées par SMS :
                </p>
                <p class="__informations">
                    Notifications reçues par défaut par le manager et l’équipier concerné : prise d’un nouveau RDV, annulation de RDV par le client, le client a demandé à changer son RDV. <br>
Notifications reçues par défaut par le client : confirmation de rdv, rappel de RDV, modification ou annulation de son RDV, rendez-vous non honoré
                </p>
            </b-col>
        </b-row>
        <b-row class="mt-3 my-3">
            <b-col lg="4" md="8" sm="4">
                <span class="mr-3">Souhaitez-vous demander par mail au client son avis après le RDV ?</span>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Appel veille rdv" :rules="{ required: false }" ref="currentPartner.agenda.adviseConfirmation"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { agenda: currentPartner.agenda, type: 'bool' })"
                        type="radio"
                        name="currentPartner.agenda.adviseConfirmation"
                        v-model="currentPartner.agenda.adviseConfirmation"
                        :value="true"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Oui
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Appel veille rdv" :rules="{ required: false }" ref="currentPartner.agenda.adviseConfirmation"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { agenda: currentPartner.agenda, type: 'bool' })"
                        type="radio"
                        name="currentPartner.agenda.adviseConfirmation"
                        v-model="currentPartner.agenda.adviseConfirmation"
                        :value="false"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Non
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3">
            <b-col>
                <p>Par défaut, chaque matin, le manager et l’équipier recevront par mail la liste des RDV de la journée.</p>
                <p>Renseignement sur le manager (s’il y en a un) :</p>
            </b-col>
        </b-row>
        <b-row class="team__input-separator __description__services">
            <b-col sm="12" md="1" class="mt-3">
                <label class="__important__label">Mail :</label>
            </b-col>
            <b-col sm="12" md="3" class="__description__services-input">
                <ValidationProvider name="Email manager" rules="min:3" ref="currentPartner.agenda.email"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        type="text"
                        @focus="onFocus"
                        @blur="onBlur($event, { agenda: currentPartner.agenda })"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        name="currentPartner.agenda.email"
                        v-model="currentPartner.agenda.email"
                        placeholder="Privilégier mail perso"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="team__input-separator __description__services">
            <b-col sm="12" md="1" class="mt-3">
                <label class="__important__label">Tél :</label>
            </b-col>
            <b-col sm="12" md="3" class="__description__services-input">
                <ValidationProvider name="Tél manager" rules="integer" ref="currentPartner.agenda.phone"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        type="text"
                        @focus="onFocus"
                        @blur="onBlur($event, { agenda: currentPartner.agenda })"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        name="currentPartner.agenda.phone"
                        v-model="currentPartner.agenda.phone"
                        placeholder="Veuillez saisir 10 chiffres"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3">
            <b-col sm="12" md="4" class="p-0">
                <label class="form-description">Calendriers Sync - Facebook</label>
            </b-col>
        </b-row>
        <b-row class="mt-3 my-3">
            <b-col lg="6" md="8" sm="4">
                <span class="mr-3">Avez-vous un agenda que vous souhaitez synchroniser avec cet outil ? (Outlook, Google Calendar, Windows Live ) :</span>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Agenda que vous souhaitez synchroniser" :rules="{ required: false }" ref="currentPartner.agenda.hasAgendaToSynchronize"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { agenda: currentPartner.agenda, type: 'bool' })"
                        type="radio"
                        name="currentPartner.agenda.hasAgendaToSynchronize"
                        v-model="currentPartner.agenda.hasAgendaToSynchronize"
                        :value="true"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Oui
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Agenda que vous souhaitez synchroniser" :rules="{ required: false }" ref="currentPartner.agenda.hasAgendaToSynchronize"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { agenda: currentPartner.agenda, type: 'bool' })"
                        type="radio"
                        name="currentPartner.agenda.hasAgendaToSynchronize"
                        v-model="currentPartner.agenda.hasAgendaToSynchronize"
                        :value="false"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Non
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mt-3 team__input-separator __description__services">
            <b-col sm="12" md="2" class="p-0">
                <label>Quel calendrier synchroniser :</label>
            </b-col>
            <b-col lg="1" md="2" class="__description__services-input">
                <ValidationProvider name="Calendrier à synchroniser" :rules="{ required: false }"
                                    ref="currentPartner.agenda.calendarToSynchronize"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-group>
                        <b-form-radio-group
                            @change.native="onBlur($event, { agenda: currentPartner.agenda })"
                            v-model="checkedCalendar"
                            :options="agendaSyncCalendarList"
                            name="currentPartner.agenda.calendarToSynchronize"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            stacked
                        ></b-form-radio-group>
                    </b-form-group>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col v-if="isOtherCalendarTypeChecked()" sm="12" md="12" lg="4" class="input-element">
                <ValidationProvider name="Autre calendrier" rules="min:3"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-input
                        @focus="onFocus"
                        placeholder="Saisissez un autre calendrier"
                        @blur.native="onBlur($event, { agenda: currentPartner.agenda })"
                        name="currentPartner.agenda.calendarToSynchronize"
                        type="text"
                        :class="classes"
                        v-model="otherCalendarToSynchronize"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-input>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { agendaSyncCalendarList } from "../../../Interface/partnershipFolderDatas";

export default {
    name: "AgendaNotification",
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        calendarToSync() {
            return this.currentPartner.agenda.calendarToSynchronize;
        }
    },
    data() {
        return {
            agendaSyncCalendarList,
            checkedCalendar: null,
            otherCalendarToSynchronize: null
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = this.$refs[event.target.name];
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
        },
        isOtherCalendarTypeChecked() {
            return 'Autre' === this.checkedCalendar;
        },
        isCalendarToSynchronizeExists(calendarName) {
            return this.agendaSyncCalendarList
                .some(agendaToSync => agendaToSync.text === calendarName);
        },
    },
    mounted() {
        if (this.isCalendarToSynchronizeExists(this.calendarToSync)) {
            this.checkedCalendar = this.calendarToSync;
        } else if (this.calendarToSync) {
            this.checkedCalendar = 'Autre';
            this.otherCalendarToSynchronize = this.calendarToSync;
        }
    }
}
</script>
