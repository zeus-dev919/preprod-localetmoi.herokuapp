import Vue from 'vue';
import Vuex from 'vuex';

import { alert } from './alert.store';
import { account } from './account.store';
import { globalStore } from './global.store';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        account,
        alert,
        globalStore
    }
});
