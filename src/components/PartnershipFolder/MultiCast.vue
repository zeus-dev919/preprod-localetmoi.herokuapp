<template>
    <b-container fluid>
        <!-- multicastForm -->
        <b-row class="mb-3">
            <b-col>
                <span>Portails auprès desquels le professionnel a déjà souscrit un
        abonnement
                </span>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col sm="12" md="2" v-for="(availablePortal, index) in availablePortals" :key="availablePortal.value">
                <b-form-checkbox-group
                    @change.native="onPortalChange($event, { partner: currentPartner })"
                    v-model="checkedPortals"
                    :options="[ availablePortal ]"
                    :disabled="!identity.allowedToEdit"
                    :readonly="!identity.allowedToEdit"
                    :name="`currentPartner.portals[${index}].name`"
                    type="checkbox"
                ></b-form-checkbox-group>
            </b-col>
        </b-row>
        <b-row class="mt-3 mb-3 extra-informations">
            <b-col md="4">
                <a href="https://www.ubiflow.net/partenaires-vo.php" target="_blank" class="external-link">Liste des médias de diffusion compatibles</a>
            </b-col>
            <b-col>
                <small>Si aucun abonnement n'est souscrit par le professionnel, les annonces
        pourront être diffusées sur des supports gratuits uniquement.</small>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import {mapActions, mapState} from "vuex";

    require('../../assets/style/Pfolder/partnership-folder.css');

    import { commonPortals, autoPortals, immoPortals } from '../../Interface/partnershipFolderDatas';


    export default {
        name: 'Multicast',
        computed: {
            ...mapState('globalStore', ['status', 'portals']),
            ...mapState('account', ['identity', 'currentPartner']),
        },
        data() {
            return {
                availablePortals: commonPortals,
                commonPortals,
                autoPortals,
                immoPortals,
                checkedPortals: []
            }
        },
        methods: {
            ...mapActions('globalStore', ['getPortals']),
            ...mapActions('account', ['updatePartnerPropertyFromForm']),
            onPortalChange(event, data) {
                let newPortals = [];
                this.checkedPortals.forEach(checkedPortal => {
                    if (checkedPortal) {
                        newPortals.push(
                            this.portals[checkedPortal.toLowerCase()]
                                ? {id: this.portals[checkedPortal.toLowerCase()]['@id']}
                                : {name: checkedPortal}
                        );
                    }
                });
                if (data.partner) {
                    data.offset = 'portals';
                    data.value = newPortals;
                    this.updatePartnerPropertyFromForm({data: data});
                }
            },
        },
        mounted() {
            switch (true) {
                case this.status['isLocalAutoPlus']:
                    this.availablePortals = this.commonPortals.concat(autoPortals);
                    break;
                case this.status['isLocalImmoPlus']:
                    this.availablePortals = this.commonPortals.concat(immoPortals);
                    break;
            }
            
            if (!Object.keys(this.portals).length) {
                this.getPortals();
            }
        
            this.checkedPortals = this.currentPartner.portals.map(item => item.name);
        }
    }
</script>
