'use strict';
var { pathify, merge, seperateNulls } = require('martaflex-core-utils');

var executeSystemEvents = async (context) => {
    var { message, dispatch } = context;
    var { studyId, subjectType, props, } = message.payload;

    var pathified = merge(
        //createDefaults(StudyConsentTemplate.State()), // TODO
        pathify(props, { prefix: 'state' }),
    );
    // NOTE: mongodb does not allow nested $set path on values that are null
    // i.e. 'state.foo' = null and { $set: 'state.foo.a': 42 }
    var { values: SET } = seperateNulls({ from: pathified });

    await dispatch({
        collection: 'studyConsentTemplate',
        isNew: true,
        
        extraCreateProps: { studyId, subjectType },
        payload: { $set: SET }
    });
}

module.exports = { executeSystemEvents }
