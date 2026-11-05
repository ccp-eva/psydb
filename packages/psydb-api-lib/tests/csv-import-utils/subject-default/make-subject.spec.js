'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var makeSubject = require(
    '../../../src/csv-import-utils/subject-default/make-subject'
);

describe('csv-import-utils/subject-default/make-subject', function () {
    var subjectCRT = {
        getType: () => 'child',
        allCustomFields: () => ([{
            key: 'address', systemType: 'Address', subChannel: 'gdpr',
            pointer: '/gdpr/state/custom/address', props: {},
        }]),
    };
    var researchGroup = { _id: 'rg' };

    it('fills address fallbacks', function () {
        var { record } = makeSubject({ subjectCRT, researchGroup,
            preparedObject: { gdpr: { state: { custom: {
                address: { street: 'Deutscher Platz', city: 'Leipzig' }
            }}}},
        });
        expect(record.gdpr.state.custom.address).to.eql({
            country: 'DE', city: 'Leipzig', postcode: '',
            street: 'Deutscher Platz', housenumber: '', affix: '',
        });
    });

    it('leaves missing address alone', function () {
        var { record } = makeSubject({ subjectCRT, researchGroup,
            preparedObject: { gdpr: { state: { custom: { name: 'x' }}}},
        });
        expect(record.gdpr.state.custom).to.eql({ name: 'x' });
    });
});
