<template>
    <b-container fluid id="crm-agenda">
        <b-row class="mt-3">
            <b-col>
                <span class="__informations">Il n’y a rien à paramétrer pour le CRM. S’il est inclus dans l’offre il est fonctionnel par défaut. Il faudra simplement lui envoyer les accès à son interface AGENDIZE en passant par le modèle de mail « Paramétrage de votre module Agenda » via SF.</span>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "AgendaCrm",
    computed: {
        ...mapState('account', ['identity', 'currentPartner']),
    }
}
</script>
