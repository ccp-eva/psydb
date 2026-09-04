'use strict';
var { jsonpointer, ucfirst } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var CREATE_LOCATION_CRT = (recordType, options = {}) => {

    var tag = `custom-record-types/create location ${recordType}`;

    return step(tag, async function () {
        var { ids, send, deltas } = this.bag;
        var now = new Date();

        var displayName_EN = `${ucfirst(recordType)} EN`;
        var displayName_DE = `${ucfirst(recordType)} DE`;

        var payload = {
            'collection': 'location',
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

        // FIXME: we need to find by id here to properly test stuff
        await deltas.update();

        var index = deltas.getCurrent().findIndex((it) => {
            //console.log(it._id['$oid'], String(channelId));
            return it._id['$oid'] === String(channelId)
        });
        //console.log({ channelId, index });

        deltas.test({ expected: { [index]: {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'collection': 'location',
            'type': recordType,
            'state': {
                'isDirty': true,
                'isNew': true,
            
                'reservationType': 'inhouse',
                
                'label': displayName_EN,
                'displayNameI18N': { de: displayName_DE },
                
                'recordLabelDefinition': {
                    format: '${#}',
                    tokens: [ { systemType: 'Id', dataPointer: '/_id' } ]
                },
                'settings': { fields: [] },
                'nextSettings': { fields: [] },
                'formOrder': [],
                'tableDisplayFields': [],
                'optionListDisplayFields': [],
            }
        }}, asFlatEJSON: true });
       
        var record = await this.aggregateOne({ customRecordType: {
            '_id': channelId
        }});
        
        this.bag.currentCrtId = channelId;
        this.bag.currentCrt = record;
        jsonpointer.set(this, `/cache/crt/${recordType}`, record)
    })
}

module.exports = CREATE_LOCATION_CRT;
