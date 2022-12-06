import { cookieService } from "../_services";
import { mapState } from "vuex";
import { store } from '../_store';

export default {
    computed: {
        ...mapState({
            performanceCookie: state => state.account.status.performanceCookie,
            targetingCookie: state => state.account.status.targetingCookie,
        }),
        performance : {
            get() {
                return this.performanceCookie;
            },
            set(value) {
                store.commit('account/setPerformanceCookie', value);
                this.refreshCookies();
                if (!value) {
                    // https://github.com/MatteoGabriele/vue-analytics/issues/145 we have to remove the cookies manually 
                    // https://github.com/MatteoGabriele/vue-gtag/issues/44 we have to the cookies remove manually 
                    // https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out we have to the cookies remove manually 
                    this.$gtag.optOut();
                    window[`ga-disable-${process.env.GOOGLE_ANALYTICS_ID}`] = true;
                } else {
                    this.$gtag.optIn();
                }
            }
        },
        targeting : {
            get() {
                return this.targetingCookie;
            },
            set(value) {
                this.refreshCookies();
                store.commit('account/setTargetingCookie', value);
            }
        }
    },
    mounted() {
        this.cookies = cookieService.getCookies();
        const cookiesKeys = Object.keys(this.cookies);
        // to test if the object is empty or not
        if (cookiesKeys.length) {
            cookiesKeys.forEach(key => {
                this[key] = this.cookies[key];
            });
        }
    },
    data() {
        return {
            cookieNames: ['performance', 'targeting'],
            cookies: {}
        };
    },
    methods: {
        updateCookie(cookieName, value) {
            this[cookieName] = value;
            cookieService.setCookie(cookieName, value);
        },
        denyOrAcceptAllCookies(value) {
            this.cookieNames.forEach(cookieName => {
                this.updateCookie(cookieName, value);
            });
        },
        refreshCookies() {
            this.cookies = cookieService.getCookies();
        }
    }
}
