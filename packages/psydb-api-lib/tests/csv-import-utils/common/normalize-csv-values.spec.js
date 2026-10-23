'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var {
    ExactObject,
    DefaultArray,
    SaneString,
    DateOnlyServerSide,
    PhoneWithTypeList,
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
});
