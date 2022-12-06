export let optionTransformer = function(value) {
    return {
        text: value,
        value: value,
    }
};
export let optionTransformerSkipFirst = function(value, index) {
    return { text: value, value: 0 === index ? null : value}
};

export const partnerRelations = [
    'paymentModes',
    'deliveryModes',
    'sites',
    'campaignOptions',
    'openingRanges',
    'socialNetworks',
    'portals',
    'bookEngines',
    'shopProducts',
    'footages',
    'spokenLanguages'
];

export const siteRelations = [
    'siteTrees',
    'banners',
    'languages'
];

export const localCampaignControls = [
    {
        month: 0,
        label: 'Janvier',
        subject: null,
    },
    {
        month: 1,
        label: 'Février',
        subject: null,
    },
    {
        month: 2,
        label: 'Mars',
        subject: null,
    },
    {
        month: 3,
        label: 'Avril',
        subject: null,
    },
    {
        month: 4,
        label: 'Mai',
        subject: null,
    },
    {
        month: 5,
        label: 'Juin',
        subject: null,
    },
    {
        month: 6,
        label: 'Juillet',
        subject: null,
    },
    {
        month: 7,
        label: 'Août',
        subject: null,
    },
    {
        month: 8,
        label: 'Septembre',
        subject: null,
    },
    {
        month: 9,
        label: 'Octobre',
        subject: null,
    },
    {
        month: 10,
        label: 'Novembre',
        subject: null,
    },
    {
        month: 11,
        label: 'Décembre',
        subject: null,
    }
];

export const weekDays = [
    { value: 1, text: 'Lundi'},
    { value: 2, text: 'Mardi'},
    { value: 3, text: 'Mercredi'},
    { value: 4, text: 'Jeudi'},
    { value: 5, text: 'Vendredi'},
    { value: 6, text: 'Samedi'},
    { value: 7, text: 'Dimanche'},
];

export const dayPeriods = [
    { value: 'AM', text: 'Matin'},
    { value: 'PM', text: 'Après-midi'},
];

export const openCloseDate = [
    { value: true, text: 'Ouvert'},
    { value: false, text: 'Fermé'},
];

export const yesNoOptions = [
    { text: 'Non', value: false },
    { text: 'Oui', value: true }
];

export const hotelEngineOptions = [
    'Availpro',
    'Betisoft',
    'Family Hotel',
    'Idiso',
    'KE-Booking',
    'Novaresa',
    'Octorate',
    'Resalys',
    'Reservit',
    'Roomcloud',
    'Simple booking',
    'Siteminder',
    'Thais-Soft',
    'Vertical Booking',
    'Wubook',
    ''
].map(optionTransformer);

export const restoEngineOptions = [
    'Libro',
    'Reservit',
    'Guestonline',
    ''
].map(optionTransformer);

export const noSiteCauseList = [
    'Temps',
    'Budget',
].map(optionTransformer);

export const noSiteObjectiveList = [
    'Visibilité',
    'Crédibilité',
].map(optionTransformer);

export const noEngineOptions = [
    'Créer un formulaire simple',
    'Afficher uniquement le numéro de téléphone',
].map(optionTransformer);

export const availableLanguages = [
    { value: 'en', text: 'Anglais'},
    { value: 'de', text: 'Allemand'},
    { value: 'es', text: 'Espagnol'},
    { value: 'it', text: 'Italien'},
];

export const availableSpokenLanguages = [
    ...availableLanguages,
    { value: 'ru', text: 'Russe'},
    { value: 'pt', text: 'Portugais'},
    { value: 'nl', text: 'Néerlandais'},
    { value: 'other', text: 'Autre'}
];

export const translateOptions = [
    { value: false, text: 'Contenus fournis'},
    { value: true, text: 'Contenus traduits par local.fr'},
];

export const paymentMethods = [
    'Visa',
    'Master Card',
    'American Express',
    'Carte bleue',
    'Visa Electron',
    'Paypal',
    'Chèque',
    'Espèces',
    'Chèques vacances',
].map(optionTransformer);

export const newBoutiquePaymentMeth = [
    'En ligne',
    'En magasin'
].map(optionTransformer);

export const tedsDeliveryModes = [
    'Tarif unique',
    'Tarif au km',
    'Poids au colis',
    'Valeur du colis',
    'Boxtal',
].map(optionTransformer);

export const tedsPaymentTypes = [
    { value: 'Stripe', text: 'Stripe' },
    { value: 'Viva Wallet', text: 'Viva Wallet' },
    { value: 'Paypal', text: 'Paypal' },
    { value: 'Aucun', text: 'Aucun moyen de paiement' },
];

export const oldBoutiquePaymentMeth = [
    'Virement',
    'Chèque',
    'Espèce (Click&Collect)',
    'CB (Stripe)',
].map(optionTransformer);

export const boutiqueDeliveryMeth = [
    'Email (bons cadeaux)',
    'En boutique (Click&Collect)',
    'À domicile',
].map(optionTransformer);

export const homeDelivery = [
    'Livraison par vos soins',
    'Transporteur de votre choix',
].map(optionTransformer);

export const transporterOptions = [
    'Au poids',
    'Au panier',
].map(optionTransformer);

export const excelProductList = {
    title: 'Remplissez le fichier Excel transmis et listez les produits (20 max) que vous souhaitez que l\'on mette en place pour la livraison de votre boutique. Pour chacun de vos produits, il nous faudra :',
    file: 'assets/files/parntership-file/E-commerce.xlsx',
    columns: [
        'Une catégorie et sous-catégorie si nécessaire',
        'Un nom de produit',
        'Une ou des photos au format JPEG ou PNG (4 maximum par produit)',
        'Un code article (obligatoire pour que chaque produit puisse être facilement reconnaissable au moment de la commande, il s\'agira d\'un code unique par article, code barre, référence produit)',
        'Un tarif',
        'Un poids (si vous optez pour une livraison Colissimo)',
        'Un stock',
        'Un ou plusieurs modes de livraison'
    ],
    titleLocalShop: 'Envoyez 10 fiches produits avec ',
    columnsLocalShop: [
        'Des images (3 en moyenne)',
        'Un nom',
        'Un prix',
        'Un résumé',
        'Une description longue',
        'Une marque',
        'Des catégories associées (3 maximum)',
        'Des options (taille par exemple)'
    ],
    fileLocalShop: 'assets/files/parntership-file/Matrice_DossierPartenaire_V4.xlsx'
}

export const commonPortals = [
    'LeBonCoin',
    'ParuVendu',
    'Autre'
].map(optionTransformer);

export const autoPortals = [
    'La centrale',
].map(optionTransformer);

export const immoPortals = [
    'Se Loger',
].map(optionTransformer);

export const shopPaymentMethods = [
    'Paypal Pro',
    'Payplug',
    'Virements',
    'Banque',
].map(optionTransformer);

export const shopDeliveryMethods = [
    'Chronopost',
    'Colissimo',
    'DPD',
    'Mondial Relay',
    'Retrait en boutique',
    'Autre(s)',
].map(optionTransformer);

export const restoDeliveryMethods = [
    {
        value: 'Deliveroo',
        text: 'Lien de votre profil Deliveroo',
    },
    {
        value: 'Just Eat',
        text: 'Lien de votre profil Just Eat',
    },
    {
        value: 'Uber Eats',
        text: 'Lien de votre profil Uber Eats',
    },
];

export const specificParameterChoices = [
    'Office 365',
    'Google', 
    'Exchange', 
    'Autre',
].map(optionTransformer);

export const hasPrestashopChoice = [
    'Prestashop',
    'Fichier Excel',
    'Fichier CSV'
].map(optionTransformer);

export const hasLogoChoice = [
    'Oui',
    'Non'
].map(optionTransformer);

export const todoWithLogoOptions = [
    'Oui',
    'Non'
].map(optionTransformer);

export const footages = [
    'Reportage 10 photos',
    'Reportage 10 photos + vidéos 60s',
    'Reportage 10 photos + visite virtuelle',
    'Reportage 20 photos',
].map(optionTransformer);

export const socialNetworkOptions = [
    'Google My Business',
    'Facebook',
    'Twitter',
    'TripAdvisor',
    'Instagram',
    'Youtube',
    'LinkedIn',
    'Pinterest',
].map(optionTransformer);

export const agendaRoleList = [
    'Choisir un rôle',
    'Administration',
    'Planifier',
    'Visualiser',
].map(optionTransformerSkipFirst);

export const agendaTimeTypeList = [
    'Choisir un type',
    'Minutes',
    'Heures',
    'Jours',
    'Semaines',
].map(optionTransformerSkipFirst);

export const agendaSyncCalendarList = [
    'Outlook',
    'Google Calendar',
    'Windows Live',
    'Autre'
].map(optionTransformer);

export const memberType = [
    'Manager',
    'Équipier',
].map(optionTransformer);

export const visioServiceExist = [
    'Sur place',
    'En visio',
].map(optionTransformer);

export const availableVats = [
    '0',
    '5,5',
    '10',
    '20',
].map(optionTransformer);

export const registrarLevelsMapping = [
    {
        registrarEmail: false,
        specificParameters: false,
    },
    {
        registrar: 'OVH',
        registrarEmail: true,
        specificParameters: false,
    },
    {
        registrar: 'other',
        registrarEmail: true,
        specificParameters: false,
    },
    {
        specificParameters: true,
    },
];
