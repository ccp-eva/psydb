'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

describe('personnel/[create|patch|clean-gdpr] flow', function () {
    var db, sendMessage, researchGroupId, rootsId, bobsId;
    before(async function () {
        await this.restore('init-minimal');
        db = this.getDbHandle();

        var login = await this.createFakeLogin({ email: 'root@example.com' });
        ([ sendMessage ] = this.createMessenger({ ...login }));
        rootsId = login.session.personnelId;
        
        var [{ channelId }] = await KOA_CHANNELS(sendMessage({
            type: 'researchGroup/create', timezone: 'Europe/Berlin',
            payload: { props: {
                'name': 'Some Research Group',
                'shorthand': 'SomeLab',
                'address': {},
                'description': '',
            }}
        }));
        researchGroupId = channelId;
    });

    step('does create', async function () {
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

        var [{ channelId }] = await KOA_CHANNELS(sendMessage({
            type: 'personnel/create', timezone: 'Europe/Berlin',
            payload
        }));
        
        deltas.push( await this.fetchAllRecords('personnel') );
        deltas.test({ expected: {
            '/1/_id': BaselineDeltas.AnyObjectId(),
            '/1/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/sequenceNumber': '2',
            '/1/isDummy': false,
            '/1/gdpr/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/gdpr/state':{
                ...payload.props.gdpr,
                'internals': {
                    'lastPasswordChange': BaselineDeltas.AnyDate()
                }
            },
            '/1/scientific/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/scientific/state': {
                ...payload.props.scientific,
                'internals': {}
            }
        }, asFlatEJSON: true });

        bobsId = channelId;
    });
    
    step('does patch', async function () {
        var deltas = BaselineDeltas();
        deltas.push( await this.fetchAllRecords('personnel') );

        var payload = { id: bobsId, props: {
            gdpr: {
                firstname: 'Bob',
                lastname: 'Bauer2',
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
            type: 'personnel/patch', timezone: 'Europe/Berlin',
            payload
        });
        
        deltas.push( await this.fetchAllRecords('personnel') );
        deltas.test({ expected: {
            '/1/gdpr/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/scientific/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/gdpr/state/lastname': 'Bauer2',
        }, asFlatEJSON: true });
    });

    step('does clean-gdpr', async function () {
        var deltas = BaselineDeltas();
        deltas.push({
            'staff': await this.fetchAllRecords('personnel'),
            'shadow': await this.fetchAllRecords('personnelShadow'),
            'events': await this.fetchAllRecords('rohrpostEvents'),
        });

        var payload = { _id: bobsId }

        await sendMessage({
            type: 'personnel/clean-gdpr', timezone: 'Europe/Berlin',
            payload
        });
        
        deltas.push({
            'staff': await this.fetchAllRecords('personnel'),
            'shadow': await this.fetchAllRecords('personnelShadow'),
            'events': await this.fetchAllRecords('rohrpostEvents'),
        });
        deltas.test({ expected: {
            '/staff/1/gdpr/_rohrpostMetadata':
                BaselineDeltas.AnyRohrpostMeta(),
            '/staff/1/gdpr/_rohrpostMetadata/EXECUTED_MAKE_CLEAN': true,
            '/staff/1/gdpr/state': '[[REDACTED]]',

            '/shadow/1/setAt': BaselineDeltas.AnyDate(),
            //'/shadow/1/setBy': rootsId, // FIXME root also set it initially
            '/shadow/1/passwordHash': '[[REDACTED]]',

            '/events/4/message/payload': '[[REDACTED]]',
            '/events/6/message/payload': '[[REDACTED]]',
            '/events/8': {
                '_id': BaselineDeltas.AnyObjectId(),
                'correlationId': BaselineDeltas.AnyObjectId(),
                'sessionId': BaselineDeltas.AnyObjectId(),
                'timestamp': BaselineDeltas.AnyDate(),
                'collectionName': 'personnel',
                'channelId': bobsId,
                'subChannelKey': 'gdpr',
                'message/personnelId': rootsId,
                'message/type': 'MAKE_CLEAN',
                'message/payload/~1$set': {
                    '~1gdpr~1_rohrpostMetadata~1EXECUTED_MAKE_CLEAN': true,
                    '~1gdpr~1state': '[[REDACTED]]',
                }
            }
        }, asFlatEJSON: true });
    });
});
