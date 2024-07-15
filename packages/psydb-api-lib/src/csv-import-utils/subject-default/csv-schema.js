'use strict';
var { entries, groupBy, keyBy } = require('@mpieva/psydb-core-utils');
var Fields = require('@mpieva/psydb-schema-fields');

var createSchemaFromDef = (def) => {
    var { systemType, props = {}} = def;
    return Fields[systemType](props);
}

var CSVSchema = (bag) => {
    var { subjectCRT } = bag;

    var custom = groupBy({
        items: subjectCRT.allCustomFields(),
        byProp: 'subChannel'
    });

    for (var [ subChannel, defs ] of entries(custom)) {
        custom[subChannel] = keyBy({
            items: defs, byProp: 'key', transform: createSchemaFromDef
        })
    }

    var schema = Fields.ClosedObject({
        'gdpr': Fields.ClosedObject({
            'state': Fields.ClosedObject({
                'custom': Fields.ExactObject({
                    properties: custom.gdpr,
                    required: [], // TODO
                })
            })
        }),
        'scientific': Fields.ClosedObject({
            'state': Fields.ClosedObject({
                'custom': Fields.ExactObject({
                    properties: custom.scientific,
                    required: [] // TODO
                }),
                'comment': Fields.FullText(),
                
                // TODO: enable based on crt settings
                //'testingPermissions': Fields.ExactObject({
                //    properties: {
                //        'inhouse': Fields.ExtBool(),
                //        'awayTeam': Fields.ExtBool(),
                //        'onlineVideoCall': Fields.ExtBool(),
                //        'onlineSurvey': Fields.ExtBool(),
                //    },
                //    required: []
                //})
            })
        }),
    })

    return schema;
}

module.exports = CSVSchema;
