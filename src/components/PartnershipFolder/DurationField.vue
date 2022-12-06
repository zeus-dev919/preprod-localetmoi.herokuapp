<template>
    <b-row class="team__input-separator __description__duration_field">
        <b-col sm="12" md="3">
            <label class="team__label">{{ required ? '*' : '' }}{{ fieldLabel }} :</label>
        </b-col>
        <b-col sm="12" md="3" class="__description__duration_value-input">
            <ValidationProvider name="duration value" rules="integer" ref="entity.durationValue"
                                v-slot="{ validate, classes, errors }">
                <b-form-input
                    type="text"
                    @focus="onFocus"
                    @blur="onDurationValueChange"
                    v-model="durationValue"
                    :class="classes"
                    :disabled="!identity.allowedToEdit"
                    :readonly="!identity.allowedToEdit"
                    name="entity.durationValue"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
            </ValidationProvider>
        </b-col>
        <b-col sm="12" md="6" class="__description__duration_unit-input">
            <ValidationProvider name="duration unit" ref="entity.durationUnit"
                                v-slot="{ validate, classes, errors }">
                <b-form-select
                    type="select"
                    @change="onDurationUnitChange"
                    v-model="durationUnit"
                    :options="agendaTimeTypeList"
                    :disabled="!identity.allowedToEdit"
                    :readonly="!identity.allowedToEdit"
                    name="entity.durationUnit">
                </b-form-select>
                <small :class="classes">{{ errors[0] }}</small>
            </ValidationProvider>
        </b-col>
    </b-row>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { agendaTimeTypeList } from "../../Interface/partnershipFolderDatas";

export default {
    name: "DurationField",
    props: [
        'fieldLabel',
        'entity',
        'entityName',
        'durationValueField',
        'durationUnitField',
        'required',
        'refreshDurationFieldComponent'
    ],
    data() {
        return {
            previousEditedValue: '',
            agendaTimeTypeList,
            durationValue: null,
            durationUnit: 'Minutes',
        }
    },
    mounted() {
        this.durationValue = this.entity && this.entity[this.durationValueField]
            ? this.entity[this.durationValueField]
            : null
        this.durationUnit = this.entity && this.entity[this.durationUnitField]
            ? this.entity[this.durationUnitField]
            : 'Minutes';
    },
    computed: {
        ...mapState('account', ['identity']),
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onDurationValueChange() {
            if (this.previousEditedValue === this.durationValue) {
                return;
            }

            if (!this.durationUnit || '' === this.durationValue) {
                return;
            }

            this.entity = this.updateObject(this.entity);

            let data = {};
            if (this.entity['@id']) {
                data.payload = this.updateObject({});
            }
            data[this.entityName] = this.entity;

            this.updatePartnerPropertyFromForm({ data }).then(() => {
                if (this.refreshDurationFieldComponent) {
                    this.refreshDurationFieldComponent();
                }
            });
        },
        onDurationUnitChange() {
            if (!this.durationValue) {
                return;
            }

            this.onDurationValueChange();
        },
        updateObject(entity) {
            entity[this.durationValueField] = parseInt(this.durationValue);
            entity[this.durationUnitField] = this.durationUnit;

            return entity;
        }
    }
}
</script>
