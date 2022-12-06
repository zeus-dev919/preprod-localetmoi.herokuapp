const Encryptor = require('../services/encryptor');

describe('Encryptor', () => {
    it('Conversion Hex To Bin', () => {
        var hex = '74657374';
        expect(Encryptor.methods.hex2bin(hex)).to.equals('test');
    });

    it('Conversion Bin To Hex', () => {
        var bin = 'test';
        expect(Encryptor.methods.bin2hex(bin)).to.equals('74657374');
    });

    it('Descrypt Str', () => {
        var str = btoa('MScZRMPGBBs8u2ZEK89IOw==:SdGsfdREXP5oOiao7shfhA==');
        expect(Encryptor.methods.decryptStr(str)).to.equals('test');
    });
});
