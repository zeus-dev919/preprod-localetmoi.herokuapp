import Campagne from '@/components/Campagne';

describe('Campagne', () => {
    it('Format Date', () => {
        var newDate = new Date('March 18, 2016');
        expect(Campagne.methods.format_date(newDate)).to.equals('2016-03-18');
    });

    it('Us date to Fr', () => {
        var newDate = '2016-03-18 09:55:42.000000';
        expect(Campagne.methods.us_date_to_fr(newDate)).to.equals('18/03/2016');
    });
});
