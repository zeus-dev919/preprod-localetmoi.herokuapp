<template>
    <div>
        <b-container fluid class="bc-example-row">
            <app-mainheader></app-mainheader>
            <b-row>
                <b-col sm="12" md="12" lg="12">
                    <hr>
                    <div class="not-found">
                        <img src="../assets/erreur-404.png" class="logo-not-found">
                        <strong><p class="desc-not-found">Oups !<br />La page que vous cherchez semble introuvable.<br />Le lien que vous avez suivi peut être incorrect ou la <br />page peut avoir été supprimée.</p></strong>
                    </div>
                </b-col>
            </b-row>
        </b-container>
        <app-footer class="footer-auth" />
    </div>
</template>

<script>
require('../assets/style/presentation.css');

export default {
    name: 'NotFound'
};
</script>
