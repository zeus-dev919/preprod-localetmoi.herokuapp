<template>
    <b-container fluid class="modal-report-container">
        <b-modal id="modal-report"
                 :adaptative="true"
                 size="lg"
                 centered
                 :title="status.reportHasBeenSent ? 'Erreur signalée' : 'Signaler une erreur'"
                 no-close-on-esc
                 no-close-on-backdrop
        >
            <fade-loader color="#ec008c" class="ticket-spinner" v-if="isSendingReport"></fade-loader>
            <b-row>
                <b-col class="mb-3">
                    <label class="label text-medium">
                        {{ status.reportHasBeenSent ? "Types d'erreurs signalés" : "Sélectionner le type d'erreur à signaler" }}
                    </label>
                    <ValidationProvider name="Type d'erreur" rules="required"
                                        ref="salesforce.opportunity.Signalement__c"
                                        v-slot="{ validate, classes, errors }">
                        <b-form-checkbox-group
                            v-model="Signalement__c"
                            @change.native="onChange"
                            :options="availableSignalementTypes"
                            name="salesforce.opportunity.Signalement__c"
                            stacked
                            :disabled="isSendingReport"
                            :readonly="isSendingReport"
                        ></b-form-checkbox-group>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <label class="label text-medium">Commentaires</label>
                    <ValidationProvider name="Commentaires" rules="required"
                                        ref="salesforce.opportunity.Signalement_Commentaire__c"
                                        v-slot="{ validate, classes, errors }">
                        <b-form-textarea
                            @focus="onFocus"
                            @keypress="onChange"
                            v-model="salesforce.opportunity.Signalement_Commentaire__c"
                            name="salesforce.opportunity.Signalement_Commentaire__c"
                            id="textarea"
                            rows="3"
                            :class="classes"
                            :disabled="isSendingReport"
                            :readonly="isSendingReport"
                        >
                        </b-form-textarea>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
            </b-row>
            <template #modal-footer>
                <b-row>
                    <b-col>
                        <b-button class="send-report mt-2"
                                  :class="{'disabled': !formValid || isSendingReport}"
                                  :disabled=" !formValid || isSendingReport"
                                  @click="sendReport($event)"
                        >
                            
                            {{ status.reportHasBeenSent ? "Mettre à jour" : "Envoyer le signalement" }}
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-modal>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { store } from '@/_store';
import { salesforceService } from "../../_services";

export default {
    name: "ReportModal",
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('globalStore', ['salesforce', 'status']),
        Signalement__c: {
            get() {
                return this.salesforce.opportunity.Signalement__c
                    ? this.salesforce.opportunity.Signalement__c.split(';')
                    : [];
            },
            set(val) {
                this.salesforce.opportunity.Signalement__c = (val || []).join(';');
            }
        }
    },
    data() {
        return {
            availableSignalementTypes: [],
            formValid: false,
            isSendingReport: false,
            previousEditedValue: null,
        }
    },
    async mounted() {
        this.availableSignalementTypes = (await salesforceService.getSignalementTypes()).map(value => {
            return { text: value, value: value }
        });
        this.formValid = null !== this.Signalement__c && null !== this.salesforce.opportunity.Signalement_Commentaire__c;
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onChange() {
            this.formValid = this.Signalement__c.length
                && this.salesforce.opportunity.Signalement_Commentaire__c
                && this.salesforce.opportunity.Signalement_Commentaire__c.length;
        },
        sendReport($event) {
            $event.preventDefault();
            if (!this.formValid) {
                store.dispatch('alert/error', {
                    group: 'auth-error',
                    message: 'Le formulaire n\'est pas valide',
                    show: true,
                    title: 'Erreur dans le formulaire',
                    type: 'error'
                }, { root: true });
                this.cancel();
            }
            
            const data = {
                payload: {
                    Signalement__c: this.salesforce.opportunity.Signalement__c,
                    Signalement_Commentaire__c: this.salesforce.opportunity.Signalement_Commentaire__c,
                },
                opportunity: this.salesforce.opportunity,
            };

            this.updatePartnerPropertyFromForm({ data }).then(() => {
                this.isSendingReport = false;
                this.$bvModal.hide('modal-report');
                store.dispatch('globalStore/setReportHasBeenSent', true);
            })
        },
        cancel() {
            this.isSendingReport = false;
            this.$bvModal.hide('modal-report');
        },
    }
}
</script>
