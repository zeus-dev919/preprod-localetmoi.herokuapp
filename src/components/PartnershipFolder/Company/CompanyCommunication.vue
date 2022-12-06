<template>
    <b-container fluid>
        <!-- your communication -->
        <b-row class="my-3">
                <b-col>
                    <ValidationProvider name="Flyer" :rules="{ required: false }" ref="currentPartner.flyerUse"
                                        v-slot="{ validate, classes, errors }">
                        <label>
                            <b-form-checkbox
                                type="checkbox"
                                @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                                name="currentPartner.flyerUse"
                                v-model="currentPartner.flyerUse"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            >
                                Flyer
                            </b-form-checkbox>
                        </label>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
                <b-col>
                    <ValidationProvider name="Réseaux sociaux" :rules="{ required: false }" ref="currentPartner.socialNetworkUse"
                                        v-slot="{ validate, classes, errors }">
                        <label>
                            <b-form-checkbox
                                type="checkbox"
                                @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                                name="currentPartner.socialNetworkUse"
                                v-model="currentPartner.socialNetworkUse"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            >
                                Réseaux sociaux
                            </b-form-checkbox>
                        </label>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
                <b-col>
                    <ValidationProvider name="Pages jaunes" :rules="{ required: false }" ref="currentPartner.yellowPageUse"
                                        v-slot="{ validate, classes, errors }">
                        <label>
                            <b-form-checkbox
                                type="checkbox"
                                @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                                name="currentPartner.yellowPageUse"
                                v-model="currentPartner.yellowPageUse"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            >
                                Pages jaunes
                            </b-form-checkbox>
                        </label>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
                <b-col>
                    <ValidationProvider name="Site internet" :rules="{ required: false }" ref="currentPartner.websiteUse"
                                        v-slot="{ validate, classes, errors }">
                        <label>
                            <b-form-checkbox
                                type="checkbox"
                                @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                                name="currentPartner.websiteUse"
                                v-model="currentPartner.websiteUse"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            >
                                Site internet
                            </b-form-checkbox>
                        </label>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
                <b-col>
                    <ValidationProvider name="Autres médias" :rules="{ required: false }" ref="currentPartner.otherMediaUse"
                                        v-slot="{ validate, classes, errors }">
                        <label>
                            <b-form-checkbox
                                type="checkbox"
                                @change.native="onBlur($event, { partner: currentPartner, type: 'bool' })"
                                name="currentPartner.otherMediaUse"
                                v-model="currentPartner.otherMediaUse"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            >
                                Autres médias
                            </b-form-checkbox>
                        </label>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
            </b-row>
        <div>
            <b-row class="my-3">
                <b-col md="6">
                    <ValidationProvider name="Réseaux sociaux" rules="min:3" ref="currentPartner.socialNetworkShared"
                                        v-slot="{ validate, classes, errors }">
                        <label class="label">Réseaux sociaux sur lesquels vous communiquez</label>
                        <b-form-textarea
                            type="textarea"
                            :class="classes"
                            @focus="onFocus"
                            @blur="onBlur($event, { partner: currentPartner })"
                            rows="3"
                            name="currentPartner.socialNetworkShared"
                            v-model="currentPartner.socialNetworkShared"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-textarea>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
                <b-col md="6">
                    <ValidationProvider name="Objectifs et retombées" rules="min:3" ref="currentPartner.objectivesAndImpacts"
                                        v-slot="{ validate, classes, errors }">
                        <label class="label">Objectifs et retombées</label>
                        <b-form-textarea
                            type="textarea"
                            :class="classes"
                            @focus="onFocus"
                            @blur="onBlur($event, { partner: currentPartner })"
                            rows="3"
                            name="currentPartner.objectivesAndImpacts"
                            v-model="currentPartner.objectivesAndImpacts"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-textarea>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
            </b-row>
            <b-row class="my-3">
                <b-col class="website-context col-left px-0 mt-3 pb-3" md="6">
                    <b-col class="text-center bg-pink">
                        <h3>SITE EXISTANT</h3>
                    </b-col>
                    <b-col class="mt-3">
                        <ValidationProvider name="Nom de domaine" rules="required|min:3|max:255" ref="currentPartner.sites[0].oldDomain"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Nom de domaine</label>
                            <div class="input-text">
                                <b-form-input
                                    @change.native="onBlur($event, { site: currentPartner.sites[0] })"
                                    type="text"
                                    :class="classes"
                                    name="currentPartner.sites[0].oldDomain"
                                    v-model="currentPartner.sites[0].oldDomain"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                ></b-form-input>
                                <TextLengthMessage
                                    :value="!currentSite || currentSite.oldDomain"
                                    maxlength="255"
                                />
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col class="mt-3">
                        <!-- unknown field -->
                        <ValidationProvider name="Mail associé" rules="email" ref="currentPartner.sites[0].domainEmail"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Mail associé</label>
                            <b-form-input
                                id="domainEmail"
                                @change.native="onBlur($event, { site: currentPartner.sites[0] })"
                                type="email"
                                :class="classes"
                                name="currentPartner.sites[0].domainEmail"
                                v-model="currentPartner.sites[0].domainEmail"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-input>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col class="mt-3">
                        <ValidationProvider name="Analyse des retours" rules="min:3" ref="currentPartner.feedbackReports"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Analyse des retours</label>
                            <b-form-textarea
                                type="textarea"
                                :class="classes"
                                @focus="onFocus"
                                @blur="onBlur($event, { partner: currentPartner })"
                                rows="3"
                                name="currentPartner.feedbackReports"
                                v-model="currentPartner.feedbackReports"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col class="mt-3">
                        <ValidationProvider name="Engagement" rules="min:3" ref="currentPartner.commitment"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Engagement</label>
                            <b-form-textarea
                                type="textarea"
                                :class="classes"
                                @focus="onFocus"
                                @blur="onBlur($event, { partner: currentPartner })"
                                rows="3"
                                name="currentPartner.commitment"
                                v-model="currentPartner.commitment"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col class="mt-3">
                        <ValidationProvider name="Prestataire" rules="min:3" ref="currentPartner.serviceProvider"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Prestataire</label>
                            <b-form-textarea
                                type="textarea"
                                :class="classes"
                                @focus="onFocus"
                                @blur="onBlur($event, { partner: currentPartner })"
                                rows="3"
                                name="currentPartner.serviceProvider"
                                v-model="currentPartner.serviceProvider"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col class="mt-3">
                        <ValidationProvider name="Axe d'amélioration" rules="min:3" ref="currentPartner.improvement"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Axe d'amélioration</label>
                            <b-form-textarea
                                type="textarea"
                                :class="classes"
                                @focus="onFocus"
                                @blur="onBlur($event, { partner: currentPartner })"
                                name="currentPartner.improvement"
                                v-model="currentPartner.improvement"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-col>
                <b-col class="website-context col-right px-0 mt-3 pb-3" md="6">
                    <b-col class="text-center bg-yellow">
                        <h3>PAS DE SITE</h3>
                    </b-col>
                    <b-col class="mt-3">
                        <label class="label">Raison</label>
                        <ValidationProvider name="Raison" :rules="{ required: false }" ref="currentPartner.noSiteCause"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-radio-group
                                type="radio"
                                @change.native="onBlur($event, { partner: currentPartner })"
                                name="currentPartner.noSiteCause"
                                v-model="currentPartner.noSiteCause"
                                :options="noSiteCauseList"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            >
                            </b-form-radio-group>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col class="mt-3">
                        <label class="label">Objectif</label>
                        <ValidationProvider name="Objectif" :rules="{ required: false }" ref="currentPartner.noSiteObjective"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-radio-group
                                type="radio"
                                @change.native="onBlur($event, { partner: currentPartner })"
                                name="currentPartner.noSiteObjective"
                                v-model="currentPartner.noSiteObjective"
                                :options="noSiteObjectiveList"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-radio-group>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-col class="mt-3">
                        <ValidationProvider name="Exemple de mots-clésame" rules="min:3" ref="currentPartner.noSiteKeywords"
                                            v-slot="{ validate, classes, errors }">
                            <label class="label">Exemple de mots-clés</label>
                            <b-form-textarea
                                type="textarea"
                                :class="classes"
                                @focus="onFocus"
                                @blur="onBlur($event, { partner: currentPartner })"
                                rows="3"
                                name="currentPartner.noSiteKeywords"
                                v-model="currentPartner.noSiteKeywords"
                                :disabled="!identity.allowedToEdit"
                                :readonly="!identity.allowedToEdit"
                            ></b-form-textarea>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                </b-col>
            </b-row>
            <b-row class="my-3">
                <b-col>
                    <ValidationProvider name="Objectifs d'un site" rules="min:3" ref="currentPartner.websiteObjective"
                                        v-slot="{ validate, classes, errors }">
                        <label class="label">Objectifs d'un site professionnel</label>
                        <b-form-textarea
                            type="textarea"
                            :class="classes"
                            @focus="onFocus"
                            @blur="onBlur($event, { partner: currentPartner })"
                            rows="3"
                            name="currentPartner.websiteObjective"
                            v-model="currentPartner.websiteObjective"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-textarea>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
            </b-row>
            <b-row class="my-3">
                <b-col>
                    <ValidationProvider name="Degré de motivation" rules="min:3" ref="currentPartner.websiteMotivation"
                                        v-slot="{ validate, classes, errors }">
                        <label class="label">Degré de motivation pour un site professionnel</label>
                        <b-form-textarea
                            type="textarea"
                            :class="classes"
                            @focus="onFocus"
                            @blur="onBlur($event, { partner: currentPartner })"
                            name="currentPartner.websiteMotivation"
                            v-model="currentPartner.websiteMotivation"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                        ></b-form-textarea>
                        <small :class="classes">{{ errors[0] }}</small>
                    </ValidationProvider>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<script>

require('../../../assets/style/Pfolder/partnership-folder.css');

import TextLengthMessage from '../TextLengthMessage';
import {mapState, mapActions} from 'vuex';
import {noSiteCauseList, noSiteObjectiveList} from '../../../Interface/partnershipFolderDatas';

export default {
    name: 'CompanyCommunication',
    components: {
        TextLengthMessage
    },
    data() {
        return {
            noSiteCauseList,
            noSiteObjectiveList,
            previousEditedValue: null,
        }
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        currentSite() {
            return this.currentPartner && this.currentPartner.sites ? this.currentPartner.sites[0] : null;
        },
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
        }
    }
}

</script>
