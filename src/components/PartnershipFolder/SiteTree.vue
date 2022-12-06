<template>
    <b-container fluid>
        <b-row class="mb-3">
            <b-col lg="2" md="3">
                <span>Version étrangère souhaitée :</span>
            </b-col>
            <b-col lg="10" md="9">
                <b-row>
                    <b-col class="languages mb-1"
                           v-for="(availableLanguage, index) in availableLanguages"
                           :key="availableLanguage.value" lg="3" md="4" sm="6">
                        <b-form-checkbox class="mb-1"
                                         :name="`currentPartner.sites.0.languages.${index}.language`"
                                         :disabled="true"
                                         :readonly="true"
                                         :value="availableLanguage.value"
                                         v-model="checkedLanguages"
                                         type="checkbox"
                                         help="Les contenus traduits sont fournis par le partenaire"
                        >
                            <img :src="require(`../../assets/flag-${availableLanguage.value}.png`)">
                        </b-form-checkbox>
                        <div class="translations translations-group"
                             v-if="isLanguageChecked[index]"
                             v-for="(translateOption, index2) in translateOptions"
                             :key="translateOption.value">
                            <b-form-radio-group
                                :name="`currentPartner.sites.0.languages.${index2}.toTranslate`"
                                :disabled="true"
                                :readonly="true"
                                :options="[ translateOption ]"
                                v-model="toTranslate[availableLanguage.value]"
                                type="checkbox"
                            ></b-form-radio-group>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <!-- banner -->
        <b-row class="mb-3">
            <b-col>
                <span>Quelles informations souhaitez-vous indiquer dans le bandeau de votre site ? <span class="info-field">(Champ limité à 255 caractères)</span></span>
            </b-col>
        </b-row>
        <!-- include Banners component -->
        <Banners v-bind:verifyFields="verifyFields"/>
        <!-- Keep SiteTree -->
        <b-row class="mb-3">
            <b-col cols="12">
                <ValidationProvider name="Conserver l'arborescence" :rules="{ required: false }"
                                    ref="currentPartner.sites.0.keepTree"
                                    v-slot="{ validate, classes, errors }">
                    <b-form-checkbox
                        @change.native="onBlur($event, { site: currentPartner.sites[0], type: 'bool' })"
                        type="checkbox"
                        name="currentPartner.sites.0.keepTree"
                        v-model="keepTree"
                        :disabled="!allowedToEdit"
                        :readonly="!allowedToEdit"
                    >
                        Je ne souhaite pas modifier l'arborescence
                    </b-form-checkbox>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mb-3" v-if="!keepTree">
            <b-col>
                <span>Arborescence</span>
            </b-col>
        </b-row>
        <b-row class="pages-container" v-if="!keepTree">
            <draggable class="draggable-tree"
                       :class="{zone: drag}"
                       :list="siteTrees"
                       :disabled="!allowedToEdit && !isSiteTreeUpdating"
                       handle=".dnd-handle"
                       @start="drag=true"
                       @end="drag=false"
                       ghost-class="dnd-ghost"
                       @dragend.native="onDragAndDrop(siteTrees)">
                <b-col lg="3" md="4" sm="12" class="page-item mb-3" v-for="(item, index) in siteTrees" :key="index">
                    <b-col class="mb-2 __title p-0">
                        <ValidationProvider name="nom"
                                            :rules="{ required: true, min:3, max:255, expectedUniqueValues: { values: pageNames } } "
                                            :ref="`currentPartner.sites.0.siteTrees.${index}.name`"
                                            v-slot="{ validate, classes, errors }">
                            <div class="input-text">
                                <b-form-input
                                    type="text"
                                    @focus="onFocus($event, index)"
                                    @blur="onPageUpdate($event, { siteTree: item })"
                                    :class="classes"
                                    :disabled="!allowedToEdit || drag || isSiteTreeUpdating"
                                    :readonly="!allowedToEdit"
                                    :name="`currentPartner.sites.0.siteTrees.${index}.name`"
                                    v-model="item.name"
                                ></b-form-input>
                                <TextLengthMessage
                                    :value="item.name"
                                    maxlength="255"
                                />
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <i class="dnd-handle fas fa-arrows-alt" v-if="allowedToEdit && !isSiteTreeUpdating"></i>
                    <i class="fas fa-trash"
                       v-if="allowedToEdit && !isSiteTreeUpdating && siteTrees && siteTrees.length > 2"
                       @click="onPageRemove(item, index)"></i>
                    <i class="fas fa-fan" v-if="allowedToEdit && isSiteTreeUpdating && (index === currentPageIndex || null === currentPageIndex)"></i>
                    <b-col class="mb-2 __description p-0">
                        <ValidationProvider name="description" rules="required|min:6"
                                            :ref="`currentPartner.sites.0.siteTrees.${index}.description`"
                                            v-slot="{ validate, classes, errors }">
                            <b-form-textarea
                                type="textarea"
                                v-if="allowedToEdit"
                                v-autoresize
                                @focus="onFocus($event, index)"
                                @blur="onPageUpdate($event, { siteTree: item })"
                                :class="classes"
                                rows="5"
                                :disabled="!allowedToEdit || drag || isSiteTreeUpdating"
                                :readonly="!allowedToEdit"
                                :name="`currentPartner.sites.0.siteTrees.${index}.description`"
                                v-model="item.description"
                                placeholder="Décrire le contenu de la page"
                            ></b-form-textarea>
                            <div class="pre-line-text"
                                 v-else-if="!allowedToEdit && item.description && item.description.length">
                                {{ item.description }}
                            </div>
                            <small :class="classes">{{ errors[0] }}</small>
                        </ValidationProvider>
                    </b-col>
                    <b-row class="__subpages px-3">
                        <b-form-group label-cols="10" label="Nombre de sous-pages" label-align="right" class="w-100">
                            <ValidationProvider name="sous-pages" rules="integer"
                                                :ref="`siteTrees.${index}.subpagesQuantity`"
                                                v-slot="{ validate, classes, errors }">
                                <b-form-input
                                    type="number"
                                    @focus="onFocus($event, index)"
                                    @blur="onPageUpdate($event, { siteTree: item })"
                                    :class="classes"
                                    :disabled="!allowedToEdit || drag || isSiteTreeUpdating"
                                    :readonly="!allowedToEdit"
                                    :name="`siteTrees.${index}.subpagesQuantity`"
                                    v-model="item.subpagesQuantity"
                                    class="px-0"
                                ></b-form-input>
                                <small :class="classes">{{ errors[0] }}</small>
                            </ValidationProvider>
                        </b-form-group>
                    </b-row>
                </b-col>
            </draggable>
    
            <b-col lg="3" md="4" sm="12" class="page-item sample-page mb-3" v-if="allowedToEdit"
                   @click="onPageAdd">
                <b-col class="mb-2 __title px-0 py-2">&nbsp;</b-col>
                <b-col class="mb-2 __description p-0">
                    <i class="fas fa-plus"></i>
                </b-col>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { availableLanguages, translateOptions } from "../../Interface/partnershipFolderDatas";
import Banners from "./Banners";
import TextLengthMessage from './TextLengthMessage';
import { store } from '@/_store';
import autoresize from '../../directives/AutoResize';
import draggable from 'vuedraggable';
import { validateSection, readyState } from "@/_helpers";
import { extend } from "vee-validate";

require('../../assets/style/Pfolder/partnership-folder.css');
require('../../assets/style/Pfolder/page-details.css');

extend('expectedUniqueValues', validateSection.expectedUniqueValues);

export default {
    name: 'SiteTree',
    components: {
        Banners,
        TextLengthMessage,
        draggable
    },
    directives: {
        autoresize
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('alertStore', ['warn']),
        siteTrees() {
            return this.currentPartner && this.currentPartner.sites && this.currentPartner.sites.length
                ? this.currentPartner.sites[0].siteTrees : [];
        },
        allowedToEdit: {
            get() {
                return this.canEditPf && this.identity.allowedToEdit;
            },
            set(val) {
                if (this.canEditPf) {
                    this.canEditPf = val;
                }
            }
        },
        pageNames() {
            return this.siteTrees.map(item => item.name);
        }
    },
    data() {
        return {
            drag: false,
            draggable,
            availableLanguages,
            translateOptions,
            checkedLanguages: [],
            isLanguageChecked: [],
            toTranslate: {},
            previousEditedValue: null,
            keepTree: null,
            isSiteTreeUpdating: false,
            cutomErrors: [],
            canEditPf: false,
            currentPageIndex: null,
        }
    },
    updated() {
        this.$nextTick(() => {
            this.verifyFields();
        })
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm', 'deletePartnerPropertyFromForm']),
        ...mapActions('globalStore', ['getLanguages']),
        onFocus(event, index) {
            this.previousEditedValue = event.target.value;
            this.currentPageIndex = index;
        },
        onBlur(event, data) {
            if (this.isSiteTreeUpdating) {
                return;
            }

            this.isSiteTreeUpdating = true;
            let provider = this.$refs[event.target.name];
            if (data.siteTree && !data.siteTree.id) {
                data.siteTree.site = this.currentPartner.sites[0]['@id'];
                if (1 === this.currentPartner.sites[0].siteTrees.length
                    && !this.currentPartner.sites[0].siteTrees[0]['@id']
                ) {
                    data.siteTree.position = 1;
                }
            }
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            }).then(() => {
                this.initializeRelations();
                this.verifyFields();
            }).finally(() => this.isSiteTreeUpdating = false);
        },
        onPageUpdate(event, data) {
            if (this.isSiteTreeUpdating) {
                return;
            }
            if (this.previousEditedValue === event.target.value) {
                return;
            }

            this.isSiteTreeUpdating = true;
            let provider = this.$refs[event.target.name];
            let isNewPage = data.siteTree && !data.siteTree.id;
            if (isNewPage) {
                data.siteTree.site = this.currentPartner.sites[0]['@id'];
                if (1 === this.currentPartner.sites[0].siteTrees.length
                    && !this.currentPartner.sites[0].siteTrees[0]['@id']
                ) {
                    data.siteTree.position = 1;
                }
            }
            let updatePromise = this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
            if (isNewPage) {
                updatePromise.then(() => {
                    this.initializeRelations();
                    this.verifyFields();
                }).finally(() => this.isSiteTreeUpdating = false);
            } else {
                this.initializeRelations();
                this.verifyFields();
                this.isSiteTreeUpdating = false;
            }
        },
        onPageAdd: function () {
            this.currentPartner.sites[0].siteTrees.push({
                name: null,
                description: null,
                subpagesQuantity: null,
                position: Math.max(
                    this.currentPartner.sites[0].siteTrees.length,
                    ...this.currentPartner.sites[0].siteTrees.map(item => item.position + 1)
                )
            });
            this.initializeRelations();
            this.verifyFields();
        },
        onPageRemove(siteTree, index) {
            if (this.isSiteTreeUpdating) {
                return;
            }

            if (siteTree && siteTree.id) {
                this.isSiteTreeUpdating = true;
                this.deletePartnerPropertyFromForm({
                    data: { siteTree: siteTree },
                    showNotification: false
                }).then(() => {
                    this.isSiteTreeUpdating = false;
                    return this.onDragAndDrop(this.currentPartner.sites[0].siteTrees);
                }).then(() => {
                    this.initializeRelations();
                    this.verifyFields();
                }).finally(() => this.isSiteTreeUpdating = false);
            } else {
                if (!this.currentPartner.sites[0].siteTrees
                    || this.currentPartner.sites[0].siteTrees.length <= 2
                ) {
                    store.dispatch('alert/warn',
                        {
                            group: 'general-error',
                            type: 'warn',
                            message: 'Veuillez saisir un titre ainsi qu\'une description pour cette page.',
                            show: true,
                            title: 'Vous ne pouvez pas supprimer une page vide'
                        },
                    );
                } else {
                    this.currentPartner.sites[0].siteTrees.splice(index, 1);
                    this.onDragAndDrop(this.currentPartner.sites[0].siteTrees);
                }
            }
        },
        onDragAndDrop(siteTrees) {
            if (!this.allowedToEdit || this.isSiteTreeUpdating) {
                return;
            }

            this.currentPageIndex = null;
            this.isSiteTreeUpdating = true;
            return Promise.all(siteTrees.map((siteTree, index) => {
                if (!siteTree.id) {
                    siteTree.position = index;
                }

                if (siteTree.position === index) {
                    return Promise.resolve();
                }

                siteTree.position = index;

                return this.updatePartnerPropertyFromForm({
                    data: {
                        siteTree,
                        payload: {
                            position: index
                        }
                    },
                    showNotification: false,
                });
            })).then(() => {
                this.initializeRelations();
                store.dispatch('alert/success', {
                    group: 'general-error',
                    type: 'success',
                    message: 'Données correctement mises à jour !',
                    show: true,
                    title: 'Données sauvegardées !'
                });
            }).finally(() => {
                this.isSiteTreeUpdating = false;
                this.verifyFields();
            });
        },
        initializeRelations() {
            this.currentPartner.sites[0].siteTrees.sort((a, b) => a.position - b.position);
        },
        /**
         * Behavior to validate to turn on green section:
         * We must have at least one banner field filled,
         * We must have at least four pages in siteTrees,
         * We must have unique page name in siteTrees,
         * We must have a valid requirement fields.
         *
         * @param refs
         * @param entity
         * @returns {Promise<void>}
         */
        async validateFields(refs, entity) {
            if (!this.allowedToEdit) {
                return;
            }

            let isValid = await validateSection.validateRequiredFields(entity, refs);
            let siteTrees = entity.currentPartner.sites[0].siteTrees;

            if (isValid) {
                let isBannerValid = entity.currentPartner.sites[0].banners.some(
                    banner => banner.leftContent || banner.centerContent || banner.rightContent
                );
                if (false === isBannerValid) {
                    isValid = null;
                }

                if (!validateSection.isUnique(siteTrees.map(item => item.name))) {
                    isValid = null;
                }

                if (siteTrees.length < 3) {
                    isValid = null;
                }
            }

            if (!this.keepTree) {
                let validate;
                for (let i = 0; i < siteTrees.length; i++) {
                    let siteTree = siteTrees[i];
                    if (!siteTree.name || siteTree.name.length < 3) {
                        validate = await this.$refs[`currentPartner.sites.0.siteTrees.${i}.name`][0].validate();
                        isValid = validate.valid;
                    }
                    if (!siteTree.description || siteTree.description.length < 20) {
                        validate = await this.$refs[`currentPartner.sites.0.siteTrees.${i}.description`][0].validate();
                        isValid = validate.valid;
                    }
                }
            }

            validateSection.displayColorStateOnSection('site-tree', isValid);
        },
        async verifyFields() {
            return this.validateFields(this.$refs, { currentPartner: this.currentPartner });
        },
    },
    async mounted() {
        const salesforce = await readyState.getSalesforceState();
        const currentPartner = await readyState.getCurrentPartnerState();
        this.canEditPf = await readyState.isAllowedToEditToDisplayColorSection();

        currentPartner.sites[0].languages.forEach(item => {
            this.checkedLanguages.push(item.language);
            this.toTranslate[item.language] = item.toTranslate;
        });
        this.isLanguageChecked = this.availableLanguages.map(language => -1 !== this.checkedLanguages.indexOf(language.value));
        this.keepTree = currentPartner.sites[0].keepTree;
        this.initializeRelations();

        await this.validateFields(this.$refs, { salesforce, currentPartner });
    },
}
</script>
