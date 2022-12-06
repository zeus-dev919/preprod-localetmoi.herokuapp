import {requestHelpers} from '@/_helpers';

export const localfrApiService = {
    getPartner,
    getPaymentModes: () => getEntityList('payment_modes', {
        'fields[]': 'name'
    }),
    getLanguages: () => getEntityList('languages'),
    getPortals: () => getEntityList('portals'),
    updatePartner: (id, data) => updateEntity('partners', id, data),
    updatePartnerAutoImmo: (id, data) => updateEntity('partner_auto_immos', id, data),
    updatePartnerHotelResto: (id, data) => updateEntity('partner_hotel_restos', id, data),
    updatePartnerBoutique: (id, data) => updateEntity('partner_boutiques', id, data),
    updatePartnerShop: (id, data) => updateEntity('partner_shops', id, data),
    updateSite: (id, data) => updateEntity('sites', id, data),
    updateBookEngine: (id, data) => updateEntity('book_engines', id, data),
    updateBanner: (id, data) => updateEntity('banners', id, data),
    updateSiteTree: (id, data) => updateEntity('site_trees', id, data),
    updateFeeDetail: (id, data) => updateEntity('fee_details', id, data),
    updateFootage: (id, data) => updateEntity('footages', id, data),
    updateSocialNetwork: (id, data) => updateEntity('social_networks', id, data),
    updateCampaignOption: (id, data) => updateEntity('campaign_options', id, data),
    updateDeliveryMode: (id, data) => updateEntity('delivery_modes', id, data),
    updateOpeningRange: (id, data) => updateEntity('opening_ranges', id, data),
    updateAgenda: (id, data) => updateEntity('agendas', id, data),
    updateAgendaService: (id, data) => updateEntity('agenda_services', id, data),
    updateAgendaResource: (id, data) => updateEntity('agenda_resources', id, data),
    updateAgendaMember: (id, data) => updateEntity('agenda_members', id, data),
    updateAgendaVisio: (id, data) => updateEntity('agenda_visios', id, data),
    updatePartnerHistory: (id, data) => updateEntity('partner_histories', id, data),
    updateNote: (id, data) => updateEntity('notes', id, data),
    updateBookingService: (id, data) => updateEntity('booking_services', id, data),
    updateBookingTimeRange: (id, data) => updateEntity('booking_time_ranges', id, data),

    createCampaignOption: (data) => createEntity('campaign_options', data),
    createPartnerShop: (data) => createEntity('partner_shops', data),
    createPartnerAutoImmo: (data) => createEntity('partner_auto_immos', data),
    createPartnerHotelResto: (data) => createEntity('partner_hotel_restos', data),
    createPartnerBoutique: (data) => createEntity('partner_boutiques', data),
    createSite: (data) => createEntity('sites', data),
    createSiteTree: (data) => createEntity('site_trees', data),
    createDeliveryMode: (data) => createEntity('delivery_modes', data),
    createFeeDetail: (data) => createEntity('fee_details', data),
    createFootage: (data) => createEntity('footages', data),
    createBanner: (data) => createEntity('banners', data),
    createOpeningRange: (data) => createEntity('opening_ranges', data),
    createSocialNetwork: (data) => createEntity('social_networks', data),
    createAgendaService: (data) => createEntity('agenda_services', data),
    createAgendaResource: (data) => createEntity('agenda_resources', data),
    createAgendaMember: (data) => createEntity('agenda_members', data),
    createAgendaVisio: (data) => createEntity('agenda_visios', data),
    createPartnerHistory: (data) => createEntity('partner_histories', data),
    createNote: (data) => createEntity('notes', data),
    createBookingService: (data) => createEntity('booking_services', data),
    createBookingTimeRange: (data) => createEntity('booking_time_ranges', data),

    deleteCampaignOption: (data) => deleteEntity('campaign_options', data),
    deleteSiteTree: (data) => deleteEntity('site_trees', data),
    deleteFeeDetail: (data) => deleteEntity('fee_details', data),
    deleteFootage: (data) => deleteEntity('footages', data),
    deleteOpeningRange: (data) => deleteEntity('opening_ranges', data),
    deleteDeliveryMode: (data) => deleteEntity('delivery_modes', data),
    deleteAgendaService: (data) => deleteEntity('agenda_services', data),
    deleteAgendaResource: (data) => deleteEntity('agenda_resources', data),
    deleteAgendaMember: (data) => deleteEntity('agenda_members', data),
    deleteAgendaVisio: (data) => deleteEntity('agenda_visios', data),
    deletePartnerHistory: (data) => deleteEntity('partner_histories', data),
    deleteNote: (data) => deleteEntity('notes', data),
    deleteBookingService: (data) => deleteEntity('booking_services', data),
    deleteBookingTimeRange: (data) => deleteEntity('booking_time_ranges', data),
};

function updateEntity(entityService, id, data) {
    return requestHelpers.securedAxiosInstance.patch(
        `${process.env.LOCALFR_API_BASE_URL}/api/${entityService}/${id}`,
        data,
        {
            headers: {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/merge-patch+json'
            }
        }
    );
}

function getPartner(customerCode) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALFR_API_BASE_URL}/api/partners?customerCode=${customerCode}`,
        {
            headers: {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            }
        }
    );
}

function getEntityList(entityService, params) {
    return requestHelpers.securedAxiosInstance.get(
        `${process.env.LOCALFR_API_BASE_URL}/api/${entityService}`,
        {
            headers: {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            },
            params
        }
    );
}

function createEntity(entityService, data) {
    let dataToSend = Object.assign({}, data);
    Object.keys(dataToSend).forEach(key => {
        if (Array.isArray(dataToSend[key])
            && 1 === dataToSend[key].length
            && 'object' === typeof dataToSend[key][0]
            && null !== dataToSend[key][0]
            && !Object.keys(dataToSend[key][0]).length
        ) {
            dataToSend[key] = [];
        }
    });

    return requestHelpers.securedAxiosInstance.post(
        `${process.env.LOCALFR_API_BASE_URL}/api/${entityService}`,
        dataToSend,
        {
            headers: {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            }
        }
    );
}

function deleteEntity(entityService, id) {
    return requestHelpers.securedAxiosInstance.delete(
        `${process.env.LOCALFR_API_BASE_URL}/api/${entityService}/${id}`,
        {
            headers: {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            }
        }
    );
}
