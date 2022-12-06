<template>
    <div class="demandes" @click="close_menu">
        <app-headerbuttons />
        <b-container fluid class="bv-example-row">
            <notifications group="no-tickets" position="bottom right" class="notification-container" />
            <b-col lg="12" md="12" sm="12" class="header-ticket">
                <b-row>
                    <app-menuprofile class="menu-asks hidden-for-mobile"></app-menuprofile>
                    <app-menumobile class="menu-mobile"></app-menumobile>
                    <b-col lg="9" md="12" sm="12" class="tickets-button">
                        <b-row>
                            <b-col md="1" sm="12">
                                <b-link href="/#/demandes/creer">
                                    <div class="create_ticket_button">Créer une demande</div>
                                </b-link>
                            </b-col>
                            <b-col offset-md="1" md="10" sm="12">
                                <b-row>
                                    <b-col md="2" sm="6" class="sort-tickets-new hidden-for-mobile">
                                        <b-link @click="displayNewTickets()">
                                            <div class="sort-tickets-text">Nouveau</div>
                                        </b-link>
                                    </b-col>
                                    <b-col md="2" sm="6" class="sort-tickets-opened hidden-for-mobile">
                                        <b-link @click="displayOpenedTickets()">
                                            <div class="sort-tickets-text">Ouvert</div>
                                        </b-link>
                                    </b-col>
                                    <b-col md="2" sm="6" class="sort-tickets-pending hidden-for-mobile">
                                        <b-link @click="displayPendingTickets();">
                                            <div class="sort-tickets-text">En attente retour</div>
                                        </b-link>
                                    </b-col>
                                    <b-col md="2" sm="6" class="sort-tickets-done hidden-for-mobile">
                                        <b-link @click="displayDoneTickets();">
                                            <div class="sort-tickets-text">Terminé</div>
                                        </b-link>
                                    </b-col>
                                    <b-col md="2" sm="6" class="sort-tickets-closed hidden-for-mobile">
                                        <b-link @click="displayClosedTickets();">
                                            <div class="sort-tickets-text">Fermé</div>
                                        </b-link>
                                    </b-col>
                                    <b-col md="2" sm="6" class="sort-tickets-all hidden-for-mobile">
                                        <b-link @click="displayAllTickets()">
                                            <div class="sort-tickets-text-black">Tous</div>
                                        </b-link>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row>
                            <fade-loader v-if="status.isSalesforceTicketsLoading || status.isSalesforceTicketThreadLoading" class="loader-demandes hidden-for-mobile" :color="color"></fade-loader>
                        </b-row>
                        <b-row>
                            <b-col sm="12" class="ticket-container" v-if="commentsInterface && !status.isSalesforceTicketsLoading && !status.isSalesforceTicketThreadLoading">
                                <b-row @click="commentsInterface = false">
                                    <b-col>
                                        <img src="../../assets/left-arrow.png" class="left-arrow"> <b class="left-arrow">Retour</b>
                                    </b-col>
                                </b-row>
                                <b-row class="ticket-style tickets-subject">
                                    <b-col>Sujet : {{ formatTicketName(currentTicket.subject) }} | {{ currentTicket.createdDate }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col class="line-break">{{ currentTicket.description }}</b-col>
                                </b-row>
                                <b-row class="ticket-style">
                                    <b-col v-for="(attachment, index) in currentTicket.attachments" cols="12" :key="`attachment-${index}`">
                                        <a :href="attachment.href" target="_blank">
                                            <img src="../../assets/attachment.png" :alt="attachment.text" class="ticket-attachment">
                                            {{ attachment.text }}
                                        </a>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col sm="12" class="ticket-container" v-if="!commentsInterface && !status.isSalesforceTicketsLoading && !status.isSalesforceTicketThreadLoading">
                                <div @click="load_salesforce_thread(ticket)" v-for="(ticket, index) in this.displayedTickets" :key="index" class="ticket-style main-subject">
                                    <b-row>
                                        <b-col lg="9" sm="7" cols="12" class="tickets-subject">
                                            Sujet : {{ formatTicketName(ticket.subject) }}
                                            <span class="ticket-date">{{ ticket.createdDate ? `(${ticket.createdDate})` : '' }}</span>
                                        </b-col>
                                        <b-col lg="3" sm="5" cols="12" class="tickets-status">
                                            <span v-bind:style="{ color: getStatusColor(ticket.status) }">{{ getStatusLabel(ticket.status) }}</span>
                                        </b-col>
                                    </b-row>
                                    <b-row v-if="ticket.description" class="mx-3 line-break">{{ ticket.description }}</b-row>
                                </div>
                                <div v-if="!this.displayedTickets.length" class="ticket-style main-subject">
                                    Aucun ticket à afficher.
                                </div>
                            </b-col>
                        </b-row>
                        <div v-if="displayedTickets.length <= 9" class="margin"></div>
                    </b-col>
                </b-row>
            </b-col>
        </b-container>
        <app-footer class="footer-auth" v-if="displayedTickets.length <= 5 && !commentsInterface && !status.isSalesforceTicketsLoading && !status.isSalesforceTicketThreadLoading"></app-footer>
        <app-footer v-if="(displayedTickets.length > 5 || commentsInterface) && !status.isSalesforceTicketsLoading && !status.isSalesforceTicketThreadLoading"></app-footer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MenuMobile from '@/components/MenuMobile.vue';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';

require('../../assets/style/ticket.css');

export default {
    name: 'TicketsList',
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
        ...mapState('globalStore', ['status', 'salesforceTickets'])
    },
    mounted: function () {
        let base_url = `/#/demandes/attachment/`
        let regex = new RegExp(`${base_url}`);
        this.getTickets({ accountId: this.currentPartner.company }).then(result => {
            result.map(ticket => {
                ticket.rawDescription = ticket.description;
                let descriptionWithoutAttachment = [],
                    attachments = [],
                    description = ticket.description ? ticket.description.split('\n') : [];
                description.forEach(line => {
                    if (regex.test(line)) {
                        let filepath = line.split('/');
                        attachments.push({
                            href: line,
                            text: filepath[filepath.length - 1]
                        });
                    } else {
                        descriptionWithoutAttachment.push(line);
                    }
                });
                ticket.attachments = attachments;
                ticket.description = descriptionWithoutAttachment.join('\n');
            });
            this.displayedTickets = result;
        });
    },
    data () {
        return {
            displayedTickets: [],
            color: '#ec008c',
            commentsInterface: false,
            currentTicket: {},
            currentUserId: '',
            ticketStatus: {
                'Nouveau': {
                    labels: ['Nouveau'],
                    color: '#007bff'
                },
                'Ouvert': {
                    labels: ['Ouvert', 'En pause', 'Escalade'],
                    color: '#faa61a'
                },
                'En attente retour': {
                    labels: ['En attente', 'Réponse Client'],
                    color: '#ec008c'
                },
                'Terminé': {
                    labels: ['Résolu'],
                    color: '#00cc99'
                },
                'Fermé': {
                    labels: ['Fermé'],
                    color: '#009933'
                },
            }
        };
    },
    methods: {
        ...mapActions('globalStore', ['getTickets']),
        close_menu: function () {
            MenuMobile.methods.closeNav();
        },
        load_salesforce_thread: function (currentTicket) {
            this.commentsInterface = true;
            this.currentTicket = currentTicket;
        },
        displayNewTickets: function () {
            this.displayedTickets = this.getTicketsByLabel('Nouveau');
        },
        displayOpenedTickets: function () {
            this.displayedTickets = this.getTicketsByLabel('Ouvert');
        },
        displayPendingTickets: function () {
            this.displayedTickets = this.getTicketsByLabel('En attente retour');
        },
        displayDoneTickets: function () {
            this.displayedTickets = this.getTicketsByLabel('Terminé')
        },
        displayClosedTickets: function () {
            this.displayedTickets = this.getTicketsByLabel('Fermé');
        },
        displayAllTickets: function () {
            this.displayedTickets = this.salesforceTickets;
        },
        getTicketsByLabel: function(statusLabel) {
            return this.salesforceTickets.filter(
                ticket => -1 !== this.ticketStatus[statusLabel].labels.indexOf(ticket.status)
            );
        },
        getStatusLabel: function (label) {
            let found;
            for (let key in this.ticketStatus) {
                found = this.ticketStatus[key].labels.find(item => item === label);
                if (found) {
                    return key;
                }
            }
        },
        getStatusColor: function (label) {
            let found;
            for (let key in this.ticketStatus) {
                found = this.ticketStatus[key].labels.find(item => item === label);
                if (found) {
                    return this.ticketStatus[key].color;
                }
            }
        },
        formatTicketName: function(name) {
            return this.currentPartner.customerCode
                ? name.replace(new RegExp(`^${this.currentPartner.customerCode} (- )?`), '')
                : name;
        }
    }
};
</script>
