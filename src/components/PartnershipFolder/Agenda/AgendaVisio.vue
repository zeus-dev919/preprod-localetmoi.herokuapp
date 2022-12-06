<template>
    <b-container fluid id="visio-tree">
        <b-row class="my-3">
            <b-col class="p-0">
                <label class="label row-display">Pour quels services déjà listés ci-dessus souhaitez vous proposer la visio :</label>
            </b-col>
        </b-row>
        <b-row class="pages-container" id="visio-tree-page">
            <b-col lg="4" md="6" sm="12" class="page-item mb-3" v-for="(agendaVisio, index) in currentPartner.agenda.agendaVisios" :key="index">
                <b-col class="mb-2 __title p-0">
                    <span class="__title">{{ index !== 0 ? `Service ${index}` : `Service` }}</span>
                </b-col>
                <i class="fas fa-trash" v-if="identity.allowedToEdit && currentPartner.agenda.agendaVisios && currentPartner.agenda.agendaVisios.length > 1" @click="onPageRemove(agendaVisio, index)"></i>
                <b-col class="mb-2 __description">
                    <b-row class="team__input-separator __description__visio_name">
                        <b-col>
                            <label class="team__label">Nom du service :</label>
                        </b-col>
                    </b-row>
                    <b-row class="justify-content-left">
                        <b-col cols="12"  class="ml-1 pr-4 __description__visio_name-input">
                            <ValidationProvider name="Nom du service" rules="min:3" :ref="`currentPartner.agenda.agendaVisios[${index}].name`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-input
                                    type="text"
                                    @focus="onFocus"
                                    @blur="onBlur($event, { agendaVisio: currentPartner.agenda.agendaVisios[index] })"
                                    :class="classes"
                                    :disabled="!identity.allowedToEdit || isUpdating"
                                    :readonly="!identity.allowedToEdit"
                                    :name="`currentPartner.agenda.agendaVisios[${index}].name`"
                                    v-model="agendaVisio.name"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3 team__input-separator __description__name">
                        <b-col>
                            <label class="team__label">Ce service doit-il exister :</label>
                        </b-col>
                    </b-row>
                    <b-row class="justify-content-left ml-1">
                        <b-col md="3" lg="3" sm="12">
                            <ValidationProvider name="Service existant sur place" :rules="{ required: false }" :ref="`currentPartner.agenda.agendaVisios[${index}].isOnSpot`"
                                                v-slot="{ validate, classes, errors }">
                                <label>
                                    <b-form-checkbox
                                        type="checkbox"
                                        @change.native="onBlur($event, { agendaVisio: currentPartner.agenda.agendaVisios[index], type: 'bool' })"
                                        :name="`currentPartner.agenda.agendaVisios[${index}].isOnSpot`"
                                        v-model="agendaVisio.isOnSpot"
                                        :disabled="!identity.allowedToEdit || isUpdating"
                                        :readonly="!identity.allowedToEdit"
                                    >
                                        Sur place
                                    </b-form-checkbox>
                                </label>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                        <b-col md="3" lg="3" sm="12">
                            <ValidationProvider name="Service existant en visio" :rules="{ required: false }" :ref="`currentPartner.agenda.agendaVisios[${index}].isRemote`"
                                                v-slot="{ validate, classes, errors }">
                                <label>
                                    <b-form-checkbox
                                        type="checkbox"
                                        @change.native="onBlur($event, { agendaVisio: currentPartner.agenda.agendaVisios[index], type: 'bool' })"
                                        :name="`currentPartner.agenda.agendaVisios[${index}].isRemote`"
                                        v-model="agendaVisio.isRemote"
                                        :disabled="!identity.allowedToEdit || isUpdating"
                                        :readonly="!identity.allowedToEdit"
                                    >
                                        En visio
                                    </b-form-checkbox>
                                </label>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3 team__input-separator __description__services">
                        <b-col>
                            <label class="team__label">Souhaitez vous que nous utilisions notre solution ? :</label>
                        </b-col>
                    </b-row>
                    <b-row class="justify-content-left ml-1">
                        <b-col md="3" lg="3" sm="12">
                            <ValidationProvider name="Utilisation de notre solution" :rules="{ required: false }" :ref="`currentPartner.agenda.agendaVisios[${index}].useOurSolution`"
                                                v-slot="{ validate, classes, errors }">
                                <label>
                                    <b-form-radio
                                        type="radio"
                                        @change.native="onBlur($event, { agendaVisio: currentPartner.agenda.agendaVisios[index], type: 'bool' })"
                                        :name="`currentPartner.agenda.agendaVisios[${index}].useOurSolution`"
                                        v-model="agendaVisio.useOurSolution"
                                        :value="true"
                                        :disabled="!identity.allowedToEdit || isUpdating"
                                        :readonly="!identity.allowedToEdit"
                                    >
                                        Oui
                                    </b-form-radio>
                                </label>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                        <b-col md="3" lg="3" sm="12">
                            <ValidationProvider name="Utilisation de notre solution" :rules="{ required: false }" :ref="`currentPartner.agenda.agendaVisios[${index}].useOurSolution`"
                                                v-slot="{ validate, classes, errors }">
                                <label>
                                    <b-form-radio
                                        type="radio"
                                        @change.native="onBlur($event, { agendaVisio: currentPartner.agenda.agendaVisios[index], type: 'bool' })"
                                        :name="`currentPartner.agenda.agendaVisios[${index}].useOurSolution`"
                                        v-model="agendaVisio.useOurSolution"
                                        :value="false"
                                        :disabled="!identity.allowedToEdit || isUpdating"
                                        :readonly="!identity.allowedToEdit"
                                    >
                                        Non
                                    </b-form-radio>
                                </label>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="mt-3 team__input-separator __description__visio">
                        <b-col>
                            <label class="team__label">Transmettez nous le lien vers votre outil de visio jitsi :</label>
                        </b-col>
                    </b-row>
                    <b-row class="justify-content-left">
                        <b-col cols="12" class="mb-1 ml-1 pr-4 __description__visio-input">
                            <ValidationProvider name="Outil de visio" rules="min:3" :ref="`currentPartner.agenda.agendaVisios[${index}].toolUrl`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-input
                                    type="text"
                                    @focus="onFocus"
                                    @blur="onBlur($event, { agendaVisio: currentPartner.agenda.agendaVisios[index] })"
                                    :class="classes"
                                    :disabled="!identity.allowedToEdit || isUpdating"
                                    :readonly="!identity.allowedToEdit"
                                    :name="`currentPartner.agenda.agendaVisios[${index}].toolUrl`"
                                    v-model="agendaVisio.toolUrl"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                </b-col>
            </b-col>
            <b-col lg="4" md="6" sm="12" class="page-item sample-page mb-3" v-if="identity.allowedToEdit">
                <b-col class="mb-2 __title px-0 py-2" @click="onPageAdd">&nbsp;</b-col>
                <b-col class="mb-2 __description p-0" @click="onPageAdd">
                    <i class="fas fa-plus"></i>
                </b-col>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <p class="visio__informations">
                    Un service peut-être réalisé sur place ou en visio (exemple : une séance de Yoga). Les 2 peuvent donc être cochées.
                </p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import { store } from '@/_store';
import { yesNoOptions } from "../../../Interface/partnershipFolderDatas";

require('../../../assets/style/Pfolder/partnership-folder.css');
require('../../../assets/style/Pfolder/page-details.css');

export default {
    name: 'AgendaVisio',
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('alertStore', ['warn'])
    },
    data() {
        return {
            yesNoOptions,
            previousEditedValue: null,
            isUpdating: false,
        }
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        // Functions below related to Team Tree
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            this.isUpdating = true;
            let provider = this.$refs[event.target.name];
            if (data.agendaVisio && !data.agendaVisio.id) {
                data.agendaVisio.agenda = this.currentPartner.agenda['@id'];
            }

            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({previousEditedValue: this.previousEditedValue}, data) : undefined
            })
                .then(() => this.isUpdating = false)
                .catch(() => this.isUpdating = false);
        },
        onPageAdd: function () {
            let visios = this.currentPartner.agenda.agendaVisios;
            if (visios.length && !visios[visios.length - 1].id) {
                store.dispatch(
                    'alert/warn',
                    {
                        group: 'auth-error',
                        message: "Veuillez remplir le dernier service avant d'en ajouter un autre.",
                        show: true,
                        title: 'Vous ne pouvez pas ajouter un service',
                        type: 'error',
                        duration: 3000
                    },
                    {root: true}
                );
                return;
            }
            this.currentPartner.agenda.agendaVisios.push({
                name: null,
                isOnSpot: null,
                isRemote: null,
                useOurSolution: null,
                toolUrl: null,
            });
        },
        onPageRemove(visio, index) {
            if (visio && visio.id) {
                this.deletePartnerPropertyFromForm({
                    data: {agendaVisio: visio}
                });
            } else {
                if (!this.currentPartner.agenda.agendaVisios
                    || this.currentPartner.agenda.agendaVisios.length <= 1
                ) {
                    store.dispatch('alert/warn',
                        {
                            group: 'general-error',
                            type: 'warn',
                            message: 'Veuillez saisir une description pour cet équipier.',
                            show: true,
                            title: 'Vous ne pouvez pas supprimer un équipier vide'
                        },
                    );
                } else {
                    this.currentPartner.agenda.agendaVisios.splice(index, 1);
                }
            }
        }
    }
}
</script>

