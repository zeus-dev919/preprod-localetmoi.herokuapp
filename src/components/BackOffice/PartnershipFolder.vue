<template>
    <div class="accueil" id="full-page">
        <app-headergeneral />
        <b-container fluid class="d-lg-flex d-md-flex">
            <div class="ml-lg-auto ml-md-auto d-lg-flex-column d-md-flex-column">
                <div>
                    <b>Référence de votre dossier :</b> {{ customerCode ? customerCode : 'Non renseigné' }}
                </div>
                <div>
                    <b>Utilisateur :</b> {{ userEmail ? userEmail : 'Non renseigné' }}
                </div>
            
                <div>
                    <b>Site :</b>
                    <a v-if="null !== websiteLink && !status.isPageLoading" v-bind:href="websiteLink" target="_blank" style="color: #EC008C !important;">
                        www.{{ websiteLink.replace(/https?:\/\//, '').replace('/', '') }}
                    </a>
                    <a v-if="null === websiteLink">
                        Aucun site
                    </a>
                </div>
            </div>
        </b-container>
        <b-container fluid>
            <b-row class="py-5">
                <b-col>
                    <fade-loader v-if="isPageLoading" color="#ec008c" class="loader-accueil"></fade-loader>
                    <PartnershipForm v-if="!isPageLoading && displayPartnerFolder" />
                    <div v-if="!isPageLoading && !displayPartnerFolder">
                        Aucune donnée à afficher.
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>

import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import PartnershipForm from '@/components/PartnershipFolder/PartnershipForm';
import partnerMixin from '../../mixins/partner-mixin';

export default {
    name: 'BackOfficePartnershipFolder',
    mixins: [partnerMixin],
    components: {
        FadeLoader,
        PartnershipForm
    }
};

</script>
