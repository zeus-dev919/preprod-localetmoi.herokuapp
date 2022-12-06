import Vue from 'vue';
import Router from 'vue-router';
import { userService } from '@/_services';
import Authentication from '@/components/Authentication';
import Accueil from '@/components/Accueil';
import Site from '@/components/Site';
import Profile from '@/components/Profile';
import NotFound from '@/components/NotFound';
import Documents from '@/components/Documents';
import TicketsList from '@/components/ticket/List';
import TicketCreation from '@/components/ticket/Create';
import TicketAttachment from '@/components/ticket/Attachment';
import Campagne from '@/components/Campagne';
import Audience from '@/components/Audience';
import LocalBroadcast from '@/components/LocalBroadcast';
import CreateAccount from '@/components/CreateAccount';
import Messages from '@/components/Messages';
import Newsletter from '@/components/Newsletter';
import Presentation from '@/components/Presentation';
import Tutorial from '@/components/Tutorial';
import Cgu from '@/components/Cgu';
import Impersonate from '@/components/Impersonate';
import EspacePartage from '@/components/EspacePartage';
import SalesforceAutologin from '@/components/SalesforceAutologin';
import Qrcode from "@/components/Qrcode";
import PartnershipFolder from '@/components/PartnershipFolder/PartnershipFolder';
import BackOfficeIndex from '@/components/BackOffice/Index';
import BackOfficePartnershipFolder from '@/components/BackOffice/PartnershipFolder';
import Cookie from '@/components/Cookies/Cookie';
import { account } from "../_store/account.store";
import { authDpHelper } from "../_helpers";

Vue.use(Router);

const router = new Router({
    mode: 'hash',
    routes: [
        {
            path: '/authentification',
            name: 'Authentication',
            component: Authentication,
            meta: {
                isPublic: true
            }
        },
        {
            path: '/',
            name: 'Root',
            component: Accueil,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/impersonate/:email',
            name: 'Impersonate',
            component: Impersonate,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/accueil',
            name: 'Accueil',
            component: Accueil,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/presence/site',
            name: 'Site',
            component: Site,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/presence/qrcode',
            name: 'Qrcode',
            component: Qrcode,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/profil',
            name: 'Profil',
            component: Profile,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/performance/audience',
            name: 'Audience',
            component: Audience,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/performance/localBroadcast',
            name: 'LocalBroadcast',
            component: LocalBroadcast,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/demandes',
            name: 'TicketsList',
            component: TicketsList,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/demandes/attachment/:folder/:filename',
            name: 'TicketAttachment',
            component: TicketAttachment,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/demandes/attachment/:folder/:subfolder/:filename',
            name: 'TicketAttachment',
            component: TicketAttachment,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/demandes/attachment/:customerCodeRange/:folder/:subfolder/:filename',
            name: 'TicketAttachment',
            component: TicketAttachment,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/demandes/creer',
            name: 'TicketCreation',
            component: TicketCreation,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/404',
            component: NotFound,
            meta: {
                isPublic: true
            }
        },
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/create-account',
            name: 'CreateAccount',
            component: CreateAccount,
            meta: {
                isPublic: true
            }
        },
        {
            path: '/documents',
            name: 'Documents',
            component: Documents,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/presence/campagne',
            name: 'Campagne',
            component: Campagne,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/performance/messages',
            name: 'Messages',
            component: Messages,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/performance/newsletter',
            name: 'Newsletter',
            component: Newsletter,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/aide/presentation',
            name: 'Presentation',
            component: Presentation,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/aide/tutorial',
            name: 'Tutorial',
            component: Tutorial,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/cgu',
            name: 'Cgu',
            component: Cgu,
            meta: {
                isPublic: true
            }
        },
        {
            path: '/Cookies',
            name: 'Cookie',
            component: Cookie,
            meta: {
                isPublic: true
            }
        },
        {
            path: '/autologin',
            name: 'SalesforceAutologin',
            component: SalesforceAutologin,
            meta: {
                isPublic: true
            }
        },
        {
            path: '/espace-partage/:customerCode',
            name: 'EspacePartage',
            component: EspacePartage,
            meta: {
                isPublic: false
            },
            beforeEnter: (to, from, next) => {
                const identity = account.state.identity;
                const isUser = authDpHelper.isUser(identity);
                const isGranted = authDpHelper.isSuperAdmin(identity) || (authDpHelper.isSalesman(identity));
                const customerCode = to.params.customerCode ? parseInt(to.params.customerCode) : null;
                if (customerCode && identity
                    && (isGranted || (isUser && identity.partners.some(partner => customerCode === partner.customerCode)))
                ) {
                    return next();
                }

                next(isUser ? '/' : '/backoffice');
            }
        },
        {
            path: '/dossier-partenaire',
            name: 'Dossier Partenaire',
            component: PartnershipFolder,
            meta: {
                isPublic: false
            }
        },
        {
            path: '/backoffice',
            name: 'BackOffice',
            component: BackOfficeIndex,
            meta: {
                isPublic: false
            },
            beforeEnter: (to, from, next) => {
                let nextParam = '';
                if (to.query && to.query.customerCode) {
                    const nextUrl = encodeURIComponent(`/backoffice?customerCode=${to.query.customerCode}`);
                    nextParam = `?next=${nextUrl}`;
                }
                next(!account.state.identity || authDpHelper.isUser(account.state.identity)
                    ? `/authentification${nextParam}`
                    : undefined
                );
            }
        },
        {
            path: '/backoffice/dossier-partenaire/:customerCode',
            name: 'BackOfficePartnershipFolder',
            component: BackOfficePartnershipFolder,
            meta: {
                isPublic: false
            }
        }
        /*
        //  @Todo
        //  Routes for coming pages
        */
        // {
        //     path: '/rdv',
        //     name: 'Rdv',
        //     component: Rdv
        // },
        // {
        //     path: '/formation',
        //     name: 'Formation',
        //     component: Formation
        // },
        // {
        //     path: '/localfid',
        //     name: 'LocalFid',
        //     component: LocalFid
        // },
        // {
        //     path: '/performance',
        //     name: 'Performance',
        //     component: Performance
        // },
        // {
        //     path: '/resetpassword',
        //     name: 'ResetPassword',
        //     component: ResetPassword
        // },
        // {
        //     path: '/presence/communication',
        //     name: 'Communication',
        //     component: Communication
        // },
        // {
        //     path: '/performance/statsdetails',
        //     name: 'Details',
        //     component: StatsDetails
        // },
        // {
        //     path: '/aide',
        //     name: 'Aide',
        //     component: Aide
        // }
    ]
});

router.beforeEach((to, from, next) => {
    window[`ga-disable-${process.env.GOOGLE_ANALYTICS_ID}`] = !account.state.status.performanceCookie;
    // On a protected route
    if (to.matched.some(record => !record.meta.isPublic)) {
        // User is authenticated
        if (userService.checkToken()) {
            userService.refreshToken();
            next();
        // User is not authenticated
        } else {
            if ('/authentification' !== to.path) {
                let params = new URLSearchParams(to.query).toString();
                next({
                    path: '/authentification',
                    query: {
                        next: `${to.path}?${params}`
                    }
                });
            } else {
                next();
            }
        }
    // On a public route
    } else {
        next();
    }
});

export default router;
