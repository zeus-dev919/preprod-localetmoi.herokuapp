<template>
    <b-container fluid>
      <!-- @todo -->
        <b-row>
            <b-col>
                <b-col class="mb-4">
                    <!-- if its not localShop -->
                    <span v-if="!status.isLocalShop">{{excelProductList.title}}</span>
                    <!-- if its localShop -->
                    <span v-if="status.isLocalShop">{{excelProductList.titleLocalShop}}</span>
                </b-col>
                <ul>
                    <!-- if its not localShop -->
                    <li v-if="!status.isLocalShop" v-for="column in excelProductList.columns">{{column}}</li>
                    <!-- if its localShop -->
                    <li v-if="status.isLocalShop" v-for="column in excelProductList.columnsLocalShop">{{column}}</li>
                </ul>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-right">
                <!-- @todo we need to have the file somewhere to be able to download it  -->
                <b-button @click="productList">Télécharger le fichier excel</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import {mapState} from "vuex";

    require('../../assets/style/Pfolder/partnership-folder.css');

    import {excelProductList} from '../../Interface/partnershipFolderDatas';
    import axios from 'axios';

    export default {
        name: 'Product',
        computed: {
            ...mapState('account', ['identity', 'currentPartner']),
            ...mapState('globalStore', ['status'])
        },
        data() {
            return {
                excelProductList,
                offer: null
            }
        },
        methods: {
            // example about how to download link need to adapt it
            productList() {
                axios({
                    url: '',
                    method: 'GET',
                    responseType: 'blob',
                }).then((response) => {
                    var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                    var fileLink = document.createElement('a');

                    // need to do this with the store
                    // this is just an example to do not waste time to search after
                    let offersfile = this.offer ? excelProductList.file : excelProductList.fileLocalShop;

                    fileLink.href = fileURL;
                    fileLink.setAttribute('Télécharger le fichier excel', offersfile);
                    document.body.appendChild(fileLink);

                    fileLink.click();
                });
            }
        }
    }
</script>
