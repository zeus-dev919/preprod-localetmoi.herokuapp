import MenuMobile from '@/components/MenuMobile';
import MenuFormation from '@/components/MenuFormation';

describe('MenuMobile', () => {
    it('Open / Close Nav', () => {
        MenuMobile.methods.openNav();
        MenuMobile.methods.closeNav();
    });

    it('Redirect To Uberall', () => {
        var redirectStub = sinon.stub(MenuFormation.methods, 'redirect_to_uberall');
        MenuMobile.methods.redirect_to_uberall();
        assert(redirectStub.calledWith());
        redirectStub.restore();
    });
});
