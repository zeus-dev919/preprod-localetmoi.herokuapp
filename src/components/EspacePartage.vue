<template>
    <div class="espace-partage" @click="close_menu">
        <app-headerbuttons></app-headerbuttons>
        <b-container fluid class="bv-example-row">
            <b-row>
                <notifications group="success" position="bottom right" class="notification-container"/>
                <notifications group="error" position="bottom right" class="notification-container"/>
                <app-menuprofile v-if="isUser" class="hidden-for-mobile"></app-menuprofile>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <b-col :lg="isUser ? 9 : 12" md="12" sm="12" class="dragdrop-container">
                    <b-row>
                        <b-col lg="8" md="6" sm="6" class="content-zone">
                            <vue-progress-bar id="progress"></vue-progress-bar>
                            <h2 class="text-center mb-2">Espace de partage</h2>
                            <hr :class="{'uploading': isUploading }">
                            <p class="text-center mb-3">Déposez ci-dessous tous les éléments utiles à la création de votre site
                                internet :
                                <br> logo, photos, flyers, carte de visite, etc. <span class="max-size-upload-label">(Taille maximale par fichier : 15 Mo)</span>
                            </p>
                            <div id="file-drag-drop" class="drop-zone">
                                <a @click="add_files()">
                                    <form ref="fileform">
                                        <div v-if="0 === files.length">
                                            <img class="upload-logo" src="../assets/upload-cloud.svg" width="50"/>
                                            <p class="drop-files">Déposez vos fichiers ici</p>
                                        </div>
                                        <div v-for="(file, key) in files" :key="key+forceReload" class="file-listing">
                                            {{ file.name }}
                                            <a @click.stop="removeFile(key); " style="z-index: 4"
                                               v-if="false === file.uploaded || !isUploading">
                                                <img class="delete-file cross-preview" src="../assets/delete.png"/>
                                            </a>
                                            <span v-if="file.isUploading" class="uploading-file cross-preview"><i
                                                class="fas fa-fan"></i></span>
                                            <span v-if="file.uploaded" class="uploaded-file cross-preview"><i
                                                class="fas fa-check-circle"></i></span>
                                            <span v-if="false === file.uploaded" class="error-file cross-preview"><i
                                                class="fas fa-exclamation-circle"></i></span>
                                        </div>
                                    </form>
                                </a>
                                <a class="submit-button" :class="isUploading ? 'disabled' : ''" @click="submitFiles()" v-show="files.length > 0">Envoyer</a>
                            </div>
                        </b-col>
                        <b-col lg="4" md="6" sm="6" class="my-files-container px-2">
                            <h2 class="text-center my-files-entitle">Mes fichiers</h2>
                            <hr>
                            <fade-loader v-if="status.isPageLoading" :color="color"
                                         class="loader-accueil"></fade-loader>
                            <div v-if="!status.isPageLoading && !status.isGetRecentFolderLoading" v-for="(folder, index) in folders" :key="folder.id">
                                <div class="folders_list">
                                    <span @click="list_files(folder.name, index, $event)" class="folder-label">
                                        <i class="fas fa-folder"></i> {{ folder.name }}
                                    </span>
                                    <ul class="files_list">
                                        <li v-for="file in filesFromFolder[index]" :key="file.id">
                                            <a class="open-file" download
                                               v-if="!status.isPageLoading" @click="download_file(file, folder.name)">
                                                <p class="filename"> {{ file.name }}</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <hr v-if="!status.isPageLoading">
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col lg="12" md="12" sm="12" hidden>
                    <label>
                        <input type="file" id="files" ref="files" multiple @change="handle_files_upload()" :accept="allowedUploadExtensions" />
                    </label>
                </b-col>
            </b-row>
        </b-container>
        <app-footer class="footer-profile"></app-footer>
    </div>
</template>

<script>

import { dropboxService } from "@/_services";
import router from '@/router';
import { readyState, authDpHelper, fileHelpers, progressBar, dropboxHelper } from "@/_helpers";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { mapActions, mapState } from "vuex";
import MenuMobile from '@/components/MenuMobile.vue';
import partnerMixin from '../mixins/partner-mixin';

require('../assets/style/dragdrop.css');
require('../assets/style/progress-bar.css');

export default {
    name: 'EspacePartage',
    mixins: [partnerMixin],
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('account', ['currentPartner', 'identity']),
        ...mapState('globalStore', ['status', 'salesforce']),
        isUser() {
            return authDpHelper.isUser(this.identity);
        }
    },
    async mounted() {
        this.defaultFolderPath = await dropboxHelper.getFolderPath();
        const currentPartner = await readyState.getCurrentPartnerState();
        const salesforce = await readyState.getSalesforceState();
        if (!currentPartner
            || !this.$route.params.customerCode
            || currentPartner.customerCode !== parseInt(this.$route.params.customerCode)
        ) {
            return router.push(this.isUser ? '/' : '/backoffice');
        }

        if (currentPartner && salesforce) {
            await this.list_folders();
            if (false === this.status.hasMostRecentFolder) {
                dropboxHelper.getMostRecentFolder(currentPartner.customerCode, salesforce.account.Name);
            }
        }
        
        this.dragAndDropCapable = this.determineDragAndDropCapable();
        if (this.dragAndDropCapable) {
            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (evt) {
                this.$refs.fileform.addEventListener(evt, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }.bind(this), false);
            }.bind(this));
            this.$refs.fileform.addEventListener('drop', function (e) {
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    this.files.push(e.dataTransfer.files[i]);
                }
            }.bind(this));
        }
    },
    data() {
        return {
            dragAndDropCapable: false,
            files: [],
            folders: [],
            filesFromFolder: [],
            color: '#ec008c',
            allowedUploadExtensions: fileHelpers.getAllowedExtensions().join(','),
            errorsUploading: false,
            isUploading: false,
            hasFolder: true,
            defaultFolderPath: '',
            forceReload: 0,
        };
    },
    methods: {
        ...mapActions('globalStore', ['uploadDropboxFile']),
        close_menu: function () {
            MenuMobile.methods.closeNav();
        },
        extract_file_name: function (fileName) {
            return fileName.split('/')[fileName.split('/').length - 1].substr(13);
        },
        add_files() {
            this.$refs.files.click();
        },
        handle_files_upload() {
            let uploadedFiles = this.$refs.files.files;
            for (var i = 0; i < uploadedFiles.length; i++) {
                this.files.push(uploadedFiles[i]);
            }
        },
        determineDragAndDropCapable() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        },
        removeFile(key) {
            this.files.splice(key, 1);
        },
        async submitFiles() {
            if (!this.files.length || this.isUploading) {
                return;
            }
            this.isUploading = true;
            let folderName = this.defaultFolderPath;
            let subFolder = dropboxHelper.getElementsFolderName();
            this.$Progress.start();
            this.$Progress.pause();
            
            let formData = new FormData();
            this.files.forEach((file, i) => formData.append(`files[${i}]`, file))
    
            if (!this.status.isDropboxEmailSent) {
                dropboxHelper.sendEmailForMultipleFoldersFound('drop-element');
            }
        
            let percentPerFile = progressBar.getPercentagePerFile(this.files.length);
            let round = 0;
            let filesSent = [];
    
            const newFolderPath = dropboxHelper.retrieveMostRecentBasePath();
            const message = dropboxHelper.getMultipleFoldersMessage();
    
            const folderPathFound = newFolderPath || folderName;
            
            for (let i = 0; i < this.files.length; i++) {
                let file = this.files[i];
                file.isUploading = true;
                this.forceReload++;
                this.$Progress.set(round);
                
                try {
                    const result = await this.uploadDropboxFile({
                        folderName: folderPathFound,
                        subFolder,
                        file,
                        message
                    });
                    if (result.name) {
                        file.uploaded = true;
                        filesSent.push(file.name);
                        round += percentPerFile;
                        this.$Progress.set(round);
                        this.$Progress.pause();
                    } else {
                        file.uploaded = false;
                        this.errorsUploading = true;
                    }
                } catch (e) {
                    file.uploaded = false;
                    this.errorsUploading = true;
                }
                file.isUploading = false;
                this.forceReload++;
            }
            
            if (!this.errorsUploading && this.status && this.status.isSalesforceProductionValidated) {
                dropboxHelper.notifyUploadedFiles(
                    'drop-element',
                    filesSent,
                    dropboxHelper.getFolderNameForNotifyUploadedFiles(folderPathFound)
                );
            }
            
            let resetting;
            if (this.errorsUploading) {
                this.$Progress.setColor('red');
                resetting = new Promise((resolve) => setTimeout(() => {
                    this.$Progress.hide();
                    this.$Progress.set(0);
                    resolve();
                }, 10000));
            } else {
                this.$Progress.finish();
                resetting = Promise.resolve();
            }
            resetting.then(async () => {
                this.files = [];
                this.folders = [];
                this.filesFromFolder = [];
                this.$Progress.setColor('#ec008c');
                this.errorsUploading = null;
                this.isUploading = false;
                filesSent = [];
                await this.list_folders();
            });
        },
        async list_folders() {
            this.folders = [];
            await dropboxService.getFolder(this.currentPartner.customerCode, this.salesforce.account.Name)
                .then(folders => {
                folders.forEach(folder => {
                    this.folders.push(folder);
                })
            });
        },
        async list_files(subFolder, index, event) {
            let folder = event.currentTarget.firstChild;

            if ('span' === event.currentTarget.tagName.toLowerCase()) {
                folder.classList.toggle('fa-folder-open');
                event.target.classList.remove('empty-files');
            } else {
                folder.classList.toggle('fa-folder');
            }

            this.$set(this.filesFromFolder, index, []);

            if ('fas fa-folder fa-folder-open' === folder.className) {
                await dropboxService.getFolder(this.currentPartner.customerCode, this.salesforce.account.Name, subFolder).then(files => {
                    if (!files.length) {
                        event.target.classList.add('empty-files');
                    }
                    
                    this.$set(this.filesFromFolder, index, files);
                });
            }
        },
        async download_file(file, subFolder) {
            await dropboxService.downloadFile(this.currentPartner.customerCode, this.salesforce.account.Name, subFolder, file.name).then(
                data => {
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', file.name);
                    document.body.appendChild(link);
                    link.click();
                }
            );
        },
    },
    beforeDestroy() {
        if (this.dragAndDropCapable) {
            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(el => {
                this.$refs.fileform.removeEventListener(el, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, true);
            });
        }
    }
};
</script>
