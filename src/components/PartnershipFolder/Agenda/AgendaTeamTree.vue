<template>
    <b-container fluid id="team-tree">
        <b-row class="my-3 team-tree-label">
            <b-col sm="12" md="3" lg="2" class="p-0">
                <label class="label row-display">Combien d’équipiers avez-vous ?</label>
            </b-col>
            <b-col sm="12" md="1" lg="1" class="p-0">
                <strong>{{ numberOfMembers }}</strong>
            </b-col>
        </b-row>
        <b-row class="pages-container" id="team-tree-page">
            <b-col lg="6" md="12" sm="12" class="page-item mb-3" v-for="(item, index) in agendaMembers" :key="`agenda-member-${index}`">
                <b-col class="mb-2 __title p-0" id="team-tree-title">
                    <span class="__title">{{ item.memberType ? item.memberType : index !== 0 ? `Équipier ${index}` : 'Manager' }}</span>
                </b-col>
                <i v-if="identity.allowedToEdit && index !== 0"
                   class="fas"
                   :class="{'fa-trash': !isMemberRemoving, 'fa-fan': isMemberRemoving}"
                   :disabled="isMemberRemoving"
                   @click="onPageRemove(item, index)"
                ></i>
                <b-col class="mb-2 __description">
                    <b-row class="team__input-separator __description__firstname">
                        <b-col sm="12" md="3">
                            <label class="team__label">Prénom :</label>
                        </b-col>
                        <b-col sm="12" md="9" class="__description__firstname-input">
                            <ValidationProvider name="Prénom" rules="min:3" :ref="`agendaMembers[${index}].firstname`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-input
                                    type="text"
                                    @focus="onFocus"
                                    @blur="onBlur($event, { agendaMember: agendaMembers[index] }, index)"
                                    :class="classes"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    :name="`agendaMembers[${index}].firstname`"
                                    v-model="item.firstname"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="team__input-separator __description__name">
                        <b-col sm="12" md="3">
                            <label class="team__label">Nom :</label>
                        </b-col>
                        <b-col sm="12" md="9" class="__description__name-input">
                            <ValidationProvider name="Nom" rules="min:3" :ref="`agendaMembers[${index}].lastname`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-input
                                    type="text"
                                    @focus="onFocus"
                                    @blur="onBlur($event, { agendaMember: agendaMembers[index] }, index)"
                                    :class="classes"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    :name="`agendaMembers[${index}].lastname`"
                                    v-model="item.lastname"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="team__input-separator __description__phone">
                        <b-col sm="12" md="3">
                            <label class="team__label">Téléphone :</label>
                        </b-col>
                        <b-col sm="12" md="9" class="__description__phone-input">
                            <ValidationProvider name="Téléphone" rules="digits:10" :ref="`agendaMembers[${index}].phone`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-input
                                    type="tel"
                                    @focus="onFocus"
                                    @blur="onBlur($event, { agendaMember: agendaMembers[index] }, index)"
                                    :class="classes"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    :name="`agendaMembers[${index}].phone`"
                                    v-model="item.phone"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="team__input-separator __description__mail">
                        <b-col sm="12" md="3">
                            <label class="team__label">Mail :</label>
                        </b-col>
                        <b-col sm="12" md="9" class="__description__mail-input">
                            <ValidationProvider name="Email" rules="min:8|email" :ref="`agendaMembers[${index}].email`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-input
                                    type="email"
                                    @focus="onFocus"
                                    @blur="onBlur($event, { agendaMember: agendaMembers[index] }, index)"
                                    :class="classes"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    :name="`agendaMembers[${index}].email`"
                                    v-model="item.email"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="team__input-separator __description__role">
                        <b-col sm="12" md="3">
                            <label class="team__label">Rôle :</label>
                        </b-col>
                        <b-col sm="12" md="9" class="__description__role-input">
                            <ValidationProvider name="Rôle" rules="oneOf:Administration,Planifier,Visualiser" :ref="`agendaMembers[${index}].role`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-select
                                    type="select"
                                    @change.native="onBlur($event, { agendaMember: agendaMembers[index] }, index)"
                                    v-model="item.role"
                                    :options="agendaRoleList"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    :name="`agendaMembers[${index}].role`">
                                </b-form-select>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="team__input-separator __description__services">
                        <b-col sm="12" md="3">
                            <label class="team__label">Services réalisé :</label>
                        </b-col>
                        <b-col sm="12" md="9" class="__description__services-input">
                            <ValidationProvider name="Services réalisé" rules="min:3" :ref="`agendaMembers[${index}].realizedService`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-input
                                    type="text"
                                    @focus="onFocus"
                                    @blur="onBlur($event, { agendaMember: agendaMembers[index] }, index)"
                                    :class="classes"
                                    :disabled="!identity.allowedToEdit"
                                    :readonly="!identity.allowedToEdit"
                                    :name="`agendaMembers[${index}].realizedService`"
                                    v-model="item.realizedService"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-col>
                    </b-row>
                    <b-row class="team__input-separator __description__hours">
                        <b-col sm="12" md="4">
                            <label class="team__label">Horaires :</label>
                        </b-col>
                    </b-row>
                    <b-row class="team__input-separator __description__hours">
                        <b-col cols="12" class="__description__hours-input">
                            <TimeRanges
                                parentEntityName="agendaMember"
                                v-bind:parentEntity="item"
                                v-bind:timeRanges="item.appointmentTimeRanges"
                                v-bind:allowedToEdit="identity.allowedToEdit && item.id"
                                customClassName="justify-content-center"
                            />
                        </b-col>
                    </b-row>
                </b-col>
            </b-col>
            <b-col lg="6" md="12" sm="12" class="page-item sample-page mb-3" v-if="identity.allowedToEdit">
                <b-col class="mb-2 __title px-0 py-2" @click="onPageAdd">&nbsp;</b-col>
                <b-col class="mb-2 __description p-0" @click="onPageAdd">
                    <i class="fas fa-plus"></i>
                </b-col>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <p class="agenda__informations">Par défaut sur le module affiché sur le site, nous allons afficher le prénom, le service et le prix</p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import { store } from '@/_store';
import { agendaRoleList, memberType } from "../../../Interface/partnershipFolderDatas";
import TimeRanges from "../TimeRanges";

require('../../../assets/style/Pfolder/partnership-folder.css');
require('../../../assets/style/Pfolder/page-details.css');

export default {
    name: 'AgendaTeamTree',
    components: {TimeRanges},
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('alertStore', ['warn']),
        numberOfMembers() {
            this.currentPartner.agenda.membersLength = this.currentPartner.agenda.agendaMembers.length;
            return this.currentPartner.agenda.membersLength;
        },
    },
    data() {
        return {
            memberType,
            agendaRoleList,
            previousEditedValue: null,
            agendaMembers: [],
            initialMemberCount: 0,
            isMemberRemoving: false,
        };
    },
    mounted() {
        this.initialMemberCount = this.currentPartner.agenda.agendaMembers.length;
        let index = 0;
        if (!this.initialMemberCount) {
            while (this.currentPartner.agenda.agendaMembers.length < 2) {
                this.currentPartner.agenda.agendaMembers.push({
                    agenda: this.currentPartner.agenda['@id'],
                    role: index ? 'Planifier' : 'Administration'
                });
                index++;
            }
        }

        this.reloadAgendaMembers();
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        // Functions below related to Team Tree
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data, index) {
            if (event.target.value === this.previousEditedValue) {
                return;
            }

            let provider = this.$refs[event.target.name];
            if (data.agendaMember && !data.agendaMember.id) {
                data.agendaMember.agenda = this.currentPartner.agenda['@id'];
            }

            data.agendaMember.memberType = 0 === index ? 'Manager' : `Équipier ${index}`;

            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({previousEditedValue: this.previousEditedValue}, data) : undefined
            }).then(() => {
                if (this.initialMemberCount) {
                    this.currentPartner.agenda.agendaMembers = this.currentPartner.agenda.agendaMembers.filter(
                        item => item.id
                    );
                }
                this.reloadAgendaMembers();
            });
        },
        checkIfAnyAgendaMemberIdIsNotDefined() {
            return this.currentPartner.agenda.agendaMembers
                .find(agendaMember => !agendaMember.id);
        },
        onPageAdd: function () {
            let members = this.currentPartner.agenda.agendaMembers;
            if (members.length && this.checkIfAnyAgendaMemberIdIsNotDefined()) {
                store.dispatch(
                    'alert/warn',
                    {
                        group: 'auth-error',
                        message: "Veuillez remplir le dernier équipier avant d'en ajouter un autre.",
                        show: true,
                        title: 'Vous ne pouvez pas ajouter un équipier',
                        type: 'error',
                        duration: 3000
                    },
                    {root: true}
                );
                return;
            }
            this.currentPartner.agenda.agendaMembers.push({
                agenda: this.currentPartner.agenda['@id'],
                appointmentTimeRanges: [],
            });
        },
        onPageRemove(agendaMember, index) {
            if (this.isMemberRemoving) {
                return;
            }
            this.isMemberRemoving = true;
            if (agendaMember && agendaMember.id) {
                this.deletePartnerPropertyFromForm({
                    data: {agendaMember: agendaMember}
                })
                    .then(() => this.reloadAgendaMembers())
                    .finally(() => this.isMemberRemoving = false);
            } else {
                this.currentPartner.agenda.agendaMembers.splice(index, 1);
                this.reloadAgendaMembers();
                this.isMemberRemoving = false;
            }
        },
        reloadAgendaMembers() {
            if (!this.currentPartner.agenda || !this.currentPartner.agenda.agendaMembers) {
                this.agendaMembers = [];
                return;
            }

            let index = this.currentPartner.agenda.agendaMembers.findIndex(item => 'Manager' === item.memberType);
            if (0 < index) {
                this.currentPartner.agenda.agendaMembers = [
                    ...this.currentPartner.agenda.agendaMembers.splice(index, 1),
                    ...this.currentPartner.agenda.agendaMembers
                ];
            }

            this.agendaMembers = this.currentPartner.agenda.agendaMembers;
        }
    }
}
</script>
