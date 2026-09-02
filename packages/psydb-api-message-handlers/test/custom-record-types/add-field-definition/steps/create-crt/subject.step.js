'use strict';
var { ucfirst } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var CREATE_SUBJECT_CRT = (type, options = {}) => {
    return step('custom-record-type/create subject', async function () {
        var { ids, send, deltas } = this.bag;
        var now = new Date();

        var displayName_EN = `${ucfirst(type)} EN`;
        var displayName_DE = `${ucfirst(type)} DE`;

        var payload = {
            'collection': collection,
            'type': type,
            'props': {
                'label': displayName_EN,
                'displayNameI18N': { 'de': displayName_DE }
            }
        }
        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'custom-record-type/create',
            timezone: 'Europe/Berlin',
            payload
        }));

        await deltas.update();

        deltas.test({ expected: { '0': {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'collection': 'subject',
            'type': type,
            'state': {
                'isDirty': true,
                'isNew': true,
                
                'showOnlineId': true,
                'showSequenceNumber': true,
                'requiresTestingPermissions': true,
                'commentFieldIsSensitive': false,
                
                'label': displayName_EN,
                'displayNameI18N': { de: displayName_DE },
                
                'recordLabelDefinition': {
                    format: '${#}',
                    tokens: [ { systemType: 'Id', dataPointer: '/_id' } ]
                },
                'settings': { subChannelFields: {
                    gdpr: [], scientific: []
                }},
                'nextSettings': { subChannelFields: {
                    gdpr: [], scientific: []
                }},
                'formOrder': [],
                'tableDisplayFields': [],
                'optionListDisplayFields': [],
                
                'selectionRowDisplayFields': [],
                'selectionSummaryDisplayFields': [],
                'awayTeamSelectionRowDisplayFields': [],
                'inviteConfirmationSummaryDisplayFields': [],
            }
        }}, asFlatEJSON: true });
        
        this.bag.currentCrtId = channelId;
    })
}

module.exports = CREATE_SUBJECT_CRT;
