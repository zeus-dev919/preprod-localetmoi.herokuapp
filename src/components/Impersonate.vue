<template>
    <b-container>
        <b-row>
            <b-col>
                Impersonating...
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'Impersonate',
    computed: {
        ...mapState('account', ['identity'])
    },
    mounted: function () {
        this.impersonateLogin({
            userId: this.identity.id,
            username: this.$route.params.email
        }).then(
            () => {
                window.location.replace('/#/accueil');
            },
            error => {
                console.log(error);
            }
        );
    },
    methods: {
        ...mapActions('account', ['impersonateLogin'])
    }
};
</script>
