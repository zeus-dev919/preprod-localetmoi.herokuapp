<template>
    <b-col offset-lg="0" lg="4" offset-md="1" class="text-center margin-drop-button" id="drop-button-link">
        <router-link :to="`/espace-partage/${customerCode || ''}`">
            <b-col class="button-drop-element">
                <span>Déposez dès maintenant <br> vos fichiers pour la création de votre site <br> <strong>CLIQUEZ ICI</strong> </span>
            </b-col>
        </router-link>
    </b-col>
</template>
<script>

import { mapState } from "vuex";

export default {
    name: 'DropButtonLink',
    computed: {
        ...mapState('account', ['currentPartner']),
        customerCode() {
            return this.currentPartner ? this.currentPartner.customerCode : null;
        }
    }
}
</script>
