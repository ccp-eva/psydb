'use strict';
var { expect } = require('chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var { createQueryFilter, Fields } = require('../src');

describe('createQueryFilter()', () => {
    var type = 'extended-search';
    var definition = { pointer: '/foo', props: {}};

    it('Address', () => {
        var a = Fields.Address.createQueryFilter({
            type, definition, input: { 'city': 'LE', 'street': 'Ostplatz' }
        });
        //console.log(a);
        expect(a).to.eql({
            'foo.city': /L[EeÈèÉéÊêËë]/i,
            'foo.street': /[OoÒòÓóÔôÕõÖö]stpl[AaÀàÁáÂâÃãÄäåĂă]tz/i
        })
    });

    it('BiologicalGender', () => {
        var a = Fields.BiologicalGender.createQueryFilter({
            type, definition, input: { 'f': true, 'o': true, 'm': false }
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': { $in: [ 'f', 'o' ]}
        })
    });

    it('DateOnlyServerSide', () => {
        var a = Fields.DateOnlyServerSide.createQueryFilter({
            type, definition, input: { interval: {
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
        var a = Fields.DefaultBool.createQueryFilter({
            type, definition, input: 'only-false'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': false
        })
    });

    it('EmailList', () => {
        var a = Fields.EmailList.createQueryFilter({
            type, definition, input: 'f@b.dd'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo.email': /f@b\.dd/i
        })
    });
    
    it('ExtBool', () => {
        var a = Fields.ExtBool.createQueryFilter({
            type, definition, input: {
                'yes': false, 'no': true, 'unknown': true
            }
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': { $in: [ 'no', 'unknown' ]}
        })
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
                type, definition, input: it
            });
            var hsi = Fields.HelperSetItemIdList.createQueryFilter({
                type, definition, input: it
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
                type, definition, input: it
            });
            var hsi = Fields.HelperSetItemId.createQueryFilter({
                type, definition, input: it
            });

            //console.log(fk, hsi);
            expect(ejson(fk)).to.eql(out[ix]);
            expect(ejson(hsi)).to.eql(out[ix]);
        }
    });

    it('FullText', () => {
        var a = Fields.FullText.createQueryFilter({
            type, definition, input: 'ddd'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': /ddd/i
        })
    });
    
    it('Integer', () => {
        var a = Fields.Integer.createQueryFilter({
            type, definition, input: { min: 4, max: 8 }
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': { $gte: 4, $lte: 8 }
        })
    });
    
    it('PhoneList', () => {
        var a = Fields.PhoneList.createQueryFilter({
            type, definition, input: '123'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': /123/i
        })
    });
    
    it('PhoneWithTypeList', () => {
        var a = Fields.PhoneWithTypeList.createQueryFilter({
            type, definition, input: '123'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo.number': /123/i
        })
    });
    
    it('SaneString', () => {
        var a = Fields.SaneString.createQueryFilter({
            type, definition, input: 'ddd'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': /ddd/i
        })
    });
    
    it('URLStringList', () => {
        var a = Fields.URLStringList.createQueryFilter({
            type, definition, input: 'ddd'
        });
        //console.log(a);
        expect(a).to.eql({
            'foo': /ddd/i
        })
    });
})
