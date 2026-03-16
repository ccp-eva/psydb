'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

describe('personnel/create', function () {
    var db;
    beforeEach(async function () {
        await this.restore('init-minimal');
        db = this.getDbHandle();
    });

    it('does the thing', async function () {
        var login = await this.createFakeLogin({ email: 'root@example.com' });
        var [ sendMessage ] = this.createMessenger({ ...login });

        var { modifiedChannels: [{ channelId: researchGroupId }] } = await (
            sendMessage({
                type: 'researchGroup/create', timezone: 'Europe/Berlin',
                payload: { props: {
                    'name': 'Some Research Group',
                    'shorthand': 'SomeLab',
                    'address': {},
                    'description': '',
                }}
            })
        );

        var deltas = BaselineDeltas();
        deltas.push( await this.fetchAllRecords('personnel') );

        var payload = { sendMail: false, props: {
            gdpr: {
                firstname: 'Bob',
                lastname: 'Bauer',
                emails: [{ email: 'bob@example.com', isPrimary: true }],
                phones: [],
                description: '',
            },
            scientific: {
                canLogIn: false,
                hasRootAccess: false,

                researchGroupSettings: [],
                systemPermissions: {
                    accessRightsByResearchGroup: [
                        { researchGroupId, permission: 'write' },
                    ],
                    isHidden: false,
                }
            }
        }}

        await sendMessage({
            type: 'personnel/create', timezone: 'Europe/Berlin',
            payload
        });
        
        deltas.push( await this.fetchAllRecords('personnel') );
        deltas.test({ expected: {
            '/1/_id': BaselineDeltas.AnyObjectId(),
            '/1/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/sequenceNumber': '2',
            '/1/isDummy': false,
            '/1/gdpr/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/gdpr/state':{
                ...payload.props.gdpr,
                'internals': { 'lastPasswordChange': null }
            },
            '/1/scientific/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/scientific/state': {
                ...payload.props.scientific,
                'internals': {}
            }
        }, asFlatEJSON: true });
    });

});
