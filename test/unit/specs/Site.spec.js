import Site from '@/components/Site';
import axios from 'axios';

describe('Site', () => {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    var axiosStub;
    var sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        axiosStub = sandbox.stub(axios, 'get');
    });

    afterEach(() => {
        axiosStub.restore();
    });

    after(() => {
        sandbox.restore();
    });

    it('Make Agency Email for Lyon', () => {
        const agency = 'Agence Lyon';
        expect(Site.methods.make_agency_email(agency)).to.equals('agence-lyon@local.fr');
    });

    it('Make Agency Email for Aix-en-Provence', () => {
        const agency = 'Agence Aix-en-Provence';
        expect(Site.methods.make_agency_email(agency)).to.equals('agence-aix@local.fr');
    });

    it('Make Agency Email for Other', () => {
        const agency = null;
        expect(Site.methods.make_agency_email(agency)).to.equals('adv@local.fr');
    });

    it('Test Description', () => {
        Site.methods.change_to_appel_info();
        Site.methods.change_to_conception_info();
        Site.methods.change_to_conception_store_info();
        Site.methods.change_to_bat_info();
        Site.methods.change_to_livraison_info();
        Site.methods.change_to_creation_info();
        Site.methods.change_to_formation_info();
        Site.methods.change_to_boost_call_info();
        Site.methods.change_to_create_campaign_info();
        Site.methods.change_to_following_info();
        Site.methods.change_to_following_mailing_info();
        Site.methods.change_to_online_store_bat_info();
        Site.methods.change_to_webinar_1_bat_info();
        Site.methods.change_to_webinar_2_bat_info();
        Site.methods.change_to_online_info();
        Site.methods.change_to_original_info();
    });

    it('Us date to Fr', () => {
        var newDate = '2016-03-18 09:55:42.000000';
        expect(Site.methods.us_date_to_fr(newDate)).to.equals('18/03/2016');
    });

    it('Get Name From Product Code', () => {
        const productCode = 'PRODUCT23';
        var url = process.env.SALESFORCE_ROOT_API + process.env.SALESFORCE_QUERY_BASE + "?q=SELECT+Name+from+Product2+WHERE+ProductCode+=+'" + productCode + "'";
        axiosStub.resolves();
        Site.methods.get_name_from_product_code(productCode);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Get Product Infos', () => {
        const productId = 'PRODUCT23';
        $cookies.set('SALESFORCE_USER_TOKEN', 'Token3232');
        var url = process.env.SALESFORCE_ROOT_API + process.env.SALESFORCE_QUERY_BASE_SOBJECTS + 'OpportunityLineItem/' + productId;
        axiosStub.resolves();
        Site.methods.get_product_infos(productId);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Get Product Id', () => {
        const opportunityId = 'PRODUCT23';
        $cookies.set('SALESFORCE_USER_TOKEN', 'Token3232');
        var url = process.env.SALESFORCE_ROOT_API + process.env.SALESFORCE_QUERY_BASE + "?q=SELECT+Id+from+OpportunityLineItem+WHERE+OpportunityId+=+'" + opportunityId + "'";
        axiosStub.resolves();
        Site.methods.get_product_id(opportunityId);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Load Opportunity List', () => {
        $cookies.set('SALESFORCE_USER_TOKEN', 'Token3232');
        var url = process.env.SALESFORCE_ROOT_API + process.env.SALESFORCE_QUERY_BASE + "?q=SELECT+Id+,+StageName+,+CloseDate+from+Opportunity+WHERE+AccountId+=+'" + $cookies.get('SALESFORCE_ACCOUNT_ID') + "'";
        axiosStub.resolves();
        Site.methods.load_opportunity_list();
        assert(axiosStub.calledOnceWith(url));
    });

    it('Load Products Name', () => {
        const offer = {
            ProductCode: 'TESTPROD'
        };
        Site.methods.load_products_name(offer);
    });

    it('Print My Offer Services', () => {
        var newDate = '2016-03-18 09:55:42.000000';
        const offer = {
            productCode: 'ABSIT16',
            date: newDate,
            name: 'TestName'
        };
        Site.methods.print_my_offer_services(offer);
    });
});
