<template>
    <b-container fluid v-if="currentPartner.partnerShop">
        <b-row>
            <b-col class="mb-2">
                <span>Listez les catégories et sous-catégories qui composent les pages définies
    dans l'arborescence.
                </span>
            </b-col>
        </b-row>
        <b-row>
            <!-- categoriesForm -->
            <b-col sm="12" md="10">
                <ValidationProvider name="catégories" rules="expected" ref="currentPartner.partnerShop.categories" v-slot="{ validate, classes, errors }">
                    <b-form-textarea
                            @focus="onFocus"
                            @blur="onBlur($event, { partnerShop: currentPartner.partnerShop })"
                            v-model="currentPartner.partnerShop.categories"
                            :disabled="!identity.allowedToEdit"
                            :readonly="!identity.allowedToEdit"
                            name="currentPartner.partnerShop.categories"
                            type="textarea"
                            :class="classes"
                            rows="15"
                            placeholder="Ex :
            Catégorie 1 : Vetements
                Sous-catégories :
                  - Vêtements femme
                  - vêtements homme
            Catégorie 2 : Chaussures
                Sous-catégories :
                  - Chaussures à talon
                  - Chaussures plates
            Catégorie 3 : Accessoires
                Sous-catégories :
                  - Chapeaux
                  - Ceintures
                  - Foulards"
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
    import dpMixin from '../../mixins/dp-mixin';
    import { validateSection } from "../../_helpers";

    export default {
        name: 'Categories',
        mixins: [dpMixin],
        computed: {
            ...mapState('account', ['identity', 'currentPartner']),
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
                });
                this.verifyFields();
            },
            async validateFields(refs, entity) {
                if (!this.readyState.allowedToEdit) {
                    return;
                }
        
                let isValid = await validateSection.validateRequiredFields(entity, refs);
                if (isValid) {
                    const categories = entity.currentPartner.partnerShop.categories;
                    isValid = categories && categories.length >= 150 ? true : null;
                }
        
                validateSection.displayColorStateOnSection('categories', isValid);
            }
        }
    }
</script>
