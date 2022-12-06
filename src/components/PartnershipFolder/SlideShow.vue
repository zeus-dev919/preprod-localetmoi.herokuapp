<template>
    <b-container fluid v-if="currentPartner.partnerShop">
        <b-row>
            <b-col class="mb-2">
                <span> Le diaporama est la vitrine de votre boutique. Nous mettrons en avant les 4
                    catégories principales, sauf mentions contraires de votre part. Cette partie
                    sera vue directement avec le chargé de site e-commerce lors de l'appel de
                    brief.
                </span>
            </b-col>
        </b-row>
        <!-- slideShowForm -->
        <b-row class="mb-3">
            <b-col>
                <ValidationProvider name="diaporama" rules="min:5|expected" ref="currentPartner.partnerShop.firstProductCategory" v-slot="{ validate, classes, errors }">
                    <label class="label">Première slide</label>
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                            v-model="currentPartner.partnerShop.firstProductCategory"
                            :class="classes"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            name="currentPartner.partnerShop.firstProductCategory"
                            placeholder="catégorie 1"
                            type="textarea"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                <ValidationProvider name="diaporama" rules="min:5|expected" ref="currentPartner.partnerShop.secondProductCategory" v-slot="{ validate, classes, errors }">
                    <label class="label">Deuxième slide</label>
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                            v-model="currentPartner.partnerShop.secondProductCategory"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            :class="classes"
                            name="currentPartner.partnerShop.secondProductCategory"
                            placeholder="catégorie 2"
                            type="textarea"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                <ValidationProvider name="diaporama" rules="min:5|expected" ref="currentPartner.partnerShop.thirdProductCategory" v-slot="{ validate, classes, errors }">
                    <label class="label">Troisième slide</label>
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                            v-model="currentPartner.partnerShop.thirdProductCategory"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            :class="classes"
                            name="currentPartner.partnerShop.thirdProductCategory"
                            placeholder="catégorie 3"
                            type="textarea"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                <ValidationProvider name="diaporama" rules="min:5|expected" ref="currentPartner.partnerShop.fourthProductCategory" v-slot="{ validate, classes, errors }">
                    <label class="label">Quatrième slide</label>
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                            v-model="currentPartner.partnerShop.fourthProductCategory"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            :class="classes"
                            name="currentPartner.partnerShop.fourthProductCategory"
                            placeholder="catégorie 4"
                            type="textarea"
                    ></b-form-textarea>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    require('../../assets/style/Pfolder/partnership-folder.css');
    import {mapActions, mapState} from "vuex";
    import dpMixin from "../../mixins/dp-mixin";

    export default {
        name: 'SlideShow',
        mixins: [dpMixin],
        computed: {
            ...mapState('account', ['identity', 'currentPartner']),
        },
        data() {
            return {
                editSlide: null,
            }
        },
        methods: {
            ...mapActions('account', ['updatePartnerPropertyFromForm']),
            onFocus(event) {
                this.previousEditedValue = event.target.value;
            },
            onBlur(event, data) {
                let provider = this.$refs[event.target.name];
                if (data.partnerShop && !data.partnerShop.id) {
                    data.partnerShop.partner = this.currentPartner['@id'];
                }
                this.updatePartnerPropertyFromForm({
                    event: event,
                    provider: provider[0] || provider,
                    data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
                }).then(() => this.verifyFields());
            },
        }
    }
</script>
