'use strict';
var { expect } = require('chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { createQueryFilter, Fields } = require('../src');

describe('createQueryFilter()', () => {
    var te = 'extended-search';
    var tq = 'quick-search';
    var definition = { pointer: '/foo', props: {}};

    it('Address', () => {
        var e = Fields.Address.createQueryFilter({
            type: te, definition, input: {
                country: 'DE', 'city': 'LE', 'street': 'Ostplatz'
            }
        });
        //console.log(a);
        expect(e).to.eql({
            'foo.country': 'DE',
            'foo.city': /L[EeÈèÉéÊêËë]/i,
            'foo.street': /[OoÒòÓóÔôÕõÖö]stpl[AaÀàÁáÂâÃãÄäåĂă]tz/i
        });

        var q = Fields.Address.createQueryFilter({
            type: tq, definition, input: 'Ostplatz 12'
        });
        expect(q).to.eql({ $expr: { $regexMatch: {
            input: { $concat: [
                '$foo.street', ' ', '$foo.housenumber', ' ', '$foo.affix',
                ' ', '$foo.postcode', ' ', '$foo.city'
            ]},
            regex: /[OoÒòÓóÔôÕõÖö]stpl[AaÀàÁáÂâÃãÄäåĂă]tz 12/i
        }}});
    });

    it('BiologicalGender', () => {
        var e = Fields.BiologicalGender.createQueryFilter({
            type: te, definition, input: {
                'f': true, 'o': true, 'm': false
            }
        });
        //console.log(e);
        expect(e).to.eql({
            'foo': { $in: [ 'f', 'o' ]}
        })
        
        var q = Fields.BiologicalGender.createQueryFilter({
            type: tq, definition, input: 'f'
        });
        //console.log(e);
        expect(q).to.eql({ 'foo': 'f' })
    });

    it('DateOnlyServerSide', () => {
        var a = Fields.DateOnlyServerSide.createQueryFilter({
            type: te, definition, input: { interval: {
                start: '2020-01-01T00:00:00.000Z',
                end: '2020-12-31T00:00:00.000Z',
            }}
        });
        expect(ejson(a)).to.eql({
            'foo': {
                $gte: { $date: '2020-01-01T00:00:00.000Z' },
                $lt: { $date: '2020-12-31T00:00:00.000Z' },
            }
        })
    });

    it('DefaultBool', () => {
        var e = Fields.DefaultBool.createQueryFilter({
            type: te, definition, input: 'only-false'
        });
        //console.log(e);
        expect(e).to.eql({ 'foo': false });
        
        var q = Fields.DefaultBool.createQueryFilter({
            type: tq, definition, input: false
        });
        //console.log(q);
        expect(q).to.eql({ 'foo': false });
    });

    it('EmailList', () => {
        var e = Fields.EmailList.createQueryFilter({
            type: te, definition, input: 'f@b.dd'
        });
        //console.log(e);
        expect(e).to.eql({ 'foo.email': /f@b\.dd/i })
        
        var q = Fields.EmailList.createQueryFilter({
            type: tq, definition, input: 'f@b.dd'
        });
        //console.log(q);
        expect(q).to.eql({ 'foo.email': /f@b\.dd/i })
    });
    
    it('ExtBool', () => {
        var e = Fields.ExtBool.createQueryFilter({
            type: te, definition, input: {
                'yes': false, 'no': true, 'unknown': true
            }
        });
        //console.log(e);
        expect(e).to.eql({
            'foo': { $in: [ 'no', 'unknown' ]}
        })
        
        var q = Fields.ExtBool.createQueryFilter({
            type: tq, definition, input: 'unknown'
        });
        //console.log(e);
        expect(q).to.eql({ 'foo': 'unknown' })
    });
    
    it('ForeignIdList / HelperSetItemIdList', () => {
        var inputs = [
            { values: [
                '000000000000000000000000'
            ]},
            { values: [
                '000000000000000000000000',
                '000000000000000000000001',
            ]},
            { negate: true, values: [
                '000000000000000000000000'
            ]},

            { any: true },
            { negate: true, any: true },
        ];
        var out = [
            { 'foo': { $in: [
                { $oid: '000000000000000000000000' }
            ]}},
            { 'foo': { $in: [
                { $oid: '000000000000000000000000' },
                { $oid: '000000000000000000000001' }
            ]}},
            { 'foo': { $nin: [
                { $oid: '000000000000000000000000' },
            ]}},
            { 'foo.0': { $exists: true }},
            { 'foo.0': { $exists: false }}
        ]
        for (var [ ix, it ] of inputs.entries()) {
            var fk = Fields.ForeignIdList.createQueryFilter({
                type: te, definition, input: it
            });
            var hsi = Fields.HelperSetItemIdList.createQueryFilter({
                type: te, definition, input: it
            });

            //console.log(fk, hsi);
            expect(ejson(fk)).to.eql(out[ix]);
            expect(ejson(hsi)).to.eql(out[ix]);
        }
    });
    
    it('ForeignId / HelperSetItemId', () => {
        var inputs = [
            { values: [
                '000000000000000000000000'
            ]},
            { values: [
                '000000000000000000000000',
                '000000000000000000000001',
            ]},
            { negate: true, values: [
                '000000000000000000000000'
            ]},

            { any: true },
            { negate: true, any: true },
        ];
        var out = [
            { 'foo': { $in: [
                { $oid: '000000000000000000000000' }
            ]}},
            { 'foo': { $in: [
                { $oid: '000000000000000000000000' },
                { $oid: '000000000000000000000001' }
            ]}},
            { 'foo': { $nin: [
                { $oid: '000000000000000000000000' },
            ]}},
            { 'foo': {
                $exists: true, $not: { $type: 10 }
            }},
            { 'foo': {
                $not: { $exists: true, $not: { $type: 10 }}
            }}
        ]
        for (var [ ix, it ] of inputs.entries()) {
            var fk = Fields.ForeignId.createQueryFilter({
                type: te, definition, input: it
            });
            var hsi = Fields.HelperSetItemId.createQueryFilter({
                type: te, definition, input: it
            });

            //console.log(fk, hsi);
            expect(ejson(fk)).to.eql(out[ix]);
            expect(ejson(hsi)).to.eql(out[ix]);
        }
    });

    it('FullText', () => {
        var a = Fields.FullText.createQueryFilter({
            type: te, definition, input: 'ddd'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': /ddd/i
        })
    });
    
    it('Integer', () => {
        var a = Fields.Integer.createQueryFilter({
            type: te, definition, input: { min: 4, max: 8 }
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': { $gte: 4, $lte: 8 }
        })
    });
    
    it('PhoneList', () => {
        var a = Fields.PhoneList.createQueryFilter({
            type: te, definition, input: '123'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': /123/i
        })
    });
    
    it('PhoneWithTypeList', () => {
        var a = Fields.PhoneWithTypeList.createQueryFilter({
            type: te, definition, input: '123'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo.number': /123/i
        })
    });
    
    it('SaneString', () => {
        var a = Fields.SaneString.createQueryFilter({
            type: te, definition, input: 'ddd'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': /ddd/i
        })
    });
    
    it('URLStringList', () => {
        var a = Fields.URLStringList.createQueryFilter({
            type: te, definition, input: 'ddd'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': /ddd/i
        })
    });
})
