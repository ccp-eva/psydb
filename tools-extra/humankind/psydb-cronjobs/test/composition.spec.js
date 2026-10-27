'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');
var Composition = require('../public-online-form/composition');

describe('public-online-form', function () {
    var db;
    beforeEach(async function () {
        await this.restore('init-humankind-with-dummy-data-2');
        await this.setupInbox({ fixtures: [
            //'regform-mail-08-final',
            'regform-mail-parent-only-test',
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

        var adult = await this.getRecord('subject', {
            firstname: 'MMMM',
            lastname: 'EEEE'
        });
        console.dir(ejson(adult), { depth: null });
        //var childOne = await this.getRecord('subject', {
        //    firstname: 'Kindvorname',
        //    lastname: 'Kindnachname'
        //});
        //console.dir(ejson(childOne), { depth: null });
    })
})
