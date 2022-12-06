const defaultDuration = 10000;

const state = {
    duration: defaultDuration,
    group: null,
    message: null,
    show: false,
    title: null,
    type: null
};

const actions = {
    success ({ commit }, options) {
        commit('success', options);
    },
    error ({ commit }, options) {
        commit('error', options);
    },
    warn ({ commit }, options) {
        commit('warn', options);
    },
    clear ({ commit }) {
        commit('clear');
    }
};

const mutations = {
    success (state, options) {
        state.duration = options.duration || defaultDuration;
        state.group = options.group;
        state.message = options.message;
        state.show = true;
        state.title = options.title;
        state.type = 'success';
    },
    error (state, options) {
        state.duration = options.duration || defaultDuration;
        state.group = options.group;
        state.message = options.message;
        state.show = true;
        state.title = options.title;
        state.type = 'error';
    },
    warn (state, options) {
        state.duration = options.duration || defaultDuration;
        state.group = options.group;
        state.message = options.message;
        state.show = true;
        state.title = options.title;
        state.type = 'warn';
    },
    clear (state) {
        state.duration = defaultDuration;
        state.group = null;
        state.message = null;
        state.show = false;
        state.title = null;
        state.type = null;
    },
    disableNotify (state) {
        state.show = false;
    }
};

export const alert = {
    namespaced: true,
    state,
    actions,
    mutations
};
