// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import App from './App';
import { store } from './_store';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import Notifications from 'vue-notification';
import VModal from 'vue-js-modal';
import ReadMore from 'vue-read-more';
import VueGtag from "vue-gtag";
import DateRangePicker from 'vue2-daterange-picker'
//you need to import the CSS manually

import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'


import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'v-calendar/lib/v-calendar.min.css';
import 'bootstrap/dist/css/bootstrap.css';

import MainHeader from '@/components/MainHeader.vue';
import HeaderButtons from '@/components/HeaderButtons.vue';
import HeaderGeneral from '@/components/HeaderGeneral';
import HeaderMenu from '@/components/HeaderMenu';
import Footer from '@/components/Footer';
import MenuFormation from '@/components/MenuFormation';
import DropdownMenu from '@/components/DropdownMenu';
import MenuMobile from '@/components/MenuMobile';
import CustomerRef from '@/components/CustomerRef';
import VCalendar from 'v-calendar';
import MenuProfile from '@/components/MenuProfile.vue';
import VueTour from 'vue-tour';
import { ValidationProvider, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/fr.json';
import { configure } from 'vee-validate';
import vueDebounce from 'vue-debounce';
import VueProgressBar from 'vue-progressbar'

const options = {
    color: '#EC008C',
    failedColor: '#ea3356',
    thickness: '12px',
    transition: {
        speed: '1s',
        opacity: '0.8s',
        termination: 500
    },
    autoRevert: true,
    location: 'top',
    inverse: false,
}

Object.keys(rules).forEach(rule => {
    extend(rule, {
        ...rules[rule], // copies rule configuration
        message: messages[rule] // assign message
    });
});

configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid',
    }
})


Vue.use(VCalendar, {
    firstDayOfWeek: 2
});
Vue.use(BootstrapVue, {
    BFormTags: {
        addButtonText: "Ajouter",
        invalidTagText: "Veuillez saisir au minimum 3 caractères",
        placeholder: "Ajouter un mot clé",
    },
    BFormDatepicker: {
        locale: 'fr',
        startWeekday: 1,
        placeholder: "Aucune date sélectionnée",
        labelNoDateSelected: "Aucune date sélectionnée",
        labelCurrentMonth: "Mois courant",
        labelPrevDecade: "Jour précédent",
        labelPrevMonth: "Mois précédent",
        labelPrevYear: "Année précédente",
        labelNextDecade: "Jour suivant",
        labelNextMonth: "Mois suivant",
        labelNextYear: "Année suivante",
        labelHelp: "Utilisez les flèches pour naviguer dans le calendrier"
    }
});
Vue.use(Notifications);
Vue.use(VModal);
Vue.use(VModal, { dialog: true });
Vue.use(ReadMore);
Vue.use(DateRangePicker);
Vue.use(VueTour);
Vue.use(VueProgressBar, options);
Vue.use(VueGtag, {
    config: { id: process.env.GOOGLE_ANALYTICS_ID },
    enabled: false
});
Vue.use(vueDebounce, {
    listenTo: ['input'],
    defaultTime: '300ms'
})

Vue.component('app-mainheader', MainHeader);
Vue.component('app-headermenu', HeaderMenu);
Vue.component('app-headergeneral', HeaderGeneral);
Vue.component('app-menuprofile', MenuProfile);
Vue.component('app-footer', Footer);
Vue.component('app-headerbuttons', HeaderButtons);
Vue.component('app-menuformation', MenuFormation);
Vue.component('app-dropdownmenu', DropdownMenu);
Vue.component('app-menumobile', MenuMobile);
Vue.component('app-customerRef', CustomerRef);
Vue.component('ValidationProvider', ValidationProvider);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
