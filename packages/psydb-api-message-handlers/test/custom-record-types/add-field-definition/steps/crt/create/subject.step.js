'use strict';
var { jsonpointer, ucfirst } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var CREATE_SUBJECT_CRT = (recordType, options = {}) => {

    var tag = `custom-record-types/create subject ${recordType}`;

    return step(tag, async function () {
        var { ids, send, deltas } = this.bag;
        var now = new Date();

        var displayName_EN = `${ucfirst(recordType)} EN`;
        var displayName_DE = `${ucfirst(recordType)} DE`;

        var payload = {
            'collection': 'subject',
            'type': recordType,
            'props': {
                'label': displayName_EN,
                'displayNameI18N': { 'de': displayName_DE }
            }
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: 'custom-record-types/create',
            timezone: 'Europe/Berlin',
            payload
        }));

        await deltas.update();
        var [ index ] = deltas.findEntry('crt', channelId);

        deltas.crt.test({ expected: { [index]: {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'collection': 'subject',
            'type': recordType,
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
        jsonpointer.set(this, `/cachedIds/crt/${recordType}`, channelId)
    })
}

module.exports = CREATE_SUBJECT_CRT;
