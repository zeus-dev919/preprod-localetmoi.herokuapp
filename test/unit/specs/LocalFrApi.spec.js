import LocalFrApi from '@/components/LocalFrApi';
import axios from 'axios';

describe('LocalFrApi', () => {
    it('Update User', () => {
        var axiosStub = sinon.stub(axios, 'put');
        $cookies.set('WEBTOOL_AUTH', 'mycookie');
        let userId = '1234';
        let token = 'tokenexample';
        let data = {};
        axiosStub.resolves();
        LocalFrApi.methods.udpate_user(data, token, userId);
        assert(axiosStub.calledOnceWith(process.env.API_URL_OAUTH + userId));
        axiosStub.restore();
    });

    it('Get User From Email', () => {
        var axiosStub = sinon.stub(axios, 'get');
        $cookies.set('WEBTOOL_AUTH', 'mycookie');
        let email = 'email@email.com';
        let token = 'tokenexample';
        axiosStub.resolves();
        LocalFrApi.methods.get_userId_from_email(email, token);
        assert(axiosStub.calledOnceWith(process.env.API_URL_OAUTH + 'users?username=' + email));
        axiosStub.restore();
    });

    it('Generate API token', () => {
        var axiosStub = sinon.stub(axios, 'post');
        axiosStub.resolves();
        LocalFrApi.methods.generate_api_token();
        assert(axiosStub.calledOnceWith(process.env.API_URL_OAUTH + process.env.API_TOKEN_OAUTH));
        axiosStub.restore();
    });
});
