<template>
    <b-container fluid>
        <b-row class="my-3">
            <b-col xl="3" lg="3" md="3" sm="4">
                <span class="mr-3">Travaillez-vous seul(e) ou en équipe ?</span>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Travaille seul(e) ou en équipe" :rules="{ required: undefined === currentPartner.isAlone }" ref="currentPartner.isAlone"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                        type="radio"
                        name="currentPartner.isAlone"
                        v-model="currentPartner.isAlone"
                        :value="true"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Seul(e)
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Travaille seul(e) ou en équipe" :rules="{ required: undefined === currentPartner.isAlone  }" ref="currentPartner.isAlone"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                        type="radio"
                        name="currentPartner.isAlone"
                        v-model="currentPartner.isAlone"
                        :value="false"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        En équipe
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row>
            <b-col v-if="currentPartner.workAloneOrTeam">
                <span class="wording-comment">Valeur saisie par le commercial en RDV : <i>{{currentPartner.workAloneOrTeam}}</i></span>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col xl="3" lg="3" md="3" sm="4">
                <span class="mr-3">Avec quel pronom devons-nous rédiger votre site ? <i class="far fa-question-circle custom-tooltip" v-b-tooltip.hover title="Exemple : J’interviens sous 24h après la demande / Nous intervenons sous 24h après la demande"></i></span>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Rédaction du site" :rules="{ required: undefined === currentPartner.pronoun  }" ref="currentPartner.pronoun"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { partner: currentPartner })"
                        type="radio"
                        name="currentPartner.pronoun"
                        v-model="currentPartner.pronoun"
                        :value="'Je'"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Je
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Rédaction du site" :rules="{ required: undefined === currentPartner.pronoun}" ref="currentPartner.pronoun"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { partner: currentPartner })"
                        type="radio"
                        name="currentPartner.pronoun"
                        v-model="currentPartner.pronoun"
                        :value="'Nous'"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                        Nous
                    </b-form-radio>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col lg="6" md="6" sm="12">
                <ValidationProvider name="Typologie client" rules="min:3" ref="currentPartner.customers"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Quelle est votre typologie client ? <i class="far fa-question-circle custom-tooltip" v-b-tooltip.hover.bottom title="Exemples : particulier / professionnels ; jeune de 25-35 ans ; personnes âgées ; famille ; etc. "></i></label>
                    <b-form-textarea
                        v-if="identity.allowedToEdit"
                        v-autoresize
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.customers"
                        v-model="currentPartner.customers"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                    </b-form-textarea>
                    <div class="mx-2 pre-line-text" v-else-if="!identity.allowedToEdit &&
                     currentPartner.customers &&
                     currentPartner.customers.length">
                        {{ currentPartner.customers }}
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="6" md="6" sm="12">
                <ValidationProvider name="Distinction des concurrents" rules="min:3|max:255" ref="currentPartner.competitor"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Qu'est-ce qui vous distingue des concurrents ? <i class="far fa-question-circle custom-tooltip" v-b-tooltip.hover.bottom title="Exemples : rapport qualité / prix ; dépannage dans l’heure; etc."></i></label>
                    <div class="input-text" v-if="identity.allowedToEdit">
                        <b-form-textarea
                            v-autoresize
                            @focus="onFocus"
                            @blur="onBlur($event, { partner: currentPartner })"
                            type="text"
                            :class="classes"
                            name="currentPartner.competitor"
                            v-model="currentPartner.competitor"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-textarea>
                        <TextLengthMessage
                            :value="!currentPartner || currentPartner.competitor"
                            maxlength="255"
                        />
                    </div>
                    <div class="mx-2 pre-line-text" v-else-if="!identity.allowedToEdit &&
                     currentPartner.competitor &&
                     currentPartner.competitor.length">
                        {{ currentPartner.competitor }}
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col lg="6" md="6" sm="12">
                <ValidationProvider name="Informations entreprise" rules="required|min:3" ref="currentPartner.companyDetails"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Parlez-nous de vous / de votre entreprise <i class="far fa-question-circle custom-tooltip" v-b-tooltip.hover.bottom title="Il faut récolter ici un maximum d’information afin de pouvoir orienter le rédacteur dans la bonne direction lorsqu’il va rédiger le contenu du site.
                    Cela peut-être par exemple :
                    Des informations à mettre en avant (devis gratuit, intervention sous 24h, etc.)
                    Des informations sur le travail du partenaire (qualité, sur-mesure, processus de fabrication, etc.)"></i></label>
                    <b-form-textarea
                        v-if="identity.allowedToEdit"
                        v-autoresize
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.companyDetails"
                        v-model="currentPartner.companyDetails"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    >
                    </b-form-textarea>
                    <div class="mx-2 pre-line-text" v-else-if="!identity.allowedToEdit &&
                     currentPartner.companyDetails &&
                     currentPartner.companyDetails.length">
                        {{ currentPartner.companyDetails }}
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col lg="6" md="6" sm="12">
                <ValidationProvider name="Partenaires / Marques" rules="min:3" ref="currentPartner.partners"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">Avec quelles marques travaillez-vous ?</label>
                    <b-form-textarea
                        v-if="identity.allowedToEdit"
                        v-autoresize
                        @focus="onFocus"
                        @blur="onBlur($event, { partner: currentPartner })"
                        type="text"
                        :class="classes"
                        name="currentPartner.partners"
                        v-model="currentPartner.partners"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                    ></b-form-textarea>
                    <div class="mx-2 pre-line-text" v-else-if="!identity.allowedToEdit &&
                      currentPartner.partners &&
                      currentPartner.partners.length">
                        {{ currentPartner.partners }}
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="my-3 keyword-group">
            <b-col cols="11">
                <ValidationProvider name="Mot clés liés à l'activité" rules="expected"
                                    ref="currentPartner.activityKeywords"
                                    v-slot="{ validate, classes, errors }">

                    <label class="label">Avez-vous des mots-clés liés à votre activité que vous souhaiteriez voir sur
                        votre site ?</label>
                    <b-form-tags
                        separator=",;"
                        id="activity-keywords"
                        @input="onTagsChange($event, { partner: currentPartner }, 'activityKeywords')"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :tag-variant="getColor"
                        size="md"
                        placeholder="Ajouter un mot clé. Valider chaque expression avec la touche Entrer."
                        :class="classes"
                        remove-on-delete
                        name="currentPartner.activityKeywords"
                        v-model="currentPartner.activityKeywords"
                    ></b-form-tags>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col cols="1" align-self="center" class="text-center">
                <b-button @click="uiActions.copy2clipboard(currentPartner.activityKeywords)" size="md" class="button-copy" v-if="currentPartner.activityKeywords && currentPartner.activityKeywords.length >= 1"
                          v-b-tooltip.hover title="Copier dans le presse-papier">
                    <i class="fas fa-copy"></i>
                </b-button>
            </b-col>
        </b-row>
        <b-row class="my-3 keyword-group">
            <b-col cols="11">
                <ValidationProvider name="Interdiction de mot clés liés"
                                    ref="currentPartner.forbiddenActivityKeywords"
                                    v-slot="{ validate, classes, errors }">
                    <label class="label">A contrario, avez-vous des mots-clés que vous n'avez pas le droit d'utiliser dans votre activité ? <i class="far fa-question-circle custom-tooltip" v-b-tooltip.hover.right
                        title="Exemple : l’utilisation de la marque 'placo' ; le mot 'paysagiste' ou 'prothésiste ongulaire', etc."></i>
                    </label>
                    <b-form-tags
                        separator=",;"
                        id="forbidden-activity-keywords"
                        @input="onTagsChange($event, { partner: currentPartner }, 'forbiddenActivityKeywords')"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :tag-variant="getColor"
                        size="md"
                        placeholder="Ajouter un mot clé. Valider chaque expression avec la touche Entrer."
                        :class="classes"
                        remove-on-delete
                        name="currentPartner.forbiddenActivityKeywords"
                        v-model="currentPartner.forbiddenActivityKeywords"
                    ></b-form-tags>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
            <b-col cols="1" align-self="center" class="text-center">
                <b-button @click="uiActions.copy2clipboard(currentPartner.forbiddenActivityKeywords)" size="md" class="button-copy" v-if="currentPartner.forbiddenActivityKeywords && currentPartner.forbiddenActivityKeywords.length >= 1"
                          v-b-tooltip.hover title="Copier dans le presse-papier">
                    <i class="fas fa-copy"></i>
                </b-button>
            </b-col>
        </b-row>
        <b-row class="my-3">
            <b-col xl="3" lg="3" md="3" sm="4">
                <span class="mr-3">Si vous possédez un site existant, pouvons-nous récupérer des informations / textes sur votre ancien site ?</span>
            </b-col>
            <b-col lg="1" md="2" sm="3">
                <ValidationProvider name="Récupération des informations" :rules="{ required: false }" ref="currentPartner.getDataFromSite"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                        type="radio"
                        name="currentPartner.getDataFromSite"
                        v-model="currentPartner.getDataFromSite"
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
                <ValidationProvider name="Récupération des informations" :rules="{ required: false }" ref="currentPartner.getDataFromSite"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-radio
                        @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                        type="radio"
                        name="currentPartner.getDataFromSite"
                        v-model="currentPartner.getDataFromSite"
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
        <b-row class="my-3">
            <label class="label mt-2">Avant quelle date, allez-vous nous envoyer des éléments ?</label>
            <b-col lg="2" md="2" sm="12">
                <ValidationProvider name="Date d'envoi des éléments" ref="currentPartner.sentElementsDate"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-datepicker
                        @focus="onFocus"
                        @input="onSendElementsDateChange($event, { partner: currentPartner })"
                        type="date"
                        :class="classes"
                        name="currentPartner.sentElementsDate"
                        v-model="sentElementsDate"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        :max="maxDate"
                        start-weekday="1"
                    ></b-form-datepicker>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
require('../../assets/style/Pfolder/partnership-folder.css');

import autoresize from '../../directives/AutoResize';
import TextLengthMessage from './TextLengthMessage';
import dpMixin from "../../mixins/dp-mixin";
import { mapActions, mapState } from "vuex";
import { uiActions, dateHelpers } from "@/_helpers";
import momentBusinessDays from "moment-business-days";

export default {
    name: 'Wording',
    mixins: [dpMixin],
    directives: {
        autoresize
    },
    components: {
        TextLengthMessage
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['salesforce']),
        sentElementsDate: {
            get() {
                return this.currentPartner.sentElementsDate
                    ? dateHelpers.dateToStringForInput(this.currentPartner.sentElementsDate)
                    : null;
            },
            set(value) {
                return this.currentPartner.sentElementsDate = value;
            }
        },
        getColor() {
            return this.identity.allowedToEdit ? 'local-orange' : 'local-black';
        },
        maxDate() {
            return (!this.salesforce.opportunity || !this.salesforce.opportunity.CloseDate)
                ? null
                : momentBusinessDays(this.salesforce.opportunity.CloseDate, 'YYYY-MM-DD')
                .businessAdd(10)
                .toDate();
        }
    },
    data() {
        return {
            uiActions,
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
            this.verifyFields();
        },
        onSendElementsDateChange(date, data) {
            if (!date) {
                return;
            }

            data.payload = {
                sentElementsDate: date
            };

            this.updatePartnerPropertyFromForm({ data });
        },
        onTagsChange(value, data, offset) {
            data.value = value;
            data.offset = offset;
            this.updatePartnerPropertyFromForm({
                data: data
            });
            this.verifyFields();
        }
    }
}
</script>
