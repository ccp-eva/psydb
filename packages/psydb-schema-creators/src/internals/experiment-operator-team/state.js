'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    ForeignIdList,
    SaneString,
    Color,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var ExperimentOperatorTeamState = ({
    enableInternalProps
} = {}) => {
    var schema = ExactObject({
        properties: {
            /*name: SaneString({
                title: 'Bezeichnung',
                minLength: 1,
            }),*/
            color: Color({
                title: 'Farbe',
                default: '#00ff00',
            }),
            // is now kept outside of state as it should
            // probably be immutable
            // TODO: should i handle the immutability via enableInternalProps?
            /*studyId: ForeignId({
                collection: 'study',
            }),*/
            personnelIds: ForeignIdList({
                title: 'Experimenter:innen',
                collection: 'personnel',
                minItems: 1,
            }),
            hidden: DefaultBool({
                title: 'Ausgeblendet',
                //systemType: 'SelectBool',
            }),
            ...(enableInternalProps && {
                // anything here?
            })
        },
        required: [
            //'name',
            'color',
            'personnelIds',
            ...(
                enableInternalProps
                ? [ /* ??? */ ]
                : []
            ),
        ],
    });

    return schema;
};

module.exports = ExperimentOperatorTeamState;
