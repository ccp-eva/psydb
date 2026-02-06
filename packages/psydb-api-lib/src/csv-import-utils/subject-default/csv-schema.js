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

    var required = groupBy({
        items: subjectCRT.findRequiredCustomFields(),
        byProp: 'subChannel',
        transform: (it) => it.key
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
                    required: required.gdpr,
                })
            })
        }),
        'scientific': Fields.ClosedObject({
            'state': Fields.ExactObject({
                properties: {
                    'custom': Fields.ExactObject({
                        properties: custom.scientific,
                        required: required.scientific
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
                },
                required: [ 'custom' ]
            })
        }),
    })

    return schema;
}

module.exports = CSVSchema;
