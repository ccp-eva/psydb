'use strict';
var { omit } = require('@mpieva/psydb-core-utils');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_CHANNELS } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var CRT_COMMIT_SETTINGS = (options) => {
    var {
        collection, recordType,
        withCachedCRT = false,
    } = options;

    var tag = 'custom-record-types/commit-settings';
    if (withCachedCRT) {
        tag = `CRT(${withCachedCRT}) : ${tag}`;
    }

    return step(tag, async function () {
        var { ids, send, deltas, currentCrtId } = this.bag;

        var crt = undefined;
        if (collection && recordType) {
            crt = await this.aggregateOne({ customRecordType: {
                'collection': collection,
                'type': recordType
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

        var payload = { id: crt._id };

        await send({
            type: 'custom-record-types/commit-settings',
            timezone: 'Europe/Berlin',
            payload
        });
        // TODO: check response
        
        await deltas.update();
        var [ index ] = deltas.findEntry('crt', crt._id);

        var expected = createExpected({ originalCrt: crt });

        deltas.crt.test({ expected: {
            [index]: expected
        }, asFlatEJSON: true });
    })
}

var createExpected = (bag) => {
    var { originalCrt } = bag;
    var { collection, state } = originalCrt;
    var { nextSettings } = state;

    var expected = {
        '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
        'state': {
            'isNew': false,
            'isDirty': false,
            'formOrder': [
                '/sequenceNumber',
                '/onlineId',
                '/scientific/state/comment',
                '/scientific/state/testingPermissions',
            ],
            'settings': {},
            'nextSettings': {},
        }
    };
    if (nextSettings.fields) {
        var { fields } = nextSettings;

        expected.state.settings.fields = fields.map(
            it => omit({ from: it, paths: [ 'isNew', 'isDirty' ]})
        );
        expected.state.nextSettings.fields = fields.map(
            it => ({ 'isNew': false, 'isDirty': false })
        );

        for (var f of fields) {
            expected.state.formOrder.push(it => it.pointer);
        }
    }
    else {
        for (var sc of Object.keys(nextSettings.subChannelFields)) {
            var fields = nextSettings.subChannelFields[sc];
            var target;

            target = expected.state.settings.subChannelFields = {};
            target[sc] = fields.map(
                it => omit({ from: it, paths: [ 'isNew', 'isDirty' ]})
            );
            target = expected.state.nextSettings.subChannelFields = {};
            target[sc] = fields.map(
                it => ({ 'isNew': false, 'isDirty': false })
            );

            for (var f of fields) {
                expected.state.formOrder.push(it => it.pointer);
            }
        }
    }

    return expected;
}

module.exports = CRT_COMMIT_SETTINGS;
