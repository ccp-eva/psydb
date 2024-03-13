'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var Composition = require('../public-online-form/composition');

describe('public-online-form', function () {
    var db;
    beforeEach(async function () {
        await this.restore('init-humankind-with-dummy-data');
        this.createKoaApi({ apiConfig: {
            apiKeyAuth: { isEnabled: true, allowedIps: [ '::/0' ] }
        }});
        db = this.getDbHandle()
    })

    it('does the stuff', async function () {
        var psydbUrl = this.context.api.agent.defaults.baseURL;
        
        var composition = Composition({
            psydbUrl,
            psydbApiKey: 'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHVB1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh',

            imapHost: '127.0.0.1',
            imapPort: 3143,
            imapUser: 'root@example.com',
            imapPassword: 'test1234',
            imapSsl: false,
            imapVerbose: false,

            smtpHost: '127.0.0.1',
            smtpPort: 3025,
            smtpUser: 'root@example.com',
            smtpPassword: 'test1234',
            errorMailFrom: 'db-humankind-registration@example.com',
            errorMailTo: 'root@example.com'
        });

        var context = {
            parserErrors: [],
            psydbDriverErrors: [],
        }
        await composition(context, async () => {});
    })
})
