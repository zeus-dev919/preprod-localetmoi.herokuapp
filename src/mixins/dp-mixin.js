import { validateSection, readyState, authDpHelper } from "@/_helpers";
import { extend } from "vee-validate";
import { mapState } from "vuex";

extend('expected', validateSection.expected);
extend('expectedCheckedField', validateSection.expectedCheckedField);
extend('requiredCheckedField', validateSection.requiredCheckedField);
extend('expectedCheckbox', validateSection.expectedCheckboxValidator);
extend('expectedFloat', validateSection.expectedFloat);
extend('expectedValidPhone', validateSection.phoneValidator);

export default {
    ...mapState('account', ['identity', 'currentPartner']),
    computed: {
        isClient() {
            return authDpHelper.isUser(this.identity);
        },
        currentSite() {
            return this.currentPartner && this.currentPartner.sites ? this.currentPartner.sites[0] : null;
        },
    },
    data() {
        return {
            readyState: null
        }
    },
    async mounted() {
        this.readyState = await this.getReadyState();
        this.verifyFields();
    },
    methods: {
        async getReadyState() {
            return {
                salesforce: await readyState.getSalesforceState(),
                currentPartner: await readyState.getCurrentPartnerState(),
                allowedToEdit: await readyState.isAllowedToEditToDisplayColorSection(),
            };
        },
        async validateFields(refs, entity, componentName) {
            if (!componentName || !this.readyState.allowedToEdit) {
                return;
            }
            validateSection.displayColorStateOnSection(componentName, await validateSection.validateRequiredFields(entity, refs));
        },
        verifyFields() {
            let componentName = this.getComponentName();
            if (componentName) {
                this.validateFields(this.$refs, {
                    salesforce: this.salesforce,
                    currentPartner: this.currentPartner
                },  componentName);
            }
        },
        getComponentName() {
            let name = this.$options.name.replace(/([a-z0-9]+)([A-Z0-9]+)/g, '$1-$2').toLowerCase();
            return document.querySelector(`#${name}`) ? name : null;
        },
        updatePartnerAndVerifyFields(data) {
            this.updatePartnerPropertyFromForm({ data }).then(() => this.verifyFields());
        }
    }
}
