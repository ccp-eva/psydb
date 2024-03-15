'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var Composition = require('../public-online-form/composition');

describe('public-online-form', function () {
    var db;
    beforeEach(async function () {
        await this.restore('init-humankind-with-dummy-data');
        await this.setupInbox({ fixtures: [
            //'regform-mail-01',
            'regform-mail-02',
            'regform-mail-03',
        ]});

        this.createKoaApi();
        db = this.getDbHandle();
    })

    it('does the stuff', async function () {
        var composition = Composition({
            ...this.getDefaultCLIOptions(),
        });

        var context = {
            parserErrors: [],
            psydbDriverErrors: [],
        }
        await composition(context, async () => {});
    })
})
