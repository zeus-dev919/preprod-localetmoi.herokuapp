<template>
    <div :class="`list partner-folder-container ${deniedAccessClass}`">
        <notifications group="general-error" position="bottom right" class="notification-container"/>
      <fade-loader :color="'#ec008c'" class="loader-Pf" v-if="status.isRetrievingUpdatedPf && isCurrentMainUserOnPf"></fade-loader>

      <b-row class="justify-content-space-between">
            <b-col sm="12" md="6" :lg="!status.isGetRecentFolderLoading && canViewPartnerFolder() ? 6 : 9">
                <h3 class="partner-folder-title">
                    Offre souscrite : <strong>{{ offerName }}</strong>
                </h3>
            </b-col>
            <b-col class="text-right" sm="12" md="6" lg="6" v-if="!status.isGetRecentFolderLoading && canViewPartnerFolder()">
                <router-link :to="`/espace-partage/${currentPartner.customerCode}`" class="upload-files">
                    <img src="../../assets/upload-cloud.svg"/>
                    <span>Transmettre les documents du partenaire</span>
                    <div v-if="!filesCount && filesCountLoading" class="files-counter custom-tooltip" v-b-tooltip.hover title="Nombre de documents transmis (calcul en cours...)">
                        <i class="fas fa-fan"></i>
                    </div>
                    <div v-else class="files-counter custom-tooltip" :class="{'valid-files-count': filesCount > 0}" v-b-tooltip.hover title="Nombre de documents transmis">
                        {{ filesCount }}
                    </div>
                </router-link>
            </b-col>
        </b-row>
        <b-row v-show="currentOffer && !status.isGetRecentFolderLoading">
            <b-col>
                <h6>RDV de brief souhaité par le partenaire :
                    <span :class="{'empty-value': !allowBrief, 'filled': /oui/i.test(allowBrief), 'no-brief': /non/i.test(allowBrief)}">
                        {{ allowBrief || 'non renseigné' }}
                    </span>
                    <span v-if="briefDate" class="filled">
                        ({{ briefDate }})
                    </span>
                </h6>
                <h6>Statut du RDV :
                    <span :class="{'empty-value': !brief.callResult, 'filled': brief.callResult}">
                        {{ brief.callResult || 'non renseigné' }}
                    </span>
                </h6>
                <h6 v-if="!isUser">Attribué à :
                    <span :class="{'empty-value': !brief.ownerName, 'filled': brief.ownerName}">
                        {{ brief.ownerName || 'non renseigné' }}
                    </span>
                </h6>
                <h6>Secteur d'activité :
                    <span class="filled">
                        {{ salesforce.account.Industry }}
                    </span>
                </h6>
            </b-col>
        </b-row>
        <b-row v-if="canSendReportAboutPartnerFolder()">
            <b-col class="report-modal-form">
                <button v-b-modal.modal-report v-if="status.reportHasBeenSent" class="btn-report-sended">
                    Signalement effectué <i class="fas fa-check"></i>
                </button>
                <button v-b-modal.modal-report v-else class="btn-report-sendable">
                    <i class="fas fa-exclamation-triangle"></i>
                    <br />Signaler
                </button>
                <ReportModal v-if="salesforce.opportunity"/>
            </b-col>
        </b-row>
      <!-- DEFAULT -->
        <b-card no-body class="mb-2" id="company-form">
            <b-button block v-b-toggle.accordion-company-form variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                <span>
                    INFORMATIONS SUR L'ENTREPRISE
                </span>
                <span class="pl-2 account-name" v-if="salesforce.account.Name">
                    {{ salesforce.account.Name }}
                </span>
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-company-form" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <b-tabs id="company_nav" justified>
                        <b-tab class="company-form-nav" no-body title="Votre entreprise" active>
                            <CompanyForm/>
                        </b-tab>
                        <b-tab class="company-profile-nav" no-body title="Pour mieux vous connaître">
                            <CompanyProfile/>
                        </b-tab>
                        <b-tab class="company-objectives-nav" no-body title="Vos objectifs">
                            <CompanyObjectives/>
                        </b-tab>
                        <b-tab class="company-communication-nav" no-body title="Votre communication">
                            <CompanyCommunication/>
                        </b-tab>
                    </b-tabs>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="display-informations" v-if="!isSeoOffer">
            <b-button block v-b-toggle.accordion-display-information variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                COORDONNÉES À AFFICHER / MASQUER SUR LE SITE
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-display-information" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <DisplayInformations/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="seo-informations" v-if="!isSeoOffer || status.hasAdwordsCampaign">
            <b-button block v-b-toggle.accordion-seo-information variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                RÉFÉRENCEMENT
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-seo-information" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <SeoInformations/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="wording" v-if="!isSeoOffer">
            <b-button block v-b-toggle.accordion-wording-information variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                RÉDACTIONNEL
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-wording-information" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <Wording/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="url">
            <b-button block v-b-toggle.accordion-url variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                URL
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-url" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <Url/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="site-tree" v-if="!isSeoOffer">
            <b-button block v-b-toggle.accordion-site-tree variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                ARBORESCENCE
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-site-tree" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <SiteTree/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- OPTIONS IF ALREADY HAVE LOGO -->
        <b-card no-body class="mb-2" id="existing-logo" v-if="!isSeoOffer && !status.hasLogoCreation">
            <b-button block v-b-toggle.accordion-existing-logo variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                LOGO
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-existing-logo" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <ExistingLogo/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- OPTIONS IF WANT TO HAVE LOGO  -->
        <b-card no-body class="mb-2" id="logo" v-if="!isSeoOffer && (status.hasLogoCreation || (Cr_ation_logo__c && 'Non' === hasLogo && !isMiniOffer))">
            <b-button block v-b-toggle.accordion-logo variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                BRIEF LOGO
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-logo" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <Logo/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="website-conception" v-if="!isSeoOffer">
            <b-button block v-b-toggle.accordion-website-conception variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                CONCEPTION DU SITE
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-website-conception" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <WebsiteConception/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- AUTO/IMMO | AUTO/IMMO + | BOUTIQUE | HOTEL/RESTO-->
        <b-card no-body class="mb-2" id="website-template" v-if="status.isToolbox && !status.isLocalResto && !status.isLocalRestoBoutique">
            <b-button block v-b-toggle.accordion-website-template variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                MODÈLE DE SITE
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-website-template" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <WebsiteTemplate/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- OPTIONS -->
        <b-card no-body class="mb-2" id="adword-campaign-custom" v-if="status.isLocalBoost || status.hasAdwordsCampaign">
            <b-button block v-b-toggle.accordion-adword-campain-custom variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                CAMPAGNE GOOGLE ADS
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-adword-campain-custom" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <AdwordCampaignCustom/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- OPTIONS -->
        <b-card no-body class="mb-2" id="report" v-if="status.hasPhotosReport10 || status.hasPhotosReport20 || status.hasVirtualVisit || status.hasPhotosVideoReport10">
            <b-button block v-b-toggle.accordion-report variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                REPORTAGES
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-report" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <Report/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- HOTEL/RESTO -->
        <b-card no-body class="mb-2" id="book-engine" v-if="status.isLocalHotel || (status.isLocalResto && !isLocalRestoWebtoolOffer)">
            <b-button block v-b-toggle.accordion-book-engine variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                MOTEUR DE RÉSERVATION
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-book-engine" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <BookEngine/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- HOTEL/RESTO -->
        <b-card no-body class="mb-2" id="tourist-informations" v-if="status.isLocalHotel || (status.isLocalResto && !isLocalRestoWebtoolOffer) ">
            <b-button block v-b-toggle.accordion-tourist-information variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                INFORMATIONS TOURISTIQUES
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-tourist-information" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <TouristInformations/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- BOUTIQUE  -->
        <!-- Table booking -->
        <b-card no-body class="mb-2" id="table-booking" v-if="!isUser && isLocalRestoWebtoolOffer">
            <b-button block v-b-toggle.accordion-table-booking variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                MODULE DE R&Eacute;SERVATION DE TABLE
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-table-booking" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <TableBooking />
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="payment-method-and-delivery" v-if="status.isLocalBoutique">
            <b-button block v-b-toggle.accordion-payment-method-and-delivery variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                <span v-html="isClickAndCollectOffer ? 'CLICK<strong>&</strong>COLLECT' : 'MOYENS DE PAIEMENT ET LIVRAISON'"></span>
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-payment-method-and-delivery" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <PaymentMethodAndDelivery/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="qr-code-section" v-if="isLocalRestoWebtoolOffer">
            <b-button block v-b-toggle.accordion-qr-code-section variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                <span v-html="'QR CODE'"></span>
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-qr-code-section" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <QrCodeSection />
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- LOCALSHOP -->
        <b-card no-body class="mb-2" id="categories" v-if="status.isLocalShop">
            <b-button block v-b-toggle.accordion-categories variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                CATÉGORIES ET SOUS CATÉGORIES
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-categories" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <Categories/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- LOCALSHOP / BOUTIQUE  -->
        <b-card no-body class="mb-2" id="product" v-if="false">
            <b-button block v-b-toggle.accordion-product variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                PRODUITS
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-product" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <Product/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- AUTO/IMMO -->
        <b-card no-body class="mb-2" id="business-software" v-if="status.isLocalAuto || status.isLocalImmo || status.isLocalAutoPlus || status.isLocalImmoPlus">
            <b-button block v-b-toggle.accordion-business-software variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                LOGICIEL MÉTIER
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-business-software" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <BusinessSoftware/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- AUTO/IMMO + -->
        <b-card no-body class="mb-2" id="multicast" v-if="status.isLocalAutoPlus || status.isLocalImmoPlus">
            <b-button block v-b-toggle.accordion-multi-cast variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                MULTI-DIFFUSION
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-multi-cast" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <Multicast/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- LOCALSHOP -->
        <b-card no-body class="mb-2" id="slide-show" v-if="status.isLocalShop">
            <b-button block v-b-toggle.accordion-slide-show variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                DIAPORAMA
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-slide-show" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <SlideShow/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="content-authoring" v-if="status.isLocalShop">
            <b-button block v-b-toggle.accordion-content-authoring variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                RÉDACTION DES CONTENUS
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-content-authoring" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <ContentAuthoring/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <b-card no-body class="mb-2" id="shop-payment-delivery" v-if="status.isLocalShop">
            <b-button block v-b-toggle.accordion-shop-payment-delivery variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                MOYENS DE PAIEMENTS ET DE LIVRAISON
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-shop-payment-delivery" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <ShopPaymentDelivery/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- LOCALSHOP + MIGRATION -->
        <b-card no-body class="mb-2" id="migration" v-if="status.isLocalShopWithMigration">
            <b-button block v-b-toggle.accordion-migration variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                MIGRATION
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-migration" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <Migration/>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- LOCALSHOP -->
        <b-card no-body class="mb-2" id="site-comments" v-if="status.isLocalShop">
            <b-button block v-b-toggle.accordion-site-comments variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                COMMENTAIRES SUR LE SITE
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-site-comments" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <SiteComments />
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- LOCALAGENDA -->
        <b-card no-body class="mb-2" id="agenda-introduction" v-if="status.isLocalAgenda && salesforce.agenda.online">
            <b-button block v-b-toggle.accordion-agenda variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                AGENDA EN LIGNE
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-agenda" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <AgendaIntroduction/>
                    <b-tabs id="agenda_nav" justified>
                        <b-tab class="time-ranges-nav" no-body title="Horaires" active>
                            <AgendaTimeRanges/>
                        </b-tab>
                        <b-tab class="team-tree-nav" no-body title="Équipe">
                            <AgendaTeamTree/>
                        </b-tab>
                        <b-tab class="service-tree-nav" no-body title="Services et ressources">
                            <AgendaServicesTree/>
                        </b-tab>
                        <b-tab class="appointment-nav" no-body title="RDV">
                            <AgendaAppointment/>
                        </b-tab>
                        <b-tab class="notification-nav" no-body title="Notifications">
                            <AgendaNotification/>
                        </b-tab>
                        <b-tab class="crm-nav" no-body title="CRM" v-if="salesforce.agenda.crm">
                            <AgendaCrm/>
                        </b-tab>
                        <b-tab class="visio-nav" no-body title="Visio" v-if="salesforce.agenda.visio">
                            <AgendaVisio/>
                        </b-tab>
                    </b-tabs>
                </b-card-body>
            </b-collapse>
        </b-card>
        <!-- Internal Notes -->
        <b-card no-body class="mb-2" id="internal-notes" v-if="!isUser">
            <b-button block v-b-toggle.accordion-internal-notes variant="dp-section">
                <i class="fas fa-exclamation-triangle"></i>
                NOTES POUR LA PRODUCTION
                <i class="fas fa-chevron-down" v-bind:class="{custom: !identity.allowedToEdit}"></i>
            </b-button>
            <b-collapse id="accordion-internal-notes" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <InternalNotes />
                </b-card-body>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import AgendaAppointment from "./Agenda/AgendaAppointment";
import AgendaCrm from "./Agenda/AgendaCrm";
import AgendaIntroduction from "./Agenda/AgendaIntroduction";
import AgendaNotification from "./Agenda/AgendaNotification";
import AgendaServicesTree from "./Agenda/AgendaServicesTree";
import AgendaTeamTree from "./Agenda/AgendaTeamTree";
import AgendaTimeRanges from "./Agenda/AgendaTimeRanges";
import AgendaVisio from "./Agenda/AgendaVisio";
import AdwordCampaignCustom from './AdwordCampaignCustom';
import BookEngine from './BookEngine';
import BusinessSoftware from './BusinessSoftware';
import Categories from './Categories';
import CompanyCommunication from "./Company/CompanyCommunication";
import CompanyForm from './Company/CompanyForm';
import CompanyObjectives from "./Company/CompanyObjectives";
import CompanyProfile from "./Company/CompanyProfile";
import ContentAuthoring from './ContentAuthoring';
import DisplayInformations from './DisplayInformations';
import ExistingLogo from "./ExistingLogo";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import Logo from './Logo';
import Migration from './Migration';
import Multicast from './MultiCast';
import SiteComments from './SiteComments';
import InternalNotes from './InternalNotes';
import PaymentMethodAndDelivery from './PaymentMethodAndDelivery';
import Product from './Product';
import Report from './Report';
import SeoInformations from './SeoInformations';
import ShopPaymentDelivery from './ShopPaymentDelivery';
import SiteTree from './SiteTree';
import SlideShow from './SlideShow';
import TouristInformations from './TouristInformations';
import Url from './Url';
import WebsiteConception from './WebsiteConception';
import WebsiteTemplate from './WebsiteTemplate';
import Wording from './Wording';
import { mapActions, mapMutations, mapState } from 'vuex';
import { authDpHelper, readyState, dropboxHelper, dateHelpers } from '@/_helpers';
import { store } from '@/_store';
import { salesforceService, dropboxService, userService, socketService } from '@/_services';
import ReportModal from './ReportModal';
import TableBooking from './TableBooking';
import QrCodeSection from './QrCodeSection';

export default {
    name: 'PartnershipForm',
    components: {
        AdwordCampaignCustom,
        AgendaAppointment,
        AgendaCrm,
        AgendaIntroduction,
        AgendaNotification,
        AgendaServicesTree,
        AgendaTeamTree,
        AgendaTimeRanges,
        AgendaVisio,
        BookEngine,
        BusinessSoftware,
        Categories,
        CompanyCommunication,
        CompanyForm,
        CompanyObjectives,
        CompanyProfile,
        ContentAuthoring,
        DisplayInformations,
        ExistingLogo,
        FadeLoader,
        InternalNotes,
        Logo,
        Migration,
        Multicast,
        PaymentMethodAndDelivery,
        Product,
        Report,
        ReportModal,
        SeoInformations,
        ShopPaymentDelivery,
        SiteComments,
        SiteTree,
        SlideShow,
        TableBooking,
        TouristInformations,
        Url,
        WebsiteConception,
        WebsiteTemplate,
        Wording,
        QrCodeSection
    },
    computed: {
        ...mapState({
            identity: state => state.account.identity,
            currentPartner: state => state.account.currentPartner,
            salesforceUser: state => state.account.salesforceUser,
            accountStatus: state => state.account.status,
            isCurrentMainUserOnPf: state => state.account.isCurrentMainUserOnPf
        }),
        ...mapState('globalStore', ['salesforce', 'offers', 'status', 'partner']),
        offerName() {
            let currentOffer = this.findCurrentOffer();
            return currentOffer ? currentOffer.name : '';
        },
        currentOffer() {
            return this.findCurrentOffer();
        },
        briefDate() {
            return dateHelpers.formatSFBriefDate(this.salesforce.brief.date);
        },
        brief() {
            return this.salesforce.brief || {};
        },
        allowBrief() {
            return this.salesforce.opportunity && this.salesforce.opportunity.Deviseur_Souhaite_un_RDV_Brief__c
                ? this.salesforce.opportunity.Deviseur_Souhaite_un_RDV_Brief__c
                : null;
        },
        isSeoOffer() {
            return this.status.isLocalPresence || (this.status.isLocalBoost && !this.partner.hasVisibility);
        },
        isMiniOffer() {
            return this.status.isLocalWeb || this.status.isLocalStart;
        },
        isUser() {
            return authDpHelper.isUser(this.identity);
        },
        currentUserStatus() {
            return authDpHelper.getUserStatus(this.salesforceUser);
        },
        deniedAccessClass() {
            return this.identity && this.identity.allowedToEdit && this.accountStatus && !this.accountStatus.isStopEditing ? '' : 'input-edition-disabled';
        },
        Cr_ation_logo__c() {
            return this.salesforce.opportunity.Cr_ation_logo__c;
        },
        hasLogo() {
            return this.currentPartner &&
                this.currentPartner.sites &&
                this.currentPartner.sites[0] ?
                this.currentPartner.sites[0].hasLogo : null;
        },
        isLocalRestoWebtoolOffer() {
            return this.status.isLocalRestoBoutique || this.status.isLocalRestoWebtool;
        },
        isClickAndCollectOffer() {
            return this.status.isLocalRestoBoutique || this.status.isNewLocalBoutique;
        }
    },
    data() {
        return {
            color: '#ffa300',
            filesCount: 0,
            filesCountLoading: false,
            isAllowedToTransmitDp: false,
            previousPartnerHistory: null,
            previousPartnerHistoryStep: null,
            currentPartnerHistory: null,
            currentPartnerHistoryStep: null,
            nextPartnerHistory: null,
            nextPartnerHistoryStep: null,
            currentUserStep: null,
        }
    },
    async mounted() {
        this.filesCountLoading = true;
        const currentPartner = await readyState.getCurrentPartnerState();
        const salesforce = await readyState.getSalesforceState();
        await this.checkPartnerFolderAccess().then(allowedToEdit => {
            if (!this.isUser && allowedToEdit) {
                const customerCode = this.currentPartner.customerCode;
                const identity = this.identity;
                socketService.setupSocketConnection({ customerCode: customerCode, identity: identity });
            }
        });
        const customerCode = currentPartner.customerCode;
        const companyName = salesforce.account.Name;
        if (false === this.status.hasMostRecentFolder) {
            await dropboxHelper.getMostRecentFolder(customerCode, companyName);
        }
        dropboxService.getFolder(customerCode, companyName)
            .then(folders => Promise.all(folders.map(folder => {
                if (/(nouveaux\s)?[eé]l[eé]ments\s(du\s)?\d{2}/i.test(folder.name)) {
                    return dropboxService.getFolder(customerCode, companyName, folder.name)
                        .then(files => this.filesCount += files.length || 0);
                }
                return Promise.resolve(0);
            })))
            .finally(() => this.filesCountLoading = false);
    },
    beforeDestroy () {
        const customerCode = this.currentPartner.customerCode;
        const identityId = this.identity.id;
        userService.disconnectUserFromSocket(customerCode, identityId);
    },


    methods: {
        ...mapActions('account', ['updatePartnerPropertyFromForm']),
        ...mapActions('globalStore', ['setIsRetrievingUpdatedPf']),
        findCurrentOffer() {
            return salesforceService.findCurrentOffer();
        },
        async checkPartnerFolderAccess() {
            return new Promise((resolve, reject) => {
                let interval = window.setInterval(() => {

                    if ('null' === this.salesforce.dpValidated.canEdit || !this.accountStatus) {
                        return;
                    }
                    window.clearInterval(interval);

                    this.identity.allowedToEdit =
                        authDpHelper.hasRoleToEditPartnerFolder(this.identity) &&
                        this.salesforce.dpValidated.canEdit &&
                        (!!authDpHelper.canTransmitPf() || authDpHelper.canByPassRolesToUpdatePf()) &&
                        !this.accountStatus.isStopEditing;
                    if (authDpHelper.isSalesman(this.identity) && !this.identity.allowedToEdit) {
                        const dateLabel = this.salesforce.dpValidated.validatedDpDate
                            ? ` depuis le ${this.salesforce.dpValidated.validatedDpDate}`
                            : '';
                        store.dispatch('alert/warn', {
                            group: 'general-error',
                            type: 'warn',
                            message: `Ce dossier partenaire est validé${dateLabel}. Vous ne pouvez plus l'éditer.`,
                            show: true,
                            title: 'Dossier partenaire'
                        });
                    }

                    resolve(this.identity.allowedToEdit);
                }, 50);
            });
        },
        canViewPartnerFolder() {
            return authDpHelper.isSuperAdmin(this.identity) ||
                (authDpHelper.isSalesman(this.identity) && this.status.hasSharedSpaceAccess)
        },
        canSendReportAboutPartnerFolder() {
            return authDpHelper.isSuperAdmin(this.identity);
        },
    }
};
</script>
