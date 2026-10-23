'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var {
    ExactObject,
    DefaultArray,
    SaneString,
    DateOnlyServerSide,
    PhoneWithTypeList,
    EmailList,
} = require('@mpieva/psydb-schema-fields');

var normalizeCSVValues = require(
    '../../../src/csv-import-utils/common/normalize-csv-values'
);

describe('csv-import-utils/common/normalize-csv-values', function () {
    var schema = ExactObject({ properties: {
        dob: DateOnlyServerSide(),
        text: SaneString(),
        nested: ExactObject({ properties: {
            dates: DefaultArray({ items: DateOnlyServerSide() }),
        }}),
        phones: PhoneWithTypeList({}),
        emails: EmailList({}),
    }});

    it('converts dd.mm.yyyy only for DateOnlyServerSide', function () {
        var items = [{
            dob: '31.05.1953',
            text: '31.05.1953',
            nested: { dates: [ '1.2.2001', '2001-02-03' ] },
        }];
        normalizeCSVValues({ schema, items });

        expect(items).to.eql([{
            dob: '1953-05-31',
            text: '31.05.1953',
            nested: { dates: [ '2001-02-01', '2001-02-03' ] },
        }]);
    });

    it('leaves invalid dates for validation to reject', function () {
        var items = [{ dob: '31.02.1953' }, { dob: null }];
        normalizeCSVValues({ schema, items });

        expect(items).to.eql([{ dob: '31.02.1953' }, { dob: null }]);
    });

    it('sets phone type fallback', function () {
        var items = [{ phones: [
            { number: '+49 151 7953677' },
            { number: '030/123123', type: 'mobile' },
        ]}];
        normalizeCSVValues({ schema, items });

        expect(items).to.eql([{ phones: [
            { number: '+49 151 7953677', type: 'private' },
            { number: '030/123123', type: 'mobile' },
        ]}]);
    });

    it('sets email isPrimary fallback', function () {
        var items = [
            { emails: [{ email: 'a@example.com' }, { email: 'b@example.com' }]},
            { emails: [
                { email: 'a@example.com' },
                { email: 'b@example.com', isPrimary: true }
            ]},
        ];
        normalizeCSVValues({ schema, items });

        expect(items).to.eql([
            { emails: [
                { email: 'a@example.com', isPrimary: true },
                { email: 'b@example.com', isPrimary: false },
            ]},
            { emails: [
                { email: 'a@example.com', isPrimary: false },
                { email: 'b@example.com', isPrimary: true },
            ]},
        ]);
    });

    it('accepts plain phone and email list columns', function () {
        var items = [{
            phones: [ '+49 151 7953677', 4930123123 ],
            emails: [ 'a@example.com', 'b@example.com' ],
        }];
        normalizeCSVValues({ schema, items });

        expect(items).to.eql([{
            phones: [
                { number: '+49 151 7953677', type: 'private' },
                { number: '4930123123', type: 'private' },
            ],
            emails: [
                { email: 'a@example.com', isPrimary: true },
                { email: 'b@example.com', isPrimary: false },
            ],
        }]);
    });
});
