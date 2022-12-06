import Profile from '@/components/Profile';
import axios from 'axios';

describe('Profile', () => {
    it('Send New Facturation Infos', () => {
        var axiosStub = sinon.stub(axios, 'post');
        axiosStub.resolves();
        Profile.methods.send_new_factu_infos();
        assert(axiosStub.calledOnceWith(process.env.MANDRILL_BASE_URL));
        axiosStub.restore();
    });

    it('Retrieve Billing Info', () => {
        var axiosStub = sinon.stub(axios, 'get');
        $cookies.set('SALESFORCE_ACCOUNT_ID', 'mycookie');
        const url = process.env.SALESFORCE_ROOT_API + process.env.SALESFORCE_QUERY_BASE_SOBJECTS + 'Account/' + $cookies.get('SALESFORCE_ACCOUNT_ID');
        axiosStub.resolves();
        Profile.methods.retrieve_billing_info();
        assert(axiosStub.calledOnceWith(url));
        axiosStub.restore();
    }); 

    it('Retrieve Shiping Info', () => {
        var axiosStub = sinon.stub(axios, 'get');
        $cookies.set('SALESFORCE_CONTACT_ID', 'mycookie');
        const url = process.env.SALESFORCE_ROOT_API + process.env.SALESFORCE_QUERY_BASE_SOBJECTS + 'Contact/' + $cookies.get('SALESFORCE_CONTACT_ID');
        axiosStub.resolves();
        Profile.methods.retrieve_shiping_info();
        assert(axiosStub.calledOnceWith(url));
        axiosStub.restore();
    }); 

    it('Is connected', () => {
        var axiosStub = sinon.stub(axios, 'get');
        $cookies.set('WEBTOOL_AUTH', 'mycookie');
        var webtoolToken = $cookies.get('WEBTOOL_AUTH');
        const url = process.env.API_URL_OAUTH + process.env.API_TOKEN_CHECK + '/' + webtoolToken;
        axiosStub.resolves();
        Profile.methods.is_connected();
        assert(axiosStub.calledOnceWith(url));
        axiosStub.restore();
    });
});
