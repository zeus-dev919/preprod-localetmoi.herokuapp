<template>
    <b-modal id="cookie-modal" centered size="xl" :hide-footer="true" no-close-on-backdrop>
        <template #modal-header="{ close }">
            <b-row class="justify-center">
                <b-col sm="10">
                    <h3 class="cookie-default-title">La protection de vos données personnelles est notre priorité</h3>
                </b-col>
                <b-col class="cookie-title-info" sm="6">
                    <b-row>
                        <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site Web.
                        Utilisez les boutons pour les autoriser tous ou les gérer individuellement.</p>
                    </b-row>
                    <b-row>
                        <b-col>
                            <button class="btn-cookie-action" :class="{'selected' : false === targeting && false === performance}" @click="denyOrAcceptAllCookies(false);close()">TOUT REFUSER</button>
                        </b-col>
                        <b-col>
                            <button class="btn-cookie-action" :class="{'selected' : targeting && performance}" @click="denyOrAcceptAllCookies(true);close()">
                                <img class="picto-checked" src="../../assets/cookies/check-mark.png" alt="Accepter tout les cookies">
                                TOUT ACCEPTER
                            </button>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <div role="button">
                <h5 @click="close()" v-if="null !== targeting && null !== performance">x</h5>
            </div>
        </template>
        <template #default="{ hide }">
            <b-row>
                <b-col md="8">
                    <h4 class="cookie-content-title">Cookies essentiels</h4>
                    <p>Ce site utilise des cookies nécessaires à son bon fonctionnement, c'est pour cela qu'ils doivent rester activés.</p>
                </b-col>
                <b-col md="4">
                    <b-row>
                        <b-col class="mb-2" xs="12" sm="6"></b-col>
                        <b-col class="mb-2" xs="12" sm="6">
                            <button class="btn-cookie-action selected" :disabled="true" style="cursor: not-allowed"
                                    title="Ces cookies sont nécessaires au bon fonctionnement du site">
                                <img class="picto-checked" src="../../assets/cookies/check-mark.png" alt="Accepter tout les cookies">
                                ACCEPTER
                            </button>
                        </b-col>
                    </b-row>
                   
                </b-col>
            </b-row>
            <b-row>
                <b-col md="8">
                    <div>
                        <h4 class="cookie-content-title">Cookies de performance</h4>
                        <p>Ces cookies nous aident à améliorer votre expérience en ligne. Ils ne sont pas essentiels, mais sans eux certaines fonctionnalités peuvent ne pas fonctionner.</p>
                    </div>
                    <div>
                        <p>Ces cookies nous permettent de déterminer le nombre de visites et les sources du trafic, afin de mesurer et d'améliorer les performances de notre site Web. Ils nous aident également à identifier les pages les plus / moins visitées et d'évaluer comment les visiteurs naviguent sur le site Web. Toutes les informations collectées par ces cookies sont agrégées et donc anonymisées.</p>
                    </div>
                </b-col>
                <b-col md="4">
                    <b-row>
                        <b-col xs="12" sm="6">
                            <button class="btn-cookie-action" :class="{'selected' : false === performance}" @click="updateCookie('performance', false)">REFUSER</button>
                        </b-col>
                        <b-col xs="12" sm="6">
                            <button class="btn-cookie-action" :class="{'selected' : performance}" @click="updateCookie('performance', true)">
                                <img class="picto-checked" src="../../assets/cookies/check-mark.png" alt="Accepter tout les cookies">
                                ACCEPTER
                            </button>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="8">
                    <h4 class="cookie-content-title">Cookies de publicité ciblée</h4>
                    <p>Les cookies marketing sont généralement utilisés pour vous montrer des publicités qui correspondent à vos intérêts.</p>
                    <p>Lorsque vous visitez un autre site Web, le cookie de votre navigateur est reconnu et des publicités sélectionnées vous sont affichées en fonction des informations stockées dans ce cookie.</p>
                </b-col>
                <b-col md="4">
                    <b-row class="justify-center">
                        <b-col xs="12" sm="6">
                            <button class="btn-cookie-action" :class="{'selected': false === targeting}" @click="updateCookie('targeting', false)">REFUSER</button>
                        </b-col>
                        <b-col xs="12" sm="6">
                            <button class="btn-cookie-action" :class="{'selected': targeting}" @click="updateCookie('targeting', true)">
                                <img class="picto-checked" src="../../assets/cookies/check-mark.png" alt="Accepter tout les cookies">
                                ACCEPTER
                            </button>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </template>
    </b-modal>
</template>

<script>

import cookieMixin from "../../mixins/cookie-mixin";

require('../../assets/style/cookie.css');

export default {
    name: "CookieModal",
    mixins: [cookieMixin],
}
</script>
