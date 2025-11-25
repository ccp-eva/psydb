'use strict';
var { pathify, merge, seperateNulls } = require('@mpieva/psydb-core-utils');

var executeSystemEvents = async (context) => {
    var { message, cache, dispatch } = context;
    var { studyConsentFormId, subjectId, props } = message.payload;
    var { studyConsentForm, subject } = cache.get();
    var { type: subjectType } = subject;


    var pathified = merge(
        //createDefaults(StudyConsentTemplate.State()), // TODO
        pathify(props, { prefix: 'state' }),
    );
    // NOTE: mongodb does not allow nested $set path on values that are null
    // i.e. 'state.foo' = null and { $set: 'state.foo.a': 42 }
    var { values: SET } = seperateNulls({ from: pathified });

    await dispatch({
        collection: 'studyConsentDoc',
        isNew: true,
        
        extraCreateProps: {
            studyConsentFormId,
            subjectId,
            subjectType
        },

        payload: { $set: {
            ...SET,
            'state.studyConsentFormSnapshot': studyConsentForm,
        }}
    });
}

module.exports = { executeSystemEvents }
