<template>
    <div>
        <app-headerbuttons v-if="user"/>
        <b-container class="bv-example-row" fluid>
            <b-row>
                <app-menuformation class='hidden-for-mobile margin-menu' v-if="user"></app-menuformation>
                <app-menumobile class="menu-mobile" v-if="user"></app-menumobile>
                <b-col class="visibilty-container" lg="9" md="12" sm="12">
                    <hr v-if="user">
                    <div class="center title-cgu">Mentions légales local&moi</div>
                    <div class="subtitle-cgu">Informations relatives à l'éditeur du présent site</div>
                    <p>Société Anonyme à Directoire et Conseil de Surveillance Local.fr au capital social de 1 035 500€
                        immatriculée au RCS de Bourg en Bresse sous le numéro 331 221 150 </p>
                    <p>Siège social : Inopolis – 231 avenue de Parme – Bât C - BP82 – 01003 Bourg en Bresse Cedex</p>
                    <p>Numéro individuel d'identification de TVA : FR21 331 221 150<br/>
                    Directeur de la publication : Christophe Marais-Laforgue (Président du Directoire)<br/>
                    Numéro de téléphone : 04 74 50 41 50
                    <div class="subtitle-cgu">Informations relatives à l'hébergeur</div>
                    <p>Adresse du siège social : 2 rue Kellermann - 59100 Roubaix - France<br/>
                    Numéro de téléphone : 09 72 10 10 07</p>
                    <div class="subtitle-cgu">1. Conditions d'utilisation</div>
                    <p>Le site est accessible par l'url www.localetmoi.fr Son utilisation est régie par les présentes
                        conditions générales. En utilisant le site, vous reconnaissez avoir pris connaissance de ces
                        conditions et les avoir acceptées. Celles-ci pourront être modifiées à tout moment et sans
                        préavis
                        par la société local.fr. local.fr ne saurait être tenue pour responsable en aucune manière d'une
                        mauvaise utilisation du service.
                    </p>
                    <div class="subtitle-cgu">2. Limitation de la responsabilité</div>
                    <p>Les informations contenues sur ce site sont aussi précises que possible et le site est
                        périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou
                        des lacunes. Si vous constatez une erreur ou ce qui peut être un dysfonctionnement, merci de
                        bien vouloir le signaler par email en décrivant le problème de la manière la plus précise
                        possible.
                    </p>
                    <p>Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa
                        seule responsabilité. En conséquence, local.fr ne saurait être tenu responsable d'un quelconque
                        dommage subi par l'ordinateur de l'utilisateur ou d'une quelconque perte de données consécutives
                        au téléchargement. Les photos sont non contractuelles. Les liens hypertextes mis en place sur ce
                        site internet en direction d'autres sites internet ne sauraient engager la responsabilité de
                        local.fr.
                    </p>
                    <div class="subtitle-cgu">3. Litiges</div>
                    <p>Les présentes conditions sont régies par les lois françaises et toute contestation ou litige qui
                        pourrait naître de l'interprétation ou de l'exécution de celles-ci seront de la compétence
                        exclusive des tribunaux dont dépend le siège social de la société local.fr. La langue de
                        référence, pour le règlement de contentieux éventuels, est le français.
                    </p>
                    <div class="subtitle-cgu">4. Données personnelles</div>
                    <p>En application de la loi informatique et libertés, les internautes disposent d'un droit d'accès,
                        de rectification, de modification et de suppression concernant les données qui les concernent
                        personnellement. Ce droit peut être exercé par voie postale auprès de local.fr 231, av de Parme
                        Inopolis - Bât C 01003 Bourg en Bresse cédex ou par voie électronique à l'adresse email suivante
                        : communication@local.fr. Les informations personnelles collectées sont confidentielles et
                        ne sont en aucun cas transmises à des tiers hormis pour l'éventuelle bonne exécution de la
                        prestation commandée par l'internaute. En vertu de la loi n° 2000-719 du 1er août 2000, les
                        coordonnées déclarées par l'acheteur pourront être communiquées sur réquisition des autorités
                        judiciaires.
                    </p>
                    <div class="subtitle-cgu">5. Propriété intellectuelle</div>
                    <p>Tout le contenu du présent site, incluant, de façon non limitative, les graphismes, images,
                        textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la
                        propriété exclusive de la société local.fr à l'exception des marques, logos ou contenus
                        appartenant à d'autres sociétés partenaires ou auteurs. Toute reproduction, distribution,
                        modification, adaptation, retransmission ou publication, même partielle, de ces différents
                        éléments est strictement interdite sans l'accord express par écrit de local.fr.
                    </p>
                    <div class="subtitle-cgu">6. Cookies</div>
                    <p> Pour des besoins de statistiques et d'affichage, le présent site utilise des cookies. Il s'agit
                        de petits fichiers textes stockés sur votre disque dur afin d'enregistrer des données techniques
                        sur votre navigation. Certaines parties de ce site ne peuvent être fonctionnelles sans
                        l'acceptation de cookies.
                    </p>
                    <div class="subtitle-cgu">7. Prestataire technique</div>
                    <p>Les prestations techniques sont assurées par Local.fr, société anonyme à Directoire et Conseil de
                        Surveillance, dont le siège social est situé au 231 avenue de Parme Bât C 01000 Bourg en Bresse.
                    </p>
                </b-col>
            </b-row>
        </b-container>
        <app-footer></app-footer>
    </div>
</template>
<script>
import { mapState } from "vuex";

export default {
    name: 'Cgu',
    computed: {
        ...mapState('account', ['user'])
    }
}
</script>
