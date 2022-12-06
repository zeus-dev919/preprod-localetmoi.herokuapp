<template>
    <div class="site" @click="change_to_original_info">
        <app-headerbuttons></app-headerbuttons>
        <notifications group="mail-sent" position="bottom right" class="notification-container"/>
        <b-container fluid class="bc-example-row">
            <modal name="more-infos" :adaptive="true" :width="700" :height="670">
                <div class="ask-demo">
                    <h3>Demander une démo
                        <span><img class="button-close" @click="close_modal" src="../assets/close.png"></span>
                    </h3>
                    <hr>
                    <b-form-group label="Sélectionnez le type de démo souhaité :">
                        <b-form-radio-group id="radios1" v-model="demoType" name="radioSubComponent">
                            <b-form-radio value="Visibilité" selected>Visibilité</b-form-radio>
                            <b-form-radio value="Garantie de visite">Garantie de visite</b-form-radio>
                            <b-form-radio value="Agenda en ligne">Agenda en ligne</b-form-radio>
                            <b-form-radio value="CRM">CRM</b-form-radio>
                            <b-form-radio value="E-commerce">E-commerce</b-form-radio>
                        </b-form-radio-group>
                        <hr>
                        <p>Choisissez deux dates de rendez-vous :<span v-if="error" class="error-demo">Veuillez saisir deux dates différentes</span></p>
                        <b-row>
                            <b-col class="center">
                                1er choix de date
                                <v-date-picker mode='single' :disabled-dates='{ weekdays: [1, 7] }' :min-date='new Date()' v-model='firstDate'>
                                </v-date-picker><br>
                                <b-form-radio-group id="radios1" v-model="time1" name="radioSubComponent2">
                                    <b-form-radio value="Matin">Matin</b-form-radio>
                                    <b-form-radio value="Après-midi">Après-midi</b-form-radio>
                                </b-form-radio-group>
                            </b-col>
                            <b-col class="center">
                                2e choix de date
                                <v-date-picker mode='single' :disabled-dates='{ weekdays: [1, 7] }' :min-date='new Date()' v-model='secondDate'>
                                </v-date-picker><br>
                                <b-form-radio-group id="radios3" v-model="time2" name="radioSubComponent3">
                                    <b-form-radio value="Matin">Matin</b-form-radio>
                                    <b-form-radio value="Après-midi">Après-midi</b-form-radio>
                                </b-form-radio-group>
                            </b-col>
                        </b-row>
                    </b-form-group>
                    <button @click="send_demo" class="demo-button" type="submit">Demander une démo</button>
                </div>
            </modal>
            <b-row>
                <app-menuformation class='hidden-for-mobile margin'></app-menuformation>
                <app-menumobile class="menu-mobile"></app-menumobile>
                <fade-loader v-if="status.isPageLoading" class="loader-site hidden-for-mobile" :color="color"></fade-loader>
                <b-col lg="9" class="mon-offre" v-if="!status.isPageLoading">
                    <hr>
                    <b-row>
                        <b-col lg="8" md="8" sm="6" xs="6" cols="12">
                            <b-row>
                                <b-col v-if="offers.length > 1" v-for="(value, key) in offers" :key="key" @click="print_my_offer_services(offers[key]); currentTab = offers[key].productCode" v-bind:class="{ 'current-tab': offers[key].productCode == currentTab }" v-on:click="actualTabOffer(offers[key].name)" class="product-code-tab">
                                    {{ offers[key].name }}
                                </b-col>
                                <b-col v-if="offers.length === 0">
                                    <h3>{{ messageOffer }}</h3>
                                </b-col>
                                <b-col v-if="offers.length === 1" v-for="(value, key) in offers" :key="key">
                                    <h3>Mon offre :<strong> {{ offers[key].name }}</strong></h3>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col lg="4" md="4" sm="6" xs="6" cols="12" class="infos-customer">
                            <app-customerRef></app-customerRef>
                        </b-col>
                    </b-row>
                    <p>Signature partenariat : <b>{{ signatureDate }}</b></p>
                    <b-row class="content-padding">
                        <b-col v-if='isBoost' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline boost-size"></div>
                                <b-row>
                                    <b-col lg="10">
                                        <b-row>
                                            <b-col @click.stop="change_to_boost_call_info" offset="0" lg="4" md="4" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_create_campaign_info" lg="4" md="4" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Création de la<br />campagne</div>
                                                </div>
                                            </b-col>
                                            <b-col v-if="!isCampaign" @click.stop="change_to_following_info" lg="4" md="4" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle">Suivi et<br /> optimisation</div>
                                                </div>
                                            </b-col>
                                            <b-col v-if="isCampaign" @click.stop="change_to_following_mailing_info" lg="4" md="4" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle">Suivi et<br /> optimisation</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='isEcommercePlatinum || isEcommercePremium' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_store_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_webinar_1_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />Webinar 1</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_online_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle">Appel de<br />suivi</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_webinar_2_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Formation<br />Webinar 2</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_creation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-contract">
                                                    <div class="info-circle">Création<br />profil visibilité</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='status.isLocalResto' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline boost-size"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_info_toolbox" offset="0" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_photo_report" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Reportage<br />photo</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_info_toolbox" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat3_info_toolbox" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <div class="timeline boost-size-plus"></div>
                                        <b-row>
                                            <b-col @click.stop="change_to_livraison_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle-resto">Appel<br />livraison du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_online2_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Mise en<br />ligne du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_formation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_7 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />à distance</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_visibility_creation_and_reputation" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_8 }" class="circle-upcoming">
                                                    <div class="info-circle-resto-reputation">Création profil visibilité et<br />e-reputation</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='status.isLocalHotel' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline boost-size-plus"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_info_toolbox" offset="0" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_photo_report_hotel" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Reportage<br />photo</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_info_toolbox" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat3_info_toolbox" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_livraison_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle-resto">Appel<br />livraison du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_online2_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Mise en<br />ligne du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_formation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_7 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />à distance</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_visibility_creation_and_reputation" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_8 }" class="circle-upcoming">
                                                    <div class="info-circle-resto-reputation">Création profil visibilité et<br />e-reputation</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='status.isLocalAuto' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline boost-size-plus"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_info_toolbox_auto" offset="0" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_info_toolbox" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_connexion_to_ubiflow_auto" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle-toolbox">Annonces</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_livraison_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle-resto">Appel<br />livraison du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_online2_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Mise en<br />ligne du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_formation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_7 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />à distance</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_creation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_8 }" class="circle-upcoming">
                                                    <div class="info-circle-toolbox-profil">Création profil visibilité</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='isLocalAutoPlus' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline boost-size-plus"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_info_toolbox" offset="0" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_info_toolbox" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_connexion_to_ubiflow_auto_plus" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle-toolbox-plus">Annonces<br /> et<br />Multi-diffusion</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_livraison_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle-resto">Appel<br />livraison du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_online2_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Mise en<br />ligne du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_formation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_7 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />à distance</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_creation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_8 }" class="circle-upcoming">
                                                    <div class="info-circle-toolbox-profil">Création profil visibilité</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='isLocalImmo' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline boost-size-plus"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_info_toolbox" offset="0" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_info_toolbox" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_connexion_to_ubiflow_immo" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle-toolbox">Annonces</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_livraison_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle-resto">Appel<br />livraison du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_online2_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Mise en<br />ligne du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_formation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_7 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />à distance</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_creation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_8 }" class="circle-upcoming">
                                                    <div class="info-circle-toolbox-profil">Création profil visibilité</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='isLocalImmoPlus' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline boost-size-plus"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_info_toolbox" offset="0" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_info_toolbox" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_connexion_to_ubiflow_immo_plus" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle-toolbox-plus">Annonces<br /> et<br />Multi-diffusion</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_livraison_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle-resto">Appel<br />livraison du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_online2_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Mise en<br />ligne du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_formation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_7 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />à distance</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_creation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_8 }" class="circle-upcoming">
                                                    <div class="info-circle-toolbox-profil">Création profil visibilité</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='status.isLocalShop' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_localShop" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_localShop_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_webinar_1_localShop_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />Webinar 1</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_online_localShop_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle">Appel de<br />suivi</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_webinar_2_bat_localShop_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Formation<br />Webinar 2</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_creation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-contract">
                                                    <div class="info-circle">Création<br />profil visibilité</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='isLocalShopWithMigration' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_localShop" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_localShop_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_webinar_1_localShop_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Formation<br />Webinar 1</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_online_localShop_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle">Appel de<br />suivi</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_webinar_2_bat_localShop_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Formation<br />Webinar 2</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_creation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-contract">
                                                    <div class="info-circle">Création<br />profil visibilité</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col v-if='!isBoost && !isEcommercePlatinum && !isEcommercePremium && !isLocalPresence && !status.isToolbox && !status.isLocalShop && !isLocalShopWithMigration' lg="8" md="12" sm="12" cols="3">
                            <b-col lg="12">
                                <div class="timeline" v-bind:class="{ 'not-webtool-size': isLocalStart || isLocalWeb }"></div>
                                <b-row>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_appel_info" offset="0" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_1 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />Brief</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_conception_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_2 }" class="circle-upcoming">
                                                    <div class="info-circle">Conception<br />site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_bat2_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_3 }" class="circle-red">
                                                    <div class="info-circle">Envoi<br />CREA</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_livraison_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_4 }" class="circle-contract">
                                                    <div class="info-circle">Appel<br />livraison du site</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col lg="6">
                                        <b-row>
                                            <b-col @click.stop="change_to_online2_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_5 }" class="circle-upcoming">
                                                    <div class="info-circle">Mise en<br />ligne du site</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_formation_info" lg="3" md="2" sm="2">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-red">
                                                    <div class="info-circle">Formation<br />à distance</div>
                                                </div>
                                            </b-col>
                                            <b-col @click.stop="change_to_creation_info" lg="3" md="2" sm="2" v-if="!isLocalStart && !isLocalWeb">
                                                <div v-bind:class="{ 'circle-active': isCurrentStage_6 }" class="circle-contract">
                                                    <div class="info-circle">Création<br />profil visibilité</div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                        <b-col lg="4" md="12" sm="12" offset-lg="0" offset-md="0" offset-sm="0" offset="2" cols="7" class="box-down">
                            <b-col lg="11" md="11" sm="11" class="details-offer">
                                {{ description }}
                            </b-col>
                        </b-col>
                        <b-col lg="8" md="12" sm="12" class="rdv-site">
                            <p>Les caractéristiques de votre offre :</p>
                            <b-row class="logo-list">
                                <b-col v-if="!isBoost && !isEcommercePlatinum && !isEcommercePremium && !status.isLocalShop && !isLocalShopWithMigration && !isLocalPresence" lg="1" md="2" sm="2" cols="3" class="logo-site-bottom" v-b-tooltip.hover v-bind:title="services[0]">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': responsiveDesign }" src="../assets/responsive-design.png" />
                                    <p class="description">{{ services[0] }}</p>
                                </b-col>
                                <b-col v-if="isEcommercePlatinum || isEcommercePremium" lg="1" md="2" sm="2" cols="3"
                                       class="logo-site-bottom" v-b-tooltip.hover v-bind:title=services[14]>
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': responsiveDesign }" src="../assets/responsive-design.png" />
                                    <p class="description">{{ services[14] }}</p>
                                </b-col>
                                <b-col v-if="status.isLocalShop || isLocalShopWithMigration" lg="1" md="2" sm="2" cols="3" class="logo-site-bottom" v-b-tooltip.hover v-bind:title=services[21]>
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': responsiveDesign }" src="../assets/responsive-design.png" />
                                    <p class="description">{{services[21]}}</p>
                                </b-col>
                                <b-col v-if="!isBoost && !isEcommercePlatinum && !isEcommercePremium && !isLocalPresence && !status.isToolbox && !status.isLocalShop && !isLocalShopWithMigration && !isLocalBoutique" lg="1" md="2" sm="2" cols="3" class="logo-site-bottom" v-b-tooltip.hover v-bind:title="services[1]">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': securedNavigation }" src="../assets/connexion-securisee.png" />
                                    <p class="description">{{ services[1] }}</p>
                                </b-col>
                                <b-col lg="1" md="2" sm="2" cols="3" class="logo-site-bottom" v-b-tooltip.hover v-bind:title="services[2]">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': expertFollowing }" src="../assets/accompagnement.png" />
                                    <p class="description">{{ services[2] }}</p>
                                </b-col>
                                <b-col v-if='!isLocalPresence' lg="1" md="2" sm="2" cols="3" offset-md="0" offset-sm="0" class="logo-site-bottom" v-b-tooltip.hover v-bind:title=services[3]>
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': statReport }" src="../assets/statistiques.png" />
                                    <p class="description">{{ services[3] }}</p>
                                </b-col>
                                <b-col v-if="!isBoost && !isEcommercePremium && !isEcommercePlatinum && !isLocalPresence && !status.isLocalShop && !isLocalShopWithMigration && !isLocalBoutique" lg="1" md="2" sm="2" cols="3" class="logo-site-bottom" v-b-tooltip.hover v-bind:title="services[4]">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': updates }" src="../assets/webtool.png" />
                                    <p class="description">{{ services[4] }}</p>
                                </b-col>
                                <b-col v-if="isEcommercePremium || isEcommercePlatinum || status.isLocalShop || isLocalShopWithMigration && !isLocalBoutique" lg="1" md="2" sm="2" cols="3" class="logo-site-bottom" v-b-tooltip.hover v-bind:title="services[4]">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': updates }" src="../assets/webtool.png" />
                                    <p class="description">Accès à la plateforme Oxatis</p>
                                </b-col>
                                <b-col v-if="!isBoost && !isLocalPresence && !isLocalStart" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[5]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': remoteFormation }" src="../assets/formation-a-distance.png" />
                                    <p class="description">{{ services[5] }}</p>
                                </b-col>
                                <b-col v-if="!isBoost && !isLocalStart && !isEcommercePlatinum && !isEcommercePremium" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[6]" class="logo-site-bottom">
                                    <a href="https://www.etre-visible.local.fr/diffusion-locale" target="_blank">
                                        <img class="services-img" v-bind:class="{ 'logo-unavailable': visibilityOn }" src="../assets/diffusion-locale.png" />
                                        <p class="description">Visibilité</p>
                                    </a>
                                </b-col>
                                <b-col v-if="!isEcommercePlatinum && !isEcommercePremium && !isBoost && !isLocalStart && !isLocalPresence && !status.isToolbox && !status.isLocalShop && !isLocalShopWithMigration && !isLocalBoutique" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[7]" class="logo-site-bottom">
                                    <a href="https://www.etre-visible.local.fr/referencement" target="_blank">
                                        <img class="services-img" v-bind:class="{ 'logo-unavailable': visitGuarantee }" src="../assets/referencement-payant.png" />
                                        <p class="description">Garantie de visite</p>
                                    </a>
                                </b-col>
                                <b-col v-if="isBoost" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[15]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': visitGuarantee }" src="../assets/referencement-payant.png" />
                                    <p class="description">Référencement sur mesure</p>
                                </b-col>
                                <b-col v-if="!isBoost && !isEcommercePlatinum && !isEcommercePremium && !isLocalStart && !isLocalPresence && status.isLocalResto && status.isLocalHotel && !status.isLocalShop && !isLocalShopWithMigration && !isLocalBoutique" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[8]" class="logo-site-bottom">
                                    <a href="https://www.etre-visible.local.fr/agenda-en-ligne" target="_blank">
                                        <img class="services-img" v-bind:class="{ 'logo-unavailable': onlineSchedule }" src="../assets/agenda-en-ligne.png" />
                                        <p class="description">Formulaire de réservation en ligne</p>
                                    </a>
                                </b-col>
                                <b-col v-if="!isBoost && !isEcommercePlatinum && !isEcommercePremium && !isLocalStart && !isLocalPresence && !status.isToolbox && !status.isLocalShop && !isLocalShopWithMigration && !isLocalBoutique" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[8]" class="logo-site-bottom">
                                    <a href="https://www.etre-visible.local.fr/agenda-en-ligne" target="_blank">
                                        <img class="services-img" v-bind:class="{ 'logo-unavailable': onlineScheduleMain }" src="../assets/agenda-en-ligne.png" />
                                        <p class="description">Agenda en ligne</p>
                                    </a>
                                </b-col>
                                <b-col v-if="!isBoost && !isEcommercePlatinum && !isEcommercePremium && !isLocalStart && !isLocalPresence && !status.isToolbox && !status.isLocalShop && !isLocalShopWithMigration && !isLocalBoutique" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[9]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': CrmOn }" src="../assets/crm.png" />
                                    <p class="description">CRM</p>
                                </b-col>
                                <b-col v-if="isEcommercePlatinum || isEcommercePremium || status.isLocalShop || isLocalShopWithMigration" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[10]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': onlineSupport }" src="../assets/sept-sur-sept.png" />
                                    <p class="description">Support en ligne 7j/7</p>
                                </b-col>
                                <b-col v-if="isEcommercePremium || status.isLocalShop || isLocalShopWithMigration" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[11]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': phoneSupport }" src="../assets/assist.png" />
                                    <p class="description">Support téléphonique du lundi au vendredi</p>
                                </b-col>
                                <b-col v-if="status.isLocalShop || isLocalShopWithMigration" lg="1" md="2" sm="2" cols="3" class="logo-site-bottom" v-b-tooltip.hover v-bind:title=services[22]>
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': migration }" src="../assets/migration-localshop-blanc.png" />
                                    <p class="description">{{services[22]}}</p>
                                </b-col>
                                <b-col v-if="isEcommercePlatinum || isEcommercePremium" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[12]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': capacity5000 }" src="../assets/cart-simple.png" />
                                    <p class="description">Capacité de 5 000 produits</p>
                                </b-col>
                                <b-col v-if="isEcommercePlatinum || isEcommercePremium" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[13]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': capacity10000 }" src="../assets/cart-plus.png" />
                                    <p class="description">Capacité de 10 000 produits</p>
                                </b-col>
                                <b-col v-if="status.isLocalResto || status.isLocalHotel" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[16]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': photo_report }" src="../assets/photo-report.png" />
                                    <p class="description">Reportage photos</p>
                                </b-col>
                                <b-col v-if="status.isLocalResto || status.isLocalHotel" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[17]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': gift_card }" src="../assets/gift-card.png" />
                                    <p class="description">Solution de vente en ligne produits et (bons cadeaux)</p>
                                </b-col>
                                <b-col v-if="status.isLocalResto || status.isLocalHotel" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[18]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': e_reputation }" src="../assets/e-reputation.png" />
                                    <p class="description">E-reputation</p>
                                </b-col>
                                <b-col v-if="isLocalAuto || isLocalAutoPlus" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[19]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': adAuto }" src="../assets/annonces-auto.png" />
                                    <p class="description">Annonces</p>
                                </b-col>
                                <b-col v-if="isLocalImmo || isLocalImmoPlus" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[19]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': adImmo }" src="../assets/annonces-immo.png" />
                                    <p class="description">Annonces</p>
                                </b-col>
                                <b-col v-if="isLocalAutoPlus || isLocalImmoPlus" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[20]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': multiDiffusion }" src="../assets/multidiffusion.png" />
                                    <p class="description">Multi-diffusion</p>
                                </b-col>
                                <b-col v-if="isLocalBoutique" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[23]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': integratedProducts }" src="../assets/logo-panier.png" />
                                    <p class="description">15 produits intégrés</p>
                                </b-col>
                                <b-col v-if="isLocalBoutique" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[24]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': clickAndCollect }" src="../assets/logo-click-and-collect.png" />
                                    <p class="description">Click&Collect</p>
                                </b-col>
                                <b-col v-if="isLocalBoutique" offset-sm="0" offset-md="0" offset-lg="0" lg="1" md="2" sm="2" cols="3" v-b-tooltip.hover v-bind:title="services[25]" class="logo-site-bottom">
                                    <img class="services-img" v-bind:class="{ 'logo-unavailable': securedPayment }" src="../assets/logo-cb.png" />
                                    <p class="description">Moyens de paiement sécurisés</p>
                                </b-col>
                            </b-row>
                            <div v-if="!isEcommercePlatinum && !isEcommercePremium && !isBoost">
                                <div class="more-infos-text">Vous souhaitez bénéficier d'une fonctionnalité supplémentaire ?</div>
                                <a @click="open_modal">
                                    <div class="more-infos-button">Demander une démo</div>
                                </a>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
        <app-footer class="footer-auth"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import MenuMobile from '@/components/MenuMobile.vue';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { dateHelpers } from "../_helpers";

require('../assets/style/accueil.css');
require('../assets/style/site.css');

export default {
    name: 'Site',
    components: {
        FadeLoader
    },
    computed: {
        ...mapState('globalStore', ['offers', 'partner', 'salesforce', 'status'])
    },
    watch: {
        offers: function () {
            this.setDefaultOffer();
            this.printDefaultOffer();
        }
    },
    mounted: function () {
        this.setDefaultOffer();
        this.printDefaultOffer();
    },
    data () {
        return {
            description: '',
            signatureDate: '',
            responsiveDesign: false,
            securedNavigation: false,
            expertFollowing: false,
            statReport: false,
            updates: false,
            remoteFormation: false,
            visibilityOn: false,
            visitGuarantee: false,
            onlineSchedule: false,
            onlineScheduleMain: false,
            CrmOn: false,
            onlineSupport: false,
            phoneSupport: false,
            capacity5000: false,
            capacity10000: false,
            e_reputation: false,
            adAuto: false,
            adImmo: false,
            multiDiffusion: false,
            integratedProducts: false,
            clickAndCollect: false,
            securedPayment: false,
            gift_card: false,
            photo_report: false,
            migration: false,
            isBoost: false,
            isCampaign: false,
            isEcommercePlatinum: false,
            isEcommercePremium: false,
            isLocalStart: false,
            isLocalWeb: false,
            isLocalPresence: false,
            isLocalResto: false,
            isLocalHotel: false,
            isLocalAuto: false,
            isLocalImmo: false,
            isLocalAutoPlus: false,
            isLocalImmoPlus: false,
            isLocalShop: false,
            isLocalShopWithMigration: false,
            isLocalBoutique: false,
            isCurrentStage_1: false,
            isCurrentStage_2: false,
            isCurrentStage_3: false,
            isCurrentStage_4: false,
            isCurrentStage_5: false,
            isCurrentStage_6: false,
            isCurrentStage_7: false,
            isCurrentStage_8: false,
            services: [
                'Responsive Design',
                'Navigation sécurisée',
                'Accompagnement par un expert',
                'Statistiques de performance',
                'Outil de mise à jour',
                'Formation à distance',
                'Visibilité',
                'Garantie de visite',
                'Agenda en ligne - Disponible uniquement avec LocalAgenda',
                'CRM - Disponible uniquement avec LocalAgenda',
                'Support en ligne 7j/7',
                'Support téléphonique du lundi au vendredi',
                'Capacité de 5 000 produits',
                'Capacité de 10 000 produits',
                'Création site (adapté en version mobile)',
                'Référencement sur mesure',
                'Reportage photos',
                'Solution de vente en ligne (produits et bons cadeaux)',
                'E-reputation',
                'Annonces',
                'Multi-diffusion',
                'Création boutique en ligne version mobile',
                'Migration',
                '15 produits intégrés',
                'Click&Collect',
                'Moyens de paiement sécurisés'
            ],
            firstDate: new Date(),
            secondDate: new Date(),
            demoType: 'Visibilité',
            time1: 'Matin',
            time2: 'Matin',
            error: false,
            color: '#ec008c',
            currentTab: null,
            messageOffer: 'Recherche de votre offre...',
            actualOffer: '',
            defaultOffer: null
        };
    },
    methods: {
        setDefaultOffer: function () {
            if (this.offers.length) {
                this.defaultOffer = this.offers[0];
            }
        },
        printDefaultOffer: function () {
            if (null === this.currentTab && this.defaultOffer) {
                this.print_my_offer_services(this.defaultOffer);
                this.currentTab = this.defaultOffer.productCode;
            }
        },
        actualTabOffer: function (currentTab) {
            if ('' === currentTab) {
                throw new TypeError('Aucun onglet défini.');
            }
            let currentOffer = this.offers;
            for (let iterate of currentOffer) {
                if (iterate.name === currentTab) {
                    this.actualOffer = currentTab;
                    return this.actualOffer;
                }
            }

            return this.actualOffer;
        },
        make_agency_email: function (agency) {
            if (agency === 'Agence Aix-en-Provence') {
                agency = 'agence-aix@local.fr';
            } else if (agency) {
                agency = agency.toLowerCase().replace(' ', '-') + '@local.fr';
            } else {
                agency = null;
            }
            return agency;
        },
        send_demo: function () {
            let firstDate = this.firstDate.getMonth() + 1 + '/' + this.firstDate.getDate() + '/' + this.firstDate.getFullYear() + ' ' + this.time1;
            let secondDate = this.secondDate.getMonth() + 1 + '/' + this.secondDate.getDate() + '/' + this.secondDate.getFullYear() + ' ' + this.time2;
            if (firstDate === secondDate) {
                this.error = true;
            } else {
                this.error = false;
                axios.post(
                    process.env.LOCALETMOI_BASE_URL + '/api/mandrill/demo',
                    {
                        agency: this.salesforce.account.Agence__c || '',
                        sageCode: localStorage.getItem('sageCode'),
                        fromEmail: localStorage.getItem('login'),
                        firstDate: firstDate,
                        secondDate: secondDate,
                        demoType: this.demoType
                    },
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                ).then(response => {
                    this.$modal.hide('more-infos');
                    this.$notify({
                        group: 'mail-sent',
                        title: 'Merci !',
                        type: 'success',
                        duration: 10000,
                        text: 'Votre demande de démo a bien été envoyée !'
                    });
                }).catch(error => {
                    console.warn('error ' + error);
                });
            }
        },
        open_modal: function () {
            this.$modal.show('more-infos');
        },
        close_modal: function () {
            this.$modal.hide('more-infos');
        },
        change_to_original_info: function () {
            MenuMobile.methods.closeNav();
            if (this.isBoost) {
                this.change_to_boost_call_info();
            }
            if (this.isLocalShop || this.isLocalShopWithMigration) {
                this.change_to_localShop();
            } else {
                this.change_to_appel_info();
            }
        },
        change_to_localShop: function () {
            this.description = 'Retrouvez ici toutes les étapes de conception de votre boutique en ligne depuis la signature de notre partenariat, jusqu\'à la mise en ligne de votre site.';
        },
        change_to_appel_info: function () {
            this.description = 'Votre chargé de projet web vous appelle, afin d\'apporter des précisions sur votre entreprise, votre métier et sur l\'apparence graphique de votre site.';
        },
        change_to_appel_info_toolbox: function () {
            this.description = 'Votre chargé de projet web vous appelle, afin d\'apporter des précisions sur votre entreprise, votre métier, sur l\'apparence graphique de votre site.';
        },
        change_to_appel_info_toolbox_auto: function () {
            this.description = 'Votre chargé de projet web vous appelle, afin d\'apporter des précisions sur votre entreprise, votre métier, sur l\'apparence graphique de votre site.';
        },
        change_to_appel_localShop: function () {
            this.description = 'Votre chargé de site e-commerce vous appelle, afin de bien comprendre l\'activité de votre entreprise, votre métier, vos produits et définir ensemble l\'apparence graphique de votre site.';
        },
        change_to_conception_info: function () {
            this.description = 'Grâce aux éléments récoltés pendant l\'appel de brief, nos équipes réalisent votre site (graphisme, rédaction des contenus, intégration dans notre outil webtool, optimisation et référencement)';
        },
        change_to_conception_info_toolbox: function () {
            this.description = 'Grâce aux éléments récoltés pendant l\'appel de brief, nos équipes réalisent votre site (graphisme, rédaction des contenus, intégration dans notre outil, optimisation et référencement)';
        },
        change_to_conception_store_info: function () {
            this.description = 'Grâce aux éléments récoltés pendant l\'appel de brief, nos équipes réalisent votre boutique en ligne (graphisme, rédaction des contenus, intégration dans notre outil webtool, optimisation et référencement)';
        },
        change_to_conception_localShop_info: function () {
            this.description = 'Grâce aux éléments récoltés pendant l\'appel de brief, nos équipes réalisent votre boutique en ligne (graphisme, rédaction des contenus, intégration et optimisations).';
        },
        change_to_bat_info: function () {
            this.description = 'Nous vous envoyons par e-mail un lien pour accéder à la CREA de votre site. Il s\'agit d\'une version finalisée, en fonction des éléments que nous avons vus ensemble lors de l\'appel de brief.';
        },
        change_to_bat2_info: function () {
            this.description = '14 jours après la signature de notre partenariat, nous vous envoyons par mail un lien pour accéder à la CREA de votre site. Il s\'agit d\'une version finalisée de votre site, en fonction des éléments que nous avons vus ensemble lors de l\'appel de prise de brief.';
        },
        change_to_bat3_info_toolbox: function () {
            this.description = 'Environ un mois après la signature de notre partenariat, nous vous envoyons par mail un lien pour accéder à la CREA de votre site. Il s\'agit d\'une version finalisée de votre site, en fonction des éléments que nous avons vus ensemble lors de l\'appel de prise de brief';
        },
        change_to_livraison_info: function () {
            this.description = 'Votre chargé de projet web vous appelle afin de faire les derniers ajustements avant la mise en ligne.';
        },
        change_to_online_info: function () {
            this.description = 'Votre chargé de site e-commerce vous appelle afin de finaliser les derniers éléments techniques de votre boutique en ligne (spécificités liées à votre activité, paramétrage de paiement et de livraison, ...).';
        },
        change_to_online_localShop_info: function () {
            this.description = 'Votre chargé de site e-commerce vous appelle afin de finaliser les derniers éléments techniques de votre boutique en ligne (spécificités liées à votre activité, transfert du nom de domaine, paramétrage Paypal, paramétrage des frais de port et transporteur, mise en ligne du site).';
        },
        change_to_online2_info: function () {
            this.description = 'Vous avez validé la CREA de votre site. Votre site peut être mis en ligne.';
        },
        change_to_creation_info: function () {
            this.description = 'Nous créons et gérons pour vous un profil visibilité, vous permettant de diffuser les coordonnées de votre entreprise sur différentes plateformes (adresse, numéro de téléphone, horaires, lien du site internet)';
        },
        change_to_formation_info: function () {
            this.description = 'Vous bénéficiez d\'une formation à distance, avec un formateur agréé. 1h pour vous permettre de prendre en main l\'outil de mise à jour, et découvrir les principales fonctionnalités.';
        },
        change_to_boost_call_info: function () {
            this.description = 'Votre trafic manager vous appelle afin de bien comprendre vos besoins. Il effectue un ciblage géographique et sélectionne des mots-clés par rapport à votre activité, votre métier ainsi que vos produits. Ces éléments permettront d\'optimiser votre campagne.';
        },
        change_to_create_campaign_info: function () {
            this.description = 'Grâce à tous les éléments récoltés, il crée votre compte, rédige, réalise et planifie votre campagne Google Ads.';
        },
        change_to_following_info: function () {
            this.description = 'Votre trafic manager effectue un suivi des résultats. Vous recevez chaque mois un rapport de performance par e-mail.';
        },
        change_to_following_mailing_info: function () {
            this.description = 'Votre trafic manager effectue un suivi des résultats.';
        },
        change_to_online_store_bat_info: function () {
            this.description = 'Nous vous envoyons par e-mail un lien pour accéder à la CREA de votre boutique en ligne. Il s\'agit d\'une version finalisée, en fonction des éléments que nous avons vus ensemble lors de l\'appel de brief.';
        },
        change_to_webinar_1_bat_info: function () {
            this.description = 'Nous vous invitons à vous inscrire à un webinar pour la première partie de la formation consacrée à la présentation de la plateforme Oxatis.';
        },
        change_to_webinar_1_localShop_info: function () {
            this.description = 'Nous vous invitons à vous inscrire à la première partie de formation en participant à un webinar. Votre formation s\'effectue donc à distance sur les sujets suivants : se connecter sur votre back office, comprendre votre tableau de bord, création d\'un produit standard, etc.';
        },
        change_to_webinar_2_bat_info: function () {
            this.description = 'Nous vous invitons à vous inscrire à un webinar pour la deuxième partie de la formation sur la prise en main de la plateforme, le suivi des commandes…';
        },
        change_to_webinar_2_bat_localShop_info: function () {
            this.description = 'Nous vous invitons à vous inscrire à la deuxième partie de formation en participant à un webinar. Les sujets suivants sont abordés : prise en main de vos pages sur-mesure, suivi des commandes. Si vous n\'êtes pas disponible, vous aurez accès à la formation en replay.';
        },
        change_to_visibility_creation: function () {
            this.description = 'Nous créons et gérons pour vous un profil visibilité, vous permettant de diffuser les coordonnées de votre entreprise sur différentes plateformes (adresse, numéro de téléphone, horaires, lien du site internet, etc.)';
        },
        change_to_social_creation: function () {
            this.description = 'Vos pages Facebook entreprise et Google My Business sont créées depuis votre compte visibilité.';
        },
        change_to_pages_connexion: function () {
            this.description = 'Vos pages Facebook entreprise et Google My Business sont connectées à votre compte visibilité. La diffusion de vos coordonnées de communication en temps réel et sur les plateformes en ligne est prête !';
        },
        change_to_photo_report: function () {
            this.description = 'Nous effectuons un reportage de 10 photos professionnelles de votre établissement ainsi que 10 photos de plats. Elles seront par la suite intégrées sur votre site et sur votre compte visibilité.';
        },
        change_to_photo_report_hotel: function () {
            this.description = 'Nous effectuons un reportage de 10 photos professionnelles de votre établissement ainsi qu\'une visite virtuelle certifiée par Google. Elles seront par la suite intégrées sur votre site et sur votre compte visibilité.';
        },
        change_to_visibility_creation_and_reputation: function () {
            this.description = 'Nous créons et gérons pour vous un profil visibilité, vous permettant de diffuser les coordonnées de votre entreprise sur différentes plateformes (adresse, numéro de téléphone, horaires, lien du site internet, etc.) et répondre aux avis de vos clients.';
        },
        change_to_connexion_to_ubiflow_auto: function () {
            this.description = 'Connexion au logiciel métier ou à un outil de saisie des annonces automobiles via l\'espace Ubiflow.'
        },
        change_to_connexion_to_ubiflow_immo: function () {
            this.description = 'Connexion au logiciel métier ou à un outil de saisie des annonces immobilières via l\'espace Ubiflow.'
        },
        change_to_connexion_to_ubiflow_auto_plus: function () {
            this.description = 'Connexion au logiciel métier ou à un outil de saisie des annonces automobiles via l\'espace Ubiflow. Multi-diffusion vers plusieurs portails auto gratuits.'
        },
        change_to_connexion_to_ubiflow_immo_plus: function () {
            this.description = 'Connexion au logiciel métier ou à un outil de saisie des annonces immobilières via l\'espace Ubiflow. Multi-diffusion vers plusieurs portails immo gratuits.'
        },

        set_visible: function (offers) {
            for (var key in offers) {
                this[offers[key]] = true;
            }
        },
        set_hidden: function (offers) {
            for (var key in offers) {
                this[offers[key]] = false;
            }
        },
        /**
         * @param {object} offer
         */
        print_my_offer_services: function (offer) {
            this.signatureDate = dateHelpers.usToFrDate(offer.signatureDate);
            this.set_hidden(['responsiveDesign', 'securedNavigation', 'expertFollowing', 'statReport', 'updates', 'remoteFormation', 'visibilityOn', 'visitGuarantee', 'CrmOn', 'onlineSchedule', 'onlineScheduleMain', 'CrmOn', 'onlineSupport', 'phoneSupport', 'capacity5000', 'capacity10000', 'e_reputation', 'gift_card', 'photo_report', 'integratedProducts', 'clickAndCollect', 'securedPayment', 'isBoost', 'isCampaign', 'isEcommercePlatinum', 'isEcommercePremium', 'isLocalStart', 'isLocalPresence', 'isLocalResto', 'isLocalHotel', 'LocalAuto', 'LocalImmo', 'LocalAutoPlus', 'LocalImmoPlus', 'LocalShop', 'LocalShop avec migration', 'isLocalBoutique']);
            if (-1 !== ['LocalStart', 'LocalWeb', 'LocalVisibilité', 'LocalAudience', 'E-commerce Platinum', 'E-commerce Premium'].indexOf(offer.name)) {
                if ('LocalStart' === offer.name) {
                    this.set_visible(['isLocalStart']);
                }
                if ('LocalWeb' === offer.name) {
                    this.set_visible(['isLocalWeb']);
                }
                this.set_visible(['responsiveDesign', 'securedNavigation', 'expertFollowing', 'statReport', 'updates', 'remoteFormation']);
            }
            if ('LocalAgenda' === offer.name) {
                this.set_visible(['responsiveDesign', 'securedNavigation', 'expertFollowing', 'statReport', 'updates', 'remoteFormation', 'visibilityOn', 'onlineScheduleMain', 'CrmOn']);
            }
            if ('LocalVisibilité' === offer.name) {
                this.set_visible(['visibilityOn']);
            }
            if ('LocalAudience' === offer.name) {
                this.set_visible(['visibilityOn', 'visitGuarantee']);
            }
            if (-1 !== ['LocalBoost', 'LocalBoost+', 'Campagne sur mesure'].indexOf(offer.name)) {
                if ('LocalBoostMesure' === offer.name) {
                    this.set_visible(['isCampaign']);
                }
                this.set_visible(['isBoost', 'expertFollowing', 'statReport', 'visitGuarantee']);
            }
            if ('E-commerce Platinum' === offer.name) {
                this.set_visible(['onlineSupport', 'capacity5000', 'isEcommercePlatinum']);
            }
            if ('E-commerce Premium' === offer.name) {
                this.set_visible(['onlineSupport', 'capacity10000', 'phoneSupport', 'isEcommercePremium']);
            }
            if ('LocalPrésence' === offer.name) {
                this.set_visible(['expertFollowing', 'visibilityOn', 'visitGuarantee', 'isLocalPresence']);
            }
            if ('LocalResto' === offer.name) {
                this.set_visible(['isLocalResto', 'responsiveDesign', 'photo_report', 'gift_card', 'onlineSchedule', 'expertFollowing', 'statReport', 'updates', 'visibilityOn', 'remoteFormation', 'e_reputation']);
            }
            if ('LocalHôtel' === offer.name) {
                this.set_visible(['isLocalHotel', 'responsiveDesign', 'photo_report', 'gift_card', 'onlineSchedule', 'expertFollowing', 'statReport', 'updates', 'visibilityOn', 'remoteFormation', 'e_reputation']);
            }
            if ('LocalAuto' === offer.name) {
                this.set_visible(['isLocalAuto', 'responsiveDesign', 'expertFollowing', 'updates', 'statReport', 'remoteFormation', 'visibilityOn', 'adAuto']);
            }
            if ('LocalImmo' === offer.name) {
                this.set_visible(['isLocalImmo', 'responsiveDesign', 'expertFollowing', 'updates', 'statReport', 'remoteFormation', 'visibilityOn', 'adImmo']);
            }
            if ('LocalAutoPlus' === offer.name) {
                this.set_visible(['isLocalAutoPlus', 'responsiveDesign', 'expertFollowing', 'updates', 'statReport', 'remoteFormation', 'visibilityOn', 'adAuto', 'multiDiffusion']);
            }
            if ('LocalImmoPlus' === offer.name) {
                this.set_visible(['isLocalImmoPlus', 'responsiveDesign', 'expertFollowing', 'updates', 'statReport', 'remoteFormation', 'visibilityOn', 'adImmo', 'multiDiffusion']);
            }
            if ('LocalShop' === offer.name) {
                this.set_visible(['isLocalShop', 'responsiveDesign', 'expertFollowing', 'updates', 'statReport', 'remoteFormation', 'visibilityOn', 'onlineSupport', 'phoneSupport']);
            }
            if ('LocalShop avec migration' === offer.name) {
                this.set_visible(['isLocalShopWithMigration', 'responsiveDesign', 'expertFollowing', 'updates', 'statReport', 'remoteFormation', 'visibilityOn','onlineSupport', 'phoneSupport', 'migration']);
            }
            if ('LocalBoutique' === offer.name) {
                this.set_visible(['isLocalBoutique', 'responsiveDesign', 'expertFollowing', 'statReport', 'remoteFormation', 'visibilityOn', 'integratedProducts', 'clickAndCollect', 'securedPayment']);
            }
            this.change_to_original_info();
        }
    }
};
</script>
