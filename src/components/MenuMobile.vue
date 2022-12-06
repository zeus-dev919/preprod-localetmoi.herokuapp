<template>
    <div class="menu-mobile" @click.stop="">
        <div id="mySidenav" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" @click="closeNav()">&times;</a>
            <a>Menu</a>
            <hr>
            <a>Présence</a>
            <router-link to="/presence/site" class='card-text menu-mobile-text'>
                Site
            </router-link>
            <router-link to="/presence/qrcode" class='card-text menu-mobile-text' v-if="status.isQrcodeEnabled">
                QR Code
            </router-link>
            <a @click="getUberallAutologin({ page: 'profile' })" class="menu-mobile-text" v-if="partner.hasVisibility">
                Coordonnées de communication
            </a>
            <hr v-if="status.isToolbox">
            <a @click="getUberallAutologin({ page: 'inbox' })" v-if="status.isToolbox" class="uberall-link" v-bind:class="{'uberall-link-available': partner.hasVisibility}">
                Avis clients
            </a>
            <hr v-if="status.isToolbox">
            <a @click="getUberallAutologin({ page: 'posting' })" v-if="status.isToolbox" class="uberall-link" v-bind:class="{'uberall-link-available': partner.hasVisibility}">
                Publications
            </a>
            <div v-if="!status.isEcommerce">
                <a>Performance</a>
                <router-link to="/performance/audience" class='card-text menu-mobile-text'>
                    Statistiques de mon site web
                </router-link>
                <router-link to="/performance/localBroadcast" class='card-text menu-mobile-text' v-if="uberall.listingsLength">
                    Diffusion locale
                </router-link>
                <div v-if="status.isWebtool">
                    <router-link to="/performance/messages" class='card-text menu-mobile-text'>
                        Messages
                    </router-link>
                    <router-link to="/performance/newsletter" class='card-text menu-mobile-text'>
                        Newsletter
                    </router-link>
                    <hr>
                </div>
            </div>
            <div v-if="status.isLocalShop">
                <a>Performance</a>
                <router-link to="/performance/audience" class='card-text menu-mobile-text'>
                    Statistiques de mon site web
                </router-link>
                <router-link to="/performance/localBroadcast" class='card-text menu-mobile-text' v-if="uberall.listingsLength">
                    Diffusion locale
                </router-link>
                <div v-if="status.isWebtool">
                    <router-link to="/performance/messages" class='card-text menu-mobile-text'>
                        Messages
                    </router-link>
                    <router-link to="/performance/newsletter" class='card-text menu-mobile-text'>
                        Newsletter
                    </router-link>
                    <hr>
                </div>
            </div>
            <a>Compte partenaire</a>
            <router-link to="/profil" class='card-text menu-mobile-text'>
                Mon profil
            </router-link>
            <router-link to="/documents" class='card-text menu-mobile-text'>
                Mes documents
            </router-link>
            <router-link to="/dossier-partenaire" class='card-text menu-mobile-text' v-if="allowPartnerFolderAccess">
                Mon dossier partenaire
            </router-link>
            <router-link to="/demandes" class='card-text menu-mobile-text'>
                Mes demandes
            </router-link>
            <router-link to="/aide/presentation" class='card-text menu-mobile-text'>
                Découvrir Local&Moi
            </router-link>
        </div>
        <span style="font-size:30px;cursor:pointer" @click="openNav()">&#9776; Menu</span>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { authDpHelper } from "../_helpers/auth-dp.helper";

require('../assets/style/accueil.css');
require('../assets/style/menu-mobile.css');

export default {
    app: 'MenuMobile',
    computed: {
        ...mapState('globalStore', ['partner', 'status', 'salesforce', 'uberall']),
        ...mapState('account', ['currentPartner']),
        allowPartnerFolderAccess() {
            return this.currentPartner
                && this.currentPartner.hasPartnerFolder
                && this.salesforce.dpValidated.canEdit
        },
    },
    methods: {
        ...mapActions('globalStore', ['getUberallAutologin']),
        openNav: function () {
            if (document.getElementById('mySidenav')) {
                document.getElementById('mySidenav').style.width = '250px';
            }
        },
        closeNav: function () {
            if (document.getElementById('mySidenav')) {
                document.getElementById('mySidenav').style.width = '0';
            }
        }
    }
};
</script>
