'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit, without, jsonify } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-api-lib');

var RootHandler = require('../../../src/');

describe('study/create wip', function () {
    var db, sendMessage;
    beforeEach(async function () {
        await this.restore('2025-09-22__1105');
        db = this.getDbHandle();

        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));
    });

    it('does the thing', async function () {
        var { getId } = this;

        var wkprc = await getId('researchGroup', { shorthand: /WKPRC/ });
        var alice = await getId('personnel', { 'emails.email': /wkprc_alice/ });

        var koaContext = await sendMessage({
            type: 'study/wkprc_study/create',
            timezone: 'Europe/Berlin',
            payload: { props: {
                name: 'Foo',
                runningPeriod: {
                    start: new Date('2020-01-01T00:00:00Z'),
                    end: null
                },
                experimentNames: [
                    'Foo Experiment'
                ],
                researchGroupIds: [ wkprc ],
                systemPermissions: {
                    accessRightsByResearchGroup: [
                        { researchGroupId: wkprc, permission: 'write' }
                    ],
                    isHidden: false,
                },
                
                custom: {
                    experimenterIds: [ alice ],
                    herlperPersonIds: [], // XXX: sic
                    equipmentLinks: [],
                    equipmentLocation: '',
                    doi: '',
                    description: '',
                },
            }}
        });
    })
})
