'use strict';
var { ejson, omit } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../src/');

var omitNonsense = ({ from }) => omit({
    from, paths: [ '_id', '_rohrpostMetadata' ]
});

describe('ageFrame/patch', function () {
    var db, sendMessage;
    beforeEach(async function () {
        await this.restore('2024-03-28__0556_humankind');
        
        db = this.getDbHandle();
        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));
    });

    it('does the thing', async function () {
        var studyId = ObjectId("6600f821a5f8769c528681df");
        var subjectSelectorId = ObjectId("6604cdcd8df35a1505347aac");

        var arabicId = ObjectId('6600f5e0a5f8769c52868145');
        var englishId = ObjectId('6600f5e0a5f8769c52868142');

        var koaContext = await sendMessage({
            type: 'ageFrame/create',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                studyId,
                subjectSelectorId,
                subjectTypeKey: 'humankindChild',
                props: {
                    interval: {
                        start: { years: 0, months: 0, days: 0 },
                        end: { years: 1, months: 1, days: 1 },
                    },
                    conditions: [
                        { pointer: '/gdpr/state/custom/gender', values: [
                            'male', 'female'
                        ]},
                        { 
                            pointer: '/scientific/state/custom/nativeLanguageId',
                            values: [ arabicId, englishId ]
                        }
                    ]
                }
            })
        });

        var { body } = koaContext.response;
        var [{ channelId: ageFrameId }] = body.data;

        koaContext = await sendMessage({
            type: 'ageFrame/patch',
            timezone: 'Europe/Berlin',
            payload: jsonify({ id: ageFrameId, props: {
                interval: {
                    start: { years: 0, months: 0, days: 0 },
                    end: { years: 2, months: 2, days: 2 },
                },
                conditions: [
                    { pointer: '/gdpr/state/custom/gender', values: [
                        'female'
                    ]},
                    { 
                        pointer: '/scientific/state/custom/nativeLanguageId',
                        values: [ arabicId ]
                    }
                ]
            }})
        });

        var record = omitNonsense({
            from: await this.getRecord('ageFrame', {
                _id: ageFrameId
            })
        });

        console.dir(ejson(record), { depth: null });
        expect(ejson(record)).toMatchSnapshot();
    })
})
