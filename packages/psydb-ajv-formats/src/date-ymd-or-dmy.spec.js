'use strict';
var expect = require('chai').expect;
var { normalize } = require('./date-ymd-or-dmy');

describe('date-ymd-or-dmy', () => {
    it('accepts yyyy-mm-dd', () => {
        expect(normalize('2026-03-04')).to.eql('2026-03-04');
    });

    it('accepts dd.mm.yyyy and d.m.yyyy', () => {
        expect(normalize('04.03.2026')).to.eql('2026-03-04');
        expect(normalize('4.3.2026')).to.eql('2026-03-04');
    });

    it('handles leap years', () => {
        expect(normalize('29.02.2024')).to.eql('2024-02-29');
        expect(normalize('29.02.2026')).to.eql(null);
        expect(normalize('2000-02-29')).to.eql('2000-02-29');
        expect(normalize('1900-02-29')).to.eql(null);
    });

    it('rejects invalid dates and formats', () => {
        for (var it of [
            '31.04.2026', '00.01.2026', '01.13.2026', '2026-1-4',
            '04/03/2026', '04.03.26', '', 'foo', undefined, 20260304
        ]) {
            expect(normalize(it), String(it)).to.eql(null);
        }
    });
});
