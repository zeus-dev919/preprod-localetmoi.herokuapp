<template>
    <b-container fluid class="bc-example-row">
        <b-row class="marge-header">
            <b-col md="3" sm="8" cols="12">
                <router-link to="/accueil">
                    <img class="image-log" src="../assets/logo-local-et-moi.jpg" />
                </router-link>
            </b-col>
            <b-col class="phone-and-menu">
                <a href="tel:+33420101080">
                    <img class="logo-phone" src="../assets/phone.png">
                    <div class="phone-number">04 20 10 10 80</div>
                </a>
                <app-dropdownmenu class="inline-menu"></app-dropdownmenu>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from "vuex";

export default  {
    name: "HeaderMenu",
    computed: {
        ...mapState('account', ['identity', 'status', 'currentPartner']),
    }
}
</script>
