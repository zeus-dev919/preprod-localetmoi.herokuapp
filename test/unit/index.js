import Vue from 'vue';
import VueCookies from 'vue-cookies';

import BootstrapVue from 'bootstrap-vue';
import Notifications from 'vue-notification';
import VModal from 'vue-js-modal';
import VueSession from 'vue-session';
import ReadMore from 'vue-read-more';
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

Vue.use(VCalendar, {
    firstDayOfWeek: 2
});
Vue.use(BootstrapVue);
Vue.use(VueCookies);
Vue.use(Notifications);
Vue.use(VModal);
Vue.use(VModal, { dialog: true });
Vue.use(VueSession);
Vue.use(ReadMore);
Vue.use(VueTour);
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
Vue.use(VueCookies);


Vue.config.productionTip = false;

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/);
srcContext.keys().forEach(srcContext);
