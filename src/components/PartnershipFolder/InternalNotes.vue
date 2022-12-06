<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <ValidationProvider name="Commentaires pour la Production" rules="expected|max:1024" ref="currentPartner.notes.0.comment" v-slot="{ validate, classes, errors }">
                    <label class="label">
                        Commentaires pour la Production
                        <span v-if="currentNote.updateDate" class="internal-note-date">
                            (dernière mise à jour le {{ formatDate(currentNote.updateDate) }})
                        </span>
                    </label>
                    <div class="input-text">
                        <b-form-textarea
                                @focus="onFocus"
                                @blur="updateComment()"
                                :class="classes"
                                name="currentPartner.notes.0.comment"
                                v-model="currentNote.comment"
                                :disabled="!allowedToEdit || isLoading"
                                :readonly="!allowedToEdit"
                                type="textarea"
                        ></b-form-textarea>
                        <TextLengthMessage
                            :value="currentNote.comment"
                            maxlength="1024"
                        />
                    </div>
                    <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
require('../../assets/style/Pfolder/partnership-folder.css');

import { mapActions, mapState } from "vuex";
import { authDpHelper, dateHelpers, validateSection } from "@/_helpers";
import TextLengthMessage from './TextLengthMessage';
import dpMixin from "../../mixins/dp-mixin";

export default {
    name: 'InternalNotes',
    components: {
        TextLengthMessage
    },
    mixins: [dpMixin],
    data() {
        return {
            isLoading: false,
            currentNote: {}
        }
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        isProvider() {
            return this.identity && authDpHelper.isProvider(this.identity);
        },
        allowedToEdit() {
            return this.identity.allowedToEdit && !this.isProvider;
        },
    },
    mounted() {
        this.loadCurrentNote();
        this.verifyFields();
    },
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        updateComment() {
            if (this.previousEditedValue === this.currentNote.comment) {
                return;
            }
            this.isLoading = true;

            let data = {};
            let note = {
                comment: this.currentNote.comment,
                updateDate: new Date(),
                userId: this.identity.id,
            }
            if (this.currentNote.id) {
                data.note = this.currentNote;
                data.payload = note;
            } else {
                note.partner = this.currentPartner['@id'];
                note.createDate = new Date();
                data.note = note;
            }

            this.verifyFields();
            this.updatePartnerPropertyFromForm({ data }).then(() => {
                this.loadCurrentNote();
                this.isLoading = false;
            });
        },
        loadCurrentNote() {
            this.currentNote = this.currentPartner && this.currentPartner.notes && this.currentPartner.notes.length
                    ? this.currentPartner.notes[0] : {};
        },
        async validateFields() {
            if (!this.allowedToEdit) {
                return;
            }

            let isValid = this.currentNote.comment && this.currentNote.comment.length ? true : 'reset';

            validateSection.displayColorStateOnSection('internal-notes', isValid);
        },
        formatDate: dateHelpers.formatSFBriefDate,
    }
}
</script>
