'use strict';

var PersonnelGdprState = require('./gdpr-state'),
    PersonnelScientificState = require('./scientific-state');

var PersonnelMessage = ({
    subChannelSchemas: {
        scientific: PersonnelScientificState,
        gdpr: PersonnelGdprState
    }
});

//
// create = () => {},
// patch = () => {}
// ...
var messages = ExperimentOperatorTeamMessages({
    staticCreateProps: {
        'studyId': ForeignId({ collection: 'study' })
    },
    subChannelStates: {
        scientific: PersonnelScientificState,
        gdpr: PersonnelGdprState
    }
    // state: ExperimentOperatorTeamState
})

var ExperimentOperatorTeamRecordMessage = ({
    type,
    op, // create/patch/delete
    customSubChannelSchemas,
}) => {
    RecordMessage({
        op,
        customStateSchema,

        staticCreateProps: {
            'studyId': ForeigntId({ collection: 'study' })
        },
        state: ExperimentOperatorTeamState
    })
}

module.exports = {
    PersonnelGdprState: require('./gdpr-state'),
    PersonnelScientificState: require('./scientific-state'),
    PersonnelRecordMessage,
};
