'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var createPayload = (bag) => {
    var {
        currentCrtId, type, key, props,
        subChannelKey = undefined, 
    } = bag;
    
    var displayName_EN = `${type} Dummy key=${key}`;
    var displayName_DE = `${type} Platzhalter key=${key}`;

    var payload = {
        'id': currentCrtId,
        ...(subChannelKey && {
            'subChannelKey': subChannelKey,
        }),
        'props': {
            'key': key,
            'type': type,
            'displayName': displayName_EN,
            'displayNameI18N': { de: displayName_DE },
            'props': props,
        },
    }

    return payload;
}

var createExpectedCRTDelta = (bag) => {
    var { payload, extraDefinitionAttributes = {} } = bag;
    var { subChannelKey = undefined, props } = payload;

        var container = (
            subChannelKey
            ? `state/nextSettings/subChannelFields/${subChannelKey}`
            : 'state/nextSettings/fields'
        )

    var expected = {
        '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
        [container]: [{
            'key': props.key,
            'type': props.type,
            'displayName': props.displayName,
            'displayNameI18N': props.displayNameI18N,
            'props': {
                ...props.props,
                ...extraDefinitionAttributes
            }
            'pointer': (
                subChannelKey
                ? `/${subChannelKey}/state/custom/${key}`
                : `/state/custom/${key}`
            ),
            'isNew': true,
            'isDirty': true
        }]
    }

    return expected;
}

module.exports = {
    createPayload,
    createExpectedCRTDelta
}
