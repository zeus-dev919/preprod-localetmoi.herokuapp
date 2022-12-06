<template>
    <footer class="footer">
        <b-container fluid class="bv-example-row">
            <vue-cookie-accept-decline v-if="!this.$route.path.includes('authentification') && false === fromSF" :position="'bottom'" :type="'bar'" :disableDecline="true" :transitionName="'slideFromBottom'" :showPostponeButton="true" :elementId="'element'">
                <div slot="postponeContent">&times;</div>
                <div slot="message" class="cookie-message">
                    Ce site utilise des cookies pour vous offrir le meilleur service. En poursuivant votre navigation, vous acceptez l'utilisation des cookies.<a href="/#/Cgu"> En savoir plus</a>
                </div>
                <div slot="acceptContent">
                    J'accepte
                </div>
            </vue-cookie-accept-decline>
            <b-row>
                <b-col class="footer-text" md="5" sm="12">
                    <a target="_blank" href="https://www.etre-visible.local.fr/">
                        <img class="logo-black-background" src="../assets/logo-fond-noir.png">
                    </a>
                </b-col>
                <b-col md="3" sm="12">
                    <b-row>
                        <b-col class="footer-text border-footer" md="6" sm="6">
                            <b-row class="mb-3">
                                <b-col sm="12">
                                    <a class="footer-text" href="https://www.etre-visible.local.fr/creation-de-site"
                                       target="_blank">
                                        Créer son site internet
                                    </a>
                                </b-col>
                            </b-row>
                            <b-row class="mb-3">
                                <b-col sm="12">
                                    <a class="footer-text" href="https://www.etre-visible.local.fr/referencement-google"
                                       target="_blank">
                                        Booster sa visibilité
                                    </a>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col class="footer-text border-footer" md="6" sm="6">
                            <b-row class="mb-3">
                                <b-col sm="12">
                                    <a class="footer-text" href="https://www.etre-visible.local.fr/relation-client"
                                       target="_blank">
                                        Gérer sa clientèle
                                    </a>
                                </b-col>
                            </b-row>
                            <b-row class="mb-3">
                                <b-col sm="12">
                                    <router-link to='/cgu' class="footer-text">
                                        Mentions légales
                                    </router-link>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col class="footer-text follow-us" md="4" sm="12">
                    Suivez-nous
                    <b-row class="pr-4">
                        <b-col lg="2" md="2" sm="2" cols="2" class="text-center">
                            <a target="_blank" href="https://www.facebook.com/local.fr/">
                                <img class="follow-us-img" src="../assets/facebook.png">
                            </a>
                        </b-col>
                        <b-col lg="2" md="2" sm="2" cols="2" class="text-center">
                            <a target="_blank" href="https://twitter.com/local_fr?lang=fr">
                                <img class="follow-us-img" src="../assets/twitter.png">
                            </a>
                        </b-col>
                        <b-col lg="2" md="2" sm="2" cols="2" class="text-center">
                            <a target="_blank" href="https://communiquer-digital-et-local.fr/">
                                <img class="follow-us-img" src="../assets/blog.png">
                            </a>
                        </b-col>
                        <b-col lg="2" md="2" sm="2" cols="2" class="text-center">
                            <a target="_blank" href="https://www.youtube.com/channel/UCweZjT9wEJyBr0OwlLbKejQ">
                                <img class="follow-us-img" src="../assets/youtube.png">
                            </a>
                        </b-col>
                        <b-col lg="2" md="2" sm="2" cols="2" class="text-center">
                            <a target="_blank" href="https://www.instagram.com/local.fr/">
                                <img class="follow-us-img" src="../assets/instagram.png">
                            </a>
                        </b-col>
                        <b-col lg="2" md="2" sm="2" cols="2" class="text-center">
                            <a target="_blank" href="https://www.linkedin.com/company/local.fr/">
                                <img class="follow-us-img" src="../assets/linkedin.png">
                            </a>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </footer>
</template>

<script>

export default {
    app: 'Footer',
    data () {
        return {
            fromSF: JSON.parse(localStorage.getItem('fromSF'))
        };
    }
};
</script>
