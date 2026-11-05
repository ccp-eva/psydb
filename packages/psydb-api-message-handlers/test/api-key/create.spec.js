'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

describe('apiKey/create', function () {
    var db;
    beforeEach(async function () {
        await this.restore('init-minimal');
        db = this.getDbHandle();
    });

    it('does the thing', async function () {
        var login = await this.createFakeLogin({ email: 'root@example.com' });
        var [ sendMessage ] = this.createMessenger({ ...login });

        var deltas = BaselineDeltas();
        deltas.push( await this.fetchAllRecords('apiKey') );

        var { personnelId } = login.session;
        var payload = { personnelId, props: {
            label: 'some api key',
            isEnabled: true,
            permissions: {},
        }}

        await sendMessage({
            type: 'apiKey/create', timezone: 'Europe/Berlin',
            payload
        });
        
        deltas.push( await this.fetchAllRecords('apiKey') );
        deltas.test({ expected: {
            '/0/_id': BaselineDeltas.AnyObjectId(),
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/personnelId': payload.personnelId,
            '/0/apiKey': BaselineDeltas.AnyString(),
            '/0/state': {
                ...payload.props,
                'internals': {}
            }
        }, asFlatEJSON: true });
    });

});
