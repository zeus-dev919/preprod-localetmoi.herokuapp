import AudienceVisibilite from '@/components/AudienceVisibilite';
import axios from 'axios';

describe('AudienceVisibilite', () => {
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

    it('Get Opportunity List', () => {
        $cookies.set('SALESFORCE_ACCOUNT_ID', 'Account123');
        $cookies.set('SALESFORCE_USER_TOKEN', 'Token343');
        const salesforceAccountId = $cookies.get('SALESFORCE_ACCOUNT_ID');
        const url = process.env.SALESFORCE_ROOT_API + process.env.SALESFORCE_QUERY_BASE + "?q=SELECT+Id+,+StageName+,+CloseDate+from+Opportunity+WHERE+AccountId+=+'" + salesforceAccountId + "'";
        axiosStub.resolves();
        AudienceVisibilite.methods.load_opportunity_list();
        assert(axiosStub.calledOnceWith(url));
    });

    it('Print Visits from Last 30 Days', () => {
        const atinternetId = 34343;
        const day = 30;
        const url = process.env.AT_INTERNET_BASE_URL + 'getData?&columns={m_visits,m_page_views}&sort={-m_visits}&space={s:' + atinternetId + '}&period={R:{D:{start:-' + day + ',end:-1}}}';
        axiosStub.resolves();
        AudienceVisibilite.methods.printVisitsFromLast30Days(atinternetId);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Get Messages Nbr', () => {
        $cookies.set('WEBTOOL_AUTH', 'Token232');
        const webtoolToken = $cookies.get('WEBTOOL_AUTH');
        const data = 'webtoolToken=' + webtoolToken;
        const url = process.env.WEBTOOL_URL + 'messages/count?' + data;
        axiosStub.resolves();
        AudienceVisibilite.methods.get_messages_nbr();
        assert(axiosStub.calledOnceWith(url));
    });

    it('Get Subscribers Nbr', () => {
        $cookies.set('WEBTOOL_AUTH', 'Token232');
        const webtoolToken = $cookies.get('WEBTOOL_AUTH');
        const data = 'webtoolToken=' + webtoolToken;
        const url = process.env.WEBTOOL_URL + 'subscriptions/count?' + data;
        axiosStub.resolves();
        AudienceVisibilite.methods.get_newsletter_nbr();
        assert(axiosStub.calledOnceWith(url));
    });

    it('Retrieve Listings', () => {
        axiosStub.restore();
        axiosStub = sandbox.stub(axios, 'post');
        const url = process.env.WEBTOOL_URL + 'uberall/autologin';
        axiosStub.resolves();
        AudienceVisibilite.methods.getUberallListings();
        assert(axiosStub.calledOnceWith(url));
    });

    it('Connect atInternet', () => {
        axiosStub.restore();
        axiosStub = sandbox.stub(axios, 'post');
        const url = process.env.WEBTOOL_URL + 'atinternet/connect';
        axiosStub.resolves();
        AudienceVisibilite.methods.connect_at_internet();
        assert(axiosStub.calledOnceWith(url));
    });
});
