<template>
    <b-col lg="3" md="12" sm="12">
        <div role="tablist">
            <b-card no-body class="mb-1">
                <b-btn block v-b-toggle.accordion-left variant="info" class="menu-left-title" v-bind:class="{ 'current-section': current_section }">Mon compte partenaire</b-btn>
                <b-collapse visible id="accordion-left" accordion="my-accordion-left" role="tabpanel">
                    <b-card-body>
                        <router-link to="/profil" class='card-text'>
                            Mes coordonnées de facturation
                        </router-link>
                            <hr>
                            <router-link to="/documents" class='card-text'>
                                Mes documents
                            </router-link>
                            <hr v-if="currentPartner && currentPartner.hasPartnerFolder && salesforce.dpValidated.canEdit">
                            <router-link to="/dossier-partenaire" class='card-text' v-if="currentPartner && currentPartner.hasPartnerFolder && salesforce.dpValidated.canEdit">
								<span>
									Mon dossier partenaire
								</span>
                            </router-link>
                    </b-card-body>
                </b-collapse>
            </b-card>
        </div>
    </b-col>
</template>

<script>

import {mapState} from "vuex";

require('../assets/style/authentification.css');

export default {
    app: 'MenuProfile',
    mounted: function () {
        this.read_current_menu();
    },
	computed: {
        ...mapState('account', ['currentPartner', 'identity', 'status']),
        ...mapState('globalStore', ['salesforce'])
	},
    data () {
        return {
            current_section: false,
        };
    },
    methods: {
        read_current_menu: function () {
            if (this.$route.path.includes('profil')) {
                this.current_section = true;
            } else if (this.$route.path.includes('documents')) {
                this.current_section = true;
            } else if (this.$route.path.includes('demandes')) {
                this.current_section = true;
            } else if (this.$route.path.includes('dossier-partenaire')) {
                this.current_section = true;
            }
        }
    }
};
</script>
