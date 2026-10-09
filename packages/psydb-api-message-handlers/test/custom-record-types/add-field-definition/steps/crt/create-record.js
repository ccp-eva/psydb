'use strict';
var { jsonpointer, ucfirst } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var CREATE_RECORD = (options) => {
    var {
        collection, recordType,
        as: cacheAs,
        withCachedCRT = false,
        data,
    } = options;

    var tag = `${collection}/${recordType}/create`;
    if (withCachedCRT) {
        tag = `CRT(${withCachedCRT}) : ${tag}`;
    }
    if (cacheAs) {
        tag = `${tag} as "${cacheAs}"`
    }

    return step(tag, async function () {
        var { ids, send, deltas, currentCrtId } = this.bag;

        var crt = undefined;
        if (collection) {
            crt = await this.aggregateOne({ customRecordType: {
                'collection': collection,
                ...(recordType && { 'type': recordType })
            }});
        }
        else if (withCachedCRT) {
            crt = await this.aggregateOne({ customRecordType: {
                '_id': this.cachedIds.crt[withCachedCRT]
            }});
        }
        else if (currentCrtId) {
            crt = await this.aggregateOne({ customRecordType: {
                '_id': currentCrtId
            }});
        }

        if (!crt) {
            throw new Error('could not determine crt');
        }

        console.ejson(crt);

        var payloadSubChannels = [];
        var payload = { props: {} };
        if (Array.isArray(data)) {
            for (var it of data) {
                var { subChannel, data: subChannelData } = it;
                payload.props[subChannel] = subChannelData;
                payloadSubChannels.push(subChannel);
            }
        }
        else {
            payload.props = data;
        }

        var [{ channelId }] = await KOA_CHANNELS(send({
            type: `${crt.collection}/${crt.type}/create`,
            timezone: 'Europe/Berlin',
            payload
        }));
        
        await deltas.update();
        var [ index ] = deltas.findEntry(crt.collection, channelId);

        deltas[crt.collection].test({ expected: { [index]: {
            '_id': BaselineDeltas.AnyObjectId(),
            '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            'scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            },
            'gdpr': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            }
        }}, asFlatEJSON: true });

        if (cacheAs) {
            jsonpointer.set(
                this, `/cachedIds/${collection}/${cacheAs}`, channelId
            );
        }
    })
}

module.exports = CREATE_RECORD;
