<template>
    <div class="customerRef-menu" v-if="currentPartner">
        <div class="ref-sageCode">Référence de votre dossier : {{ currentPartner.customerCode }} </div>
        <a v-if="websiteLink !== null" v-bind:href="websiteLink" target="_blank"><div class="customerRef-menu underline"> www.{{ websiteLink.replace(/https?:\/\//, '').replace('/', '') }}</div></a>
        <a v-if="websiteLink === null"><div class="customerRef-menu"> Aucun site </div></a><br />
        <p class="reminder">(à rappeler pour tout échange)</p>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'CustomerRef',
    computed: {
        ...mapState('globalStore', ['websiteLink']),
        ...mapState('account', ['currentPartner'])
    }
};
</script>
