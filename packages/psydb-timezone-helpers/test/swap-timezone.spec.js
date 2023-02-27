'use strict';
// NOTE: run with TZ='UTC' as env (or whatever tz u want)
var { swapTimezone } = require('../src');

describe('swapTimezone()', () => {
    it('both germany', () => {
        // local date in germany shows 1970-01-01 00:00:00
        var fakeGermany = new Date('1969-12-31T23:00:00.000Z');
        
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            //targetTZ: 'America/New_York',
            targetTZ: 'Europe/Berlin',
        });
        console.log({ out })
        expect(out).toEqual(new Date('1969-12-31T23:00:00.000Z'));
    });

    it('both germany - dst pre switch off', () => {
        // dst - local date in germany shows 2021-10-31 02:59:59
        var fakeGermany = new Date('2021-10-30T00:59:59.999Z');
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'Europe/Berlin',
        });
        console.log({ out })
        expect(out).toEqual(new Date('2021-10-30T00:59:59.999Z'));
    });

    it('both germany - dst within dst switchoff', () => {
        // dst - local date in germany shows 2021-10-31 02:00:00
        var fakeGermany = new Date('2021-10-31T01:00:00.000Z');
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'Europe/Berlin',
        });
        console.log({ out })
        expect(out).toEqual(new Date('2021-10-31T01:00:00.000Z'));
    });
    
    it('both germany - dst post switch off', () => {
        // dst - local date in germany shows 2021-10-31 03:00:00
        var fakeGermany = new Date('2021-10-31T02:00:00.000Z');
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'Europe/Berlin',
        });
        console.log({ out })
        expect(out).toEqual(new Date('2021-10-31T02:00:00.000Z'));
    });

    it('client germany; server utc', () => {
        // local date in germany shows 1970-01-01 00:00:00
        var fakeGermany = new Date('1969-12-31T23:00:00.000Z');
        
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'UTC',
        });
        console.log({ out })
        expect(out).toEqual(new Date('1970-01-01T00:00:00.000Z'));
    });

    it('client germany; server utc - dst pre switch off', () => {
        // dst - local date in germany shows 2021-10-31 02:59:59
        var fakeGermany = new Date('2021-10-31T00:59:59.999Z');
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'UTC',
        });
        console.log({ out })
        expect(out).toEqual(new Date('2021-10-31T02:59:59.999Z'));
    });

    // XXX: im actually not sure what is supposed to happen here
    it.skip('client germany; server utc - dst within switch off', () => {
        // dst - local date in germany shows 2021-10-31 02:00:00
        var fakeGermany = new Date('2021-10-31T01:00:00.000Z');
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'UTC',
        });
        console.log({ out })
        expect(out).toEqual(new Date('2021-10-31T02:00:00.000Z'));
    });

    it('client germany; server utc - dst post switch off', () => {
        // dst - local date in germany shows 2021-10-31 03:00:00
        var fakeGermany = new Date('2021-10-31T02:00:00.000Z');
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'UTC',
        });
        console.log({ out })
        expect(out).toEqual(new Date('2021-10-31T03:00:00.000Z'));
    });

    it('client germany; server utc', () => {
        // local date in germany shows 1970-01-01 00:00:00
        var fakeGermany = new Date('1969-12-31T23:00:00.000Z');
        
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'UTC',
        });
        console.log({ out })
        expect(out).toEqual(new Date('1970-01-01T00:00:00.000Z'));
    });

    it('client germany; server new york', () => {
        // local date in germany shows 1970-01-01 00:00:00
        var fakeGermany = new Date('1969-12-31T23:00:00.000Z');
        
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'America/New_York',
        });
        console.log({ out })
        expect(out).toEqual(new Date('1970-01-01T05:00:00.000Z'));
    });

    it('dates before 100 AD', () => {
        // local date in germany shows 1970-01-01 00:00:00
        var fakeGermany = new Date('0001-12-31T23:00:00.000Z');
        
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'UTC',
        });
        console.log({ out })
        expect(out).toEqual(new Date('1970-01-01T00:00:00.000Z'));
    })

    it('dates brefore 1893-04-01', () => {
        // local date in germany shows 1970-01-01 00:00:00
        var fakeGermany = new Date('1893-03-31T23:00:00.000Z');
        
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'UTC',
        });
        console.log({ out })
        expect(out).toEqual(new Date('1970-01-01T00:00:00.000Z'));
    })
});

