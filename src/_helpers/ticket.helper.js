export const ticketHelpers = {
    getTicketTypes,
    getAvailableTicketTypes,
    findTicketCategory,
    findTicketType,
};

function getTicketTypes() {
    return {
        '01 CREA SITE': {
            'Logo': 'Modifications à réaliser pour mon logo',
            'Corrections CREA/Validé': 'Valider la mise en ligne de mon site',
            'Corrections CREA/minimes (-30 min)': 'Transmettre des modifications simples',
            'Corrections CREA/importantes (1h30 )': 'Transmettre des modifications importantes',
            'Corrections CREA refonte': 'Revoir entièrement la proposition de site transmise',
        },
        '02 MAJ SITE': {
            'Corrections MAJ/minimes (-30 min)': 'Transmettre des modifications simples',
            'Corrections MAJ/importantes (1h30 )': 'Transmettre des modifications importantes',
            'Corrections MAJ refonte': 'Refonte de mon site',
        },
        '03 AUDIENCE': {
            'Référencement/SEO': 'Au sujet de mon référencement',
            'Référencement/SEM': 'Au sujet de ma campagne Google Ads',
            'Fiche GMB / Facebook / Visibilité': 'Une question sur mon compte visibilité',
        },
        '04 TECHNIQUE': {
            'NDD / mails / https': 'Une question sur mon Nom de domaine',
            'Libération NDD': 'Libération de NDD',
            'Demande technique': 'Demande technique',
            'Moyen de paiement / Widget': 'Activer un moyen de paiement',
        },
        '05 DIVERS': {
            'Accès Local&moi': 'Une question sur mon espace Local&moi',
            'Assistance / Tutos sur nos CMS': 'Besoin d\'une assistance pour mettre à jour mon site',
            'Formations': 'Besoin d\'une formation',
            'Demande de RDV Téléphonique': 'Demande de rappel',
            'Autres': 'Autres'
        }
    };
}

function getAvailableTicketTypes(isWebsiteOnline) {
    let availableTypes = [];
    let ticketTypes = getTicketTypes();
    Object.keys(ticketTypes).forEach(currentCategory => {
        if (('01 CREA SITE' === currentCategory && isWebsiteOnline)
            || ('02 MAJ SITE' === currentCategory && !isWebsiteOnline)
        ) {
            return;
        }
        availableTypes = [
            ...availableTypes,
            ...Object.values(ticketTypes[currentCategory])
        ];
    });

    return availableTypes.filter((value, index, self) => self.indexOf(value) === index);
}

function findTicketCategory(ticketType, isWebsiteOnline) {
    let ticketTypes = getTicketTypes();
    return Object.keys(ticketTypes).find(currentCategory => {
        if (('01 CREA SITE' === currentCategory && isWebsiteOnline)
            || ('01 MAJ SITE' === currentCategory && !isWebsiteOnline)
        ) {
            return false;
        }

        return -1 !== Object.values(ticketTypes[currentCategory]).indexOf(ticketType);
    });
}

function findTicketType(ticketType, isWebsiteOnline) {
    let ticketTypes = getTicketTypes();
    let typeFound = null;

    Object.keys(ticketTypes).some(currentCategory => {
        if (('01 CREA SITE' === currentCategory && isWebsiteOnline)
            || ('01 MAJ SITE' === currentCategory && !isWebsiteOnline)
        ) {
            return false;
        }

        let index = Object.values(ticketTypes[currentCategory]).indexOf(ticketType);
        if (-1 !== index) {
            typeFound = Object.keys(ticketTypes[currentCategory])[index];
            return true;
        }

        return false;
    });

    return typeFound;
}
