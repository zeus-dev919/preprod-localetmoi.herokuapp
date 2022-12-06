import Newsletter from '@/components/Newsletter';
import axios from 'axios';

describe('Newsletter', () => {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    var axiosStub;
    var sandbox;
    var webtoolToken;
    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        axiosStub = sandbox.stub(axios, 'get');
        $cookies.set('WEBTOOL_AUTH', 'testAuth');
        webtoolToken = $cookies.get('WEBTOOL_AUTH');
    });

    afterEach(() => {
        axiosStub.restore();
    });

    after(() => {
        sandbox.restore();
    });

    it('Get Name From Product Code', () => {
        var data = '?webtoolToken=' + webtoolToken;
        axiosStub.resolves();
        Newsletter.methods.get_newsletter_list();
        assert(axiosStub.calledOnceWith(process.env.WEBTOOL_URL + 'subscriptions' + data));
    });

    it('Delete Subscriber', () => {
        axiosStub.restore();
        axiosStub = sandbox.stub(axios, 'delete');
        const subscriber = {
            id: 4
        };
        const url = process.env.WEBTOOL_URL + 'subscription/' + subscriber.id + '?webtoolToken=' + webtoolToken;
        axiosStub.resolves();
        Newsletter.methods.delete_subscriber(subscriber);
        assert(axiosStub.calledOnceWith(url));
    });
});
