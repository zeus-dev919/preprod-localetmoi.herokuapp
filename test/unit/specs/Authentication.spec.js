import Authentication from '@/components/Authentication';
import axios from 'axios';

describe('Authentication', () => {
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

    it('Auto connect if valid token', () => {
        $cookies.set('WEBTOOL_AUTH', 'mycookie');
        axiosStub.resolves();
        Authentication.methods.connect_if_token_valid();
        assert(axiosStub.calledOnceWith(process.env.API_URL_OAUTH + process.env.API_TOKEN_CHECK + '/mycookie'));
    });

    it('Auto connect if not valid token', () => {
        const error = 'my error';
        $cookies.set('WEBTOOL_AUTH', 'mycookie');
        axiosStub.rejects(error);
        Authentication.methods.connect_if_token_valid();
        assert(axiosStub.calledOnceWith(process.env.API_URL_OAUTH + process.env.API_TOKEN_CHECK + '/mycookie'));
    });

    it('Authentication', () => {
        sandbox.restore();
        axiosStub = sandbox.stub(axios, 'post');
        $cookies.set('WEBTOOL_AUTH', 'mycookie');
        axiosStub.resolves();
        Authentication.methods.authenticate();
        assert(axiosStub.calledOnceWith(process.env.API_URL_OAUTH + process.env.API_TOKEN_OAUTH));
    });

    it('send_reset_pwd_link', () => {
        sandbox.restore();
        axiosStub = sandbox.stub(axios, 'post');
        const url = process.env.MANDRILL_BASE_URL;
        const userId = '23434';
        const to = 'test@test.com';
        axiosStub.resolves();
        Authentication.methods.send_reset_pwd_link(userId, to);
        assert(axiosStub.calledOnceWith(url));
    });
});
