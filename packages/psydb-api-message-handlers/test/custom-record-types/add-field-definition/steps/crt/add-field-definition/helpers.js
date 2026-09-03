'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');

var createPayload = (bag) => {
    var {
        currentCrtId, systemType, key, props,
        subChannelKey = undefined, 
    } = bag;
    
    var displayName_EN = `${systemType} Dummy key=${key}`;
    var displayName_DE = `${systemType} Platzhalter key=${key}`;

    var payload = {
        'id': currentCrtId,
        ...(subChannelKey && {
            'subChannelKey': subChannelKey,
        }),
        'props': {
            'key': key,
            'type': systemType,
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
            },
            'pointer': (
                subChannelKey
                ? `/${subChannelKey}/state/custom/${props.key}`
                : `/state/custom/${props.key}`
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
