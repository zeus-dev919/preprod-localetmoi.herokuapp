import Accueil from '@/components/Accueil';
import axios from 'axios';

describe('Accueil', () => {
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

    it('Get Services', () => {
        const accountId = '223343';
        const userToken = 'tokenABC';
        const opportunityId = 'OPPO3434';
        const queryBase = process.env.SALESFORCE_QUERY_BASE + "?q=SELECT+Id+from+OpportunityLineItem+WHERE+OpportunityId+=+'" + opportunityId + "'";
        const url = process.env.SALESFORCE_ROOT_API + queryBase;
        axiosStub.resolves();
        Accueil.methods.get_services(accountId, userToken, opportunityId);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Get Opportunity Name', () => {
        const itemId = '34434';
        const userToken = 'tokenABC';
        const queryBase = process.env.SALESFORCE_QUERY_BASE_SOBJECTS + 'OpportunityLineItem/' + itemId;
        const url = process.env.SALESFORCE_ROOT_API + queryBase;
        axiosStub.resolves();
        Accueil.methods.get_opportunity_name(itemId, userToken);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Connect to Salesforce With Cookies', () => {
        const sageCode = '66840';
        $cookies.set('SALESFORCE_ACCOUNT_ID', '34343434');
        $cookies.set('SALESFORCE_USER_TOKEN', 'token3884');
        $cookies.set('SALESFORCE_OPPORTUNITY_ID', 'OPPO34040');
        localStorage.setItem('WEBSITE-LINK', 'www.dzedze.com');
        axiosStub.resolves();
        expect(Accueil.methods.connect_to_salesforce(sageCode)).to.equals(1);
    });

    it('Get Account Id', () => {
        const userToken = 'token';
        const sageCode = '123232';
        const queryBase = process.env.SALESFORCE_QUERY_BASE + '?q=SELECT+Id+,+Website+,+Agence__c+from+Account+WHERE+Code_Sage__c+=+\'' + localStorage.getItem('sageCode') + '\'';
        const url = process.env.SALESFORCE_ROOT_API + queryBase;
        axiosStub.resolves();
        Accueil.methods.get_account_id(userToken, sageCode);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Get Contact Id', () => {
        const accountId = 'acount232';
        const userToken = 'token';
        const queryBase = process.env.SALESFORCE_QUERY_BASE + "?q=SELECT+Id+,+Email+from+Contact+WHERE+AccountId+=+'" + accountId + "'";
        const url = process.env.SALESFORCE_ROOT_API + queryBase;
        axiosStub.resolves();
        Accueil.methods.get_contact_id(accountId, userToken);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Get Opportunity Id', () => {
        const accountId = 'acount232';
        const userToken = 'token';
        const queryBase = process.env.SALESFORCE_QUERY_BASE + "?q=SELECT+Id+from+Opportunity+WHERE+AccountId+=+'" + accountId + "'";
        const url = process.env.SALESFORCE_ROOT_API + queryBase;
        axiosStub.resolves();
        Accueil.methods.get_opportunity_id(accountId, userToken);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Connect to Salesforce Without Cookies', () => {
        axiosStub = sandbox.stub(axios, 'post');
        $cookies.remove('SALESFORCE_ACCOUNT_ID');
        const saleforceTokenUrl = process.env.SALESFORCE_ROOT_API + process.env.SALESFORCE_TOKEN_URL_PROD;
        const sageCode = '66840';
        localStorage.setItem('WEBSITE-LINK', 'www.dzedze.com');
        axiosStub.resolves();
        Accueil.methods.connect_to_salesforce(sageCode);
        assert(axiosStub.calledOnceWith(saleforceTokenUrl));
    });
});
