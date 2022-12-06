<template>
    <fade-loader v-if="pageLoading" class="loader-demandes hidden-for-mobile" :color="color"></fade-loader>
</template>

<script>
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { dropboxService } from '@/_services';
import { mapState, mapActions } from "vuex";

export default {
    name: 'TicketAttachment',
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('account', ['currentPartner']),
    },
    mounted: function () {
        this.get_attachment();
    },
    data () {
        return {
            pageLoading: true,
            color: '#ec008c'
        };
    },
    methods: {
        ...mapActions('globalStore', ['getSalesforceAccount']),
        get_attachment: function () {
            this.getSalesforceAccount({accountId: this.currentPartner.company}).then(
                result => {
                    const folder = this.$route.params.folder;
                    const subfolder = this.$route.params.subfolder;
                    const filename = this.$route.params.filename;
                    const matches = folder.match(/^(\d+)[\s-._]?(.*)$/);
                    dropboxService.downloadFile(matches[1], matches[2], subfolder, filename).then(
                        data => {
                            const url = window.URL.createObjectURL(new Blob([data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', filename);
                            document.body.appendChild(link);
                            link.click();
                            this.pageLoading = false;
                            window.close();
                        }
                    );
                }
            )
        }
    }
};
</script>
