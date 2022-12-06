import Messages from '@/components/Messages';
import axios from 'axios';

describe('Messages', () => {
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

    it('Add Attachment Infos', () => {
        $cookies.set('WEBTOOL_AUTH', 'myCookie');
        webtoolToken = $cookies.get('WEBTOOL_AUTH');
        const messageId = '23232';
        const message = 'test';
        var data = '?webtoolToken=' + webtoolToken;
        const url = process.env.WEBTOOL_URL + 'message/' + messageId + data;
        axiosStub.resolves();
        Messages.methods.add_attachment_infos(messageId, message);
        assert(axiosStub.calledOnceWith(url));
    });

    it('Get Messages List', () => {
        $cookies.set('WEBTOOL_AUTH', 'myCookie');
        webtoolToken = $cookies.get('WEBTOOL_AUTH');
        var data = 'webtoolToken=' + webtoolToken;
        axiosStub.resolves();
        Messages.methods.get_messages_list();
        assert(axiosStub.calledOnceWith(process.env.WEBTOOL_URL + 'messages?' + data));
    });

    it('Get Message Infos', () => {
        $cookies.set('WEBTOOL_AUTH', 'myCookie');
        webtoolToken = $cookies.get('WEBTOOL_AUTH');
        const messages = {
            createdAt: {
                date: '2019-02-10 14:55:55.000000'
            },
            id: '32343',
            message: 'Contenu Mess',
            nbAttachments: '0',
            senderEmail: 'test@test.com',
            senderName: 'Test sender',
            senderPhone: '0990909033'
        };
        Messages.methods.get_message_info(messages);
    });

    it('Us date to Fr', () => {
        var newDate = '2016-03-18 09:55:42.000000';
        expect(Messages.methods.us_date_to_fr(newDate)).to.equals('18/03/2016');
    });
});
