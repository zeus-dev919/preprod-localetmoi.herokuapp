<template>
    <div class="messages">
        <app-headerbuttons></app-headerbuttons>
        <b-container fluid class="bv-example-row">
            <notifications group="no-ticket" position="bottom right" class="notification-container" />
            <b-row>
                <app-menuformation class='hidden-for-mobile margin-menu'></app-menuformation>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <b-col lg="9" class="messages-section">
                    <b-form-select v-if="myWebsitesNames.length > 1" :disabled="pageLoading" @change="getMessagesList()" v-model="currentWebsite" :options="myWebsitesNames" class="mb-3 site-selector"></b-form-select>
                    <fade-loader v-if="pageLoading" class="loader-site hidden-for-mobile" :color="color"></fade-loader>
                    <div v-if="!pageLoading" v-for="message in messagesList" class="message-container" :key="message.id">
                        <b-row>
                            <b-col lg="8" md="8" sm="12" class="tickets-subject">Message de
                                {{ message.content ? message.content['Email'] + ' - ' : '' }}{{ usToFrDate(message.createdAt.date) }}
                                <img v-if="message.nbAttachments == 1" class="logo-attachment" src="../assets/attachment.png" v-b-tooltip.hover v-bind:title="message.nbAttachments + ' pièce jointe'" />
                                <img v-if="message.nbAttachments > 1" class="logo-attachment" src="../assets/attachment.png" v-b-tooltip.hover v-bind:title="message.nbAttachments + ' pièces jointes'" />
                            </b-col>
                        </b-row>
                        <b-row >
                            <b-col cols="12" v-for="(index, content) in message.content" :key="content" v-if="message.content[content]">
                                <b>{{ content }}</b> :
                                <read-more v-if="message.content[content].length > 200" class="" more-str="Voir plus" :text="message.content[content]" less-str="Masquer" :max-chars="280"></read-more>
                                <p v-else>{{ message.content[content] }}</p>
                            </b-col>
                            <b-col cols="12" v-if="message.nbAttachments > 0">
                                <div class="attachment-title"><strong>Pièces jointes :</strong></div>
                                <a v-for="attachment in message.attachments" :key="attachment.id" class="attachment" :href="attachment.href">{{ attachment.label }}</a>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-if="messagesList.length < 4" class="margin-msg"></div>
                </b-col>
            </b-row>
        </b-container>
        <app-footer v-bind:class="{ 'footer-auth': messagesList.length < 4 }"></app-footer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { dateHelpers } from "@/_helpers";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';

require('../assets/style/messages.css');

export default {
    name: 'Messages',
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('globalStore', ['websiteLink']),
        ...mapState('account', ['user'])
    },
    mounted: function () {
        new Promise(resolve => {
            let interval = setInterval(() => {
                if (!this.websiteLink) {
                    return;
                }
                window.clearInterval(interval);
                resolve(this.getMessagesList());
            }, 50);
        })
    },
    data () {
        return {
            messagesList: [],
            nbrMsg: 0,
            myWebsitesNames: [],
            currentWebsite: null,
            messages: [],
            cnt: null,
            pageLoading: true,
            color: '#ec008c'
        };
    },
    methods: {
        ...mapActions('globalStore', ['getContactMessages']),
        usToFrDate(messageDate) {
            return dateHelpers.usToFrDate(messageDate)
        },
        getMessagesList: function () {
            this.pageLoading = true;
            return this.getContactMessages().then(response => {
                const siteNames = Object.keys(response);
                if (0 === siteNames.length) {
                    this.pageLoading = false;
                    this.$notify({
                        group: 'no-ticket',
                        title: 'Pas de message',
                        type: 'warn',
                        duration: 6000,
                        text: 'Vous n\'avez aucun message.'
                    });
                    return 0;
                }
                const currentWebsite = this.websiteLink.replace(/https?:\/\//, '').replace('/', '');
                this.messagesList = [];
                this.myWebsitesNames = [];
                for (let site in response) {
                    this.myWebsitesNames.push(site);
                }
                if (!this.currentWebsite) {
                    this.currentWebsite = currentWebsite || this.myWebsitesNames[0];
                }
                this.messagesList = response[this.currentWebsite];
                if (this.messagesList.length > 0) {
                    this.messagesList.forEach((message) => {
                        let attachments = message.attachments;
                        
                        message.nbAttachments = attachments.length;
                        if (!message.nbAttachments) {
                            return;
                        }
                        
                        attachments.forEach(attachment => {
                            attachment.href = process.env.WEBTOOL_BASE_URL +
                                '/oauth/messages/' + message.id +
                                '/attachments/' + attachment.filename +
                                '?bearer=' + this.user.access_token;
                        });
                    })
                } else {
                    this.$notify({
                        group: 'no-ticket',
                        title: 'Pas de message',
                        type: 'warn',
                        duration: 6000,
                        text: 'Vous n\'avez aucun message.'
                    });
                }

                return this.messagesList;
            }).finally(() => this.pageLoading = false);
        },
    }
};
</script>
