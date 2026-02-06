'use strict';
var chai = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var { copy } = require('copy-anything');
var { ejson, jsonify, omit, jsonpointer } = require('@mpieva/psydb-core-utils');
var {
    aggregateToArray,
    aggregateOne,
} = require('@mpieva/psydb-mongo-adapter');

var RootHandler = require('../../src/');

// FIXME: where to put that? core has no copy
var override = (bag) => {
    var { that, with: pairs } = bag;

    var clone = copy(that);
    for (var [pointer, value] of Object.entries(pairs)) {
        jsonpointer.set(clone, pointer, value);
    }
    return clone;
}

describe('subject/create', function () {
    var db;
    beforeEach(async function () {
        await this.restore('2025-06-09__1835');
        db = this.getDbHandle();

        this.fetchSeq = () => aggregateOne({ db, sequenceNumbers: {} });
    });

    it('does the thing', async function () {
        var login = await this.createFakeLogin({ email: 'root@example.com' });
        var [ sendMessage ] = this.createMessenger({ RootHandler, ...login });

        var researchGroupId = await this.getId('researchGroup', {
            shorthand: 'WKPRC'
        });

        var deltas = BaselineDeltas();
        deltas.push( await this.fetchSeq() );

        await sendMessage({
            type: 'subject/wkprc_chimpanzee/create',
            timezone: 'Europe/Berlin',
            payload: jsonify({ props: override({
                that: subjectDefaultProps,
                with: {
                    '/scientific/custom/name': 'Alice',
                    '/scientific/custom/wkprcIdCode': 'C_ALI_12345',
                    '/scientific/custom/biologicalGender': 'female',
                    '/scientific/systemPermissions/accessRightsByResearchGroup/0/researchGroupId': researchGroupId
                }
            })}),
        });
        
        deltas.push( await this.fetchSeq() );
        deltas.test({ expected: {
            '/subject/wkprc_chimpanzee': 6
        }});

        var alice = await this.getRecord('subject', { name: 'Alice' });
        
        await sendMessage({
            type: 'subject/wkprc_chimpanzee/patch',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                id: alice._id,
                props: {
                    gdpr: alice.gdpr.state,
                    scientific: omit({
                        from: alice.scientific.state,
                        paths: ['internals']
                    })
                }
            })
        });
        
        deltas.push( await this.fetchSeq() );
        deltas.test({ expected: {}});
        
        await sendMessage({
            type: 'subject/wkprc_chimpanzee/create',
            timezone: 'Europe/Berlin',
            payload: jsonify({ props: override({
                that: subjectDefaultProps,
                with: {
                    '/scientific/custom/name': 'Bob',
                    '/scientific/custom/wkprcIdCode': 'C_BOB_12346',
                    '/scientific/custom/biologicalGender': 'male',
                    '/scientific/systemPermissions/accessRightsByResearchGroup/0/researchGroupId': researchGroupId
                }
            })}),
        });
        
        deltas.push( await this.fetchSeq() );
        deltas.test({ expected: {
            '/subject/wkprc_chimpanzee': 7
        }});
    });
});

var subjectDefaultProps = {
    gdpr: { custom: {} },
    scientific: {
        comment: '',
        custom: {
            name: '',
            wkprcIdCode: '',
            biologicalGender: null,
            dateOfBirth: null,
            subSpeciesId: null,
            rearingHistoryId: null,
            originId: null,
            arrivalDate: null,
            arrivedFrom: '',
            locationId: null,
            motherId: null,
            fatherId: null,
            groupId: null,
            sensitive_comment: '',
        },
        systemPermissions: {
            isHidden: false,
            accessRightsByResearchGroup: [
                { permission: 'write',  researchGroupId: null }
            ]
        }
    }
}
