import UberallAutoLogin from '@/components/UberallAutoLogin';
import axios from 'axios';

describe('UberallAutoLogin', () => {
    it('Getting Uberall Autologin Link', () => {
        var axiosStub = sinon.stub(axios, 'post');
        axiosStub.resolves();
        UberallAutoLogin.methods.getting_uberall_autologin();
        assert(axiosStub.calledOnceWith(process.env.WEBTOOL_URL + 'uberall/autologin'));
        axiosStub.restore();
    });
});
