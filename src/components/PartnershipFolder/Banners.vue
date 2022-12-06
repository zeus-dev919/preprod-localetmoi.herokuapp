<template>
    <b-row class="mt-3">
        <b-col class="page-item mb-3" md="4">
            <label class="label">À gauche</label>
            <ValidationProvider name="contenu bandeau gauche" rules="min:5|max:1024" ref="currentPartner.sites[0].banners[0].leftContent"
                                v-slot="{ validate, classes, errors }">
                <div class="input-text" v-if="identity.allowedToEdit">
                    <b-form-textarea
                        v-autoresize
                        @focus="onFocus"
                        @blur="onBlur($event, { banner: currentPartner.sites[0].banners[0] })"
                        type="textarea"
                        :class="classes"
                        name="currentPartner.sites[0].banners[0].leftContent"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        v-model="leftContent"
                    ></b-form-textarea>
                    <TextLengthMessage
                        v-if="currentBanner"
                        :value="leftContent"
                        maxlength="1024"
                    />
                </div>
                <div class="mx-2 pre-line-text" v-else-if="!identity.allowedToEdit && leftContent && leftContent.length">
                    {{ leftContent }}
                </div>
                <small :class="classes">{{ errors[0] }}</small>
            </ValidationProvider>
        </b-col>
        <b-col class="page-item mb-3" md="4">
            <label class="label">Au centre</label>
            <ValidationProvider name="contenu bandeau centre" rules="min:5|max:1024" ref="currentPartner.sites[0].banners[0].centerContent"
                                v-slot="{ validate, classes, errors }">
                <div class="input-text" v-if="identity.allowedToEdit">
                    <b-form-textarea
                        v-autoresize
                        @focus="onFocus"
                        @blur="onBlur($event, { banner: currentPartner.sites[0].banners[0] })"
                        type="textarea"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        name="currentPartner.sites[0].banners[0].centerContent"
                        v-model="centerContent"
                    ></b-form-textarea>
                    <TextLengthMessage
                        v-if="currentBanner"
                        :value="centerContent"
                        maxlength="1024"
                    />
                </div>
                <div class="mx-2 pre-line-text" v-else-if="!identity.allowedToEdit && centerContent && centerContent.length">
                    {{ centerContent }}
                </div>
                <small :class="classes">{{ errors[0] }}</small>
            </ValidationProvider>
        </b-col>
        <b-col class="page-item mb-3" md="4">
            <label class="label">À droite</label>
            <ValidationProvider name="contenu bandeau droit" rules="min:5|max:1024" ref="currentPartner.sites[0].banners[0].rightContent"
                                v-slot="{ validate, classes, errors }">
                <div class="input-text" v-if="identity.allowedToEdit">
                    <b-form-textarea
                        v-autoresize
                        @focus="onFocus"
                        @blur="onBlur($event, { banner: currentPartner.sites[0].banners[0] })"
                        type="textarea"
                        :class="classes"
                        :disabled="!identity.allowedToEdit"
                        :readonly="!identity.allowedToEdit"
                        name="currentPartner.sites[0].banners[0].rightContent"
                        v-model="rightContent"
                    ></b-form-textarea>
                    <TextLengthMessage
                        v-if="currentBanner"
                        :value="rightContent"
                        maxlength="1024"
                    />
                </div>
                <div class="mx-2 pre-line-text" v-else-if="!identity.allowedToEdit && rightContent && rightContent.length">
                    {{ rightContent }}
                </div>
                <small :class="classes">{{ errors[0] }}</small>
            </ValidationProvider>
        </b-col>
    </b-row>
</template>

<script>
import {mapActions, mapState} from "vuex";
import TextLengthMessage from './TextLengthMessage';
import autoresize from '../../directives/AutoResize';

require('../../assets/style/Pfolder/partnership-folder.css');

export default {
    name: 'Banners',
    components: {
        TextLengthMessage
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        currentSite() {
            return this.currentPartner && this.currentPartner.sites ? this.currentPartner.sites[0] : null;
        },
        currentBanner() {
            return this.currentSite && this.currentSite.banners ? this.currentSite.banners[0] : null;
        },
        leftContent: {
            get() {
                return this.getBannerOffset('leftContent')
            },
            set(val) {
                this.setBannerOffset('leftContent', val)
            },
        },
        centerContent: {
            get() {
                return this.getBannerOffset('centerContent')
            },
            set(val) {
                this.setBannerOffset('centerContent', val)
            },
        },
        rightContent: {
            get() {
                return this.getBannerOffset('rightContent')
            },
            set(val) {
                this.setBannerOffset('rightContent', val)
            },
        },
    },
    directives: {
        autoresize
    },
    props: ['verifyFields'],
    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        onFocus(event) {
            this.previousEditedValue = event.target.value;
        },
        onBlur(event, data) {
            let provider = this.$refs[event.target.name];
            if (data.banner && !data.banner.id) {
                data.banner.site = this.currentPartner.sites[0]['@id'];
            }
            this.updatePartnerPropertyFromForm({
                event: event,
                provider: provider[0] || provider,
                data: data ? Object.assign({ previousEditedValue: this.previousEditedValue }, data) : undefined
            });
            this.verifyFields();
        },
        getBannerOffset(offset) {
            return this.currentBanner ? this.currentBanner[offset] : null;
        },
        setBannerOffset(offset, value) {
            if (!this.currentSite) {
                this.currentPartner.sites = [{}];
            }
            if (!this.currentBanner) {
                this.currentPartner.sites[0].banners = [{}];
            }

            this.currentPartner.sites[0].banners[0][offset] = value;
        },
    }
}
</script>
