'use strict';
var { swapTimezone } = require('../src');

describe('swapTimezone()', () => {

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

    it('client germany; server utc - dst post switch off', () => {
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

    it('client germany; server utc', () => {
        var sourceTimezone = 'Europe/Berlin';
        var targetTimezone = 'UTC';

        // local date in germany shows 1970-01-01 00:00:00
        var fakeGermany = new Date('1969-12-31T23:00:00.000Z');
        
        var out = swapTimezone({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            targetTZ: 'UTC',
        });
        console.log({ out })
        expect(out).toEqual(new Date('1970-01-01T00:00:00.000Z'));

        /*console.log(fakeGermany.getTimezoneOffset());
        //console.log(fakeTZ(fakeGermany));
        console.log(swapTZ({
            date: fakeGermany,
            sourceTZ: 'Europe/Berlin',
            //targetTZ: 'Europe/Berlin',
            //targetTZ: 'UTC',
            targetTZ: 'America/New_York',
        }))*/
       
        /*
        var localeString = fakeGermany.toLocaleString('en-US', {
            timeZone: sourceTimezone
        })
        var fake = (
            new Date(localeString)
        );

        var delta = (
            fakeGermany.getTime() - fake.getTime()
        );

        var server = new Date((fakeGermany.getTime() + delta));

        // the server will receive the clients timezone +60 in this case
        // then to get the correct date part, that is 1970-01-01,
        // the server adds the clients timezone offset to the timestamp
        // it received to get utc equivalent
        // and then has to subtract its own timezone offset
        // to get the proper date part of that date
        // in this case its -60 +0

        console.log({
            fakeGermany,
            local: fakeGermany.toString(),
            localeString,
            fake,
            delta,
            server,
        })*/
    });
});

