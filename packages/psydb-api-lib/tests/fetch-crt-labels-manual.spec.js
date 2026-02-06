'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { fetchCRTLabelsManual } = require('../src');

describe('fetchCRTLabelsManual()', function () {
    var db, i18n;
    beforeEach(async function () {
        await this.restore('2024-07-12__0202_wkprc-fieldsite');
        db = this.getDbHandle();
        i18n = this.getI18N();
    });

    it('does the thing', async function () {
        var records = [
            { state: {
                locationType: 'wkprc_location',
                subjectData: [ { subjectType: 'wkprc_chimpanzee' } ]
            }},
            { state: {
                locationType: 'wkprc_location',
                subjectData: [ { subjectType: 'wkprc_bonobo' } ]
            }},
        ];
        var related = await fetchCRTLabelsManual({ db, records, pointers: {
            'subject': [ '/state/subjectData/subjectType' ],
            'location': [ '/state/locationType' ]
        }, i18n });

        console.log(related);
    })

})
