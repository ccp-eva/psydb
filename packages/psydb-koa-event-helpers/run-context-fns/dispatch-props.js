'use strict';
var { merge } = require('@mpieva/psydb-core-utils');
var { createInitialChannelState, pathifyProps }
    = require('@mpieva/psydb-api-lib');


var dispatchProps = async (context, args) => {
    var { db, dispatch } = context;

    var [{
        initialize, recordType, props = {},
        additionalSchemaCreatorArgs,
        ...pass
    }] = args;
    var { collection, subChannelKey } = pass;

    var defaults = {};
    if (initialize) {
        defaults = await createInitialChannelState({
            db,
            collection,
            subChannelKey,
            recordType,
            additionalSchemaCreatorArgs,
        });
        props = merge(defaults.state, props);
    }

    var pathified = pathifyProps({
        subChannelKey,
        props
    });

    return await dispatch({
        ...pass,
        payload: { $set: pathified }
    });
}

module.exports = dispatchProps;
