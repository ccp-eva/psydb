'use strict';
var {
    ExactObject,
    MaxObject,
    DefaultArray,
    JsonPointer,
    Integer,
    DefaultBool,
    StringEnum,
    ForeignIdList,
    DateOnlyServerSideInterval,
    Timezone,
} = require('@mpieva/psydb-schema-fields');

var enums = require('@mpieva/psydb-schema-enums');

var NegatableForeignIdList = (bag) => {
    // FIXME: not sure if MaxObject is correct though
    var schema = MaxObject({
        'any': DefaultBool(),
        'negate': DefaultBool(),
        'values': ForeignIdList({ ...bag })
    });

    return schema;
}

var TriStateBool = () => StringEnum([ 'any', 'only-true', 'only-false' ]);

var BodySchema = () => {
    var required = {
        'specialFilters': MaxObject({
            'labMethods': DefaultArray({
                items: StringEnum(enums.labMethods.keys),
            }),
            'interval': DateOnlyServerSideInterval({ required: [] }),
            'studyIds': ForeignIdList({ collection: 'study' }),
            'subjectIds': ForeignIdList({ collection: 'subject' }),
            'experimentOperatorIds': NegatableForeignIdList({
                collection: 'personnel'
            }),
            'isCanceled': TriStateBool(),
            'isPostprocessed': TriStateBool(),
        }),
        'columns': DefaultArray({
            items: JsonPointer(),
            minItems: 1,
        }),
        'timezone': Timezone(),
    };

    var optional = {
        'sort': MaxObject({
            'column': JsonPointer(),
            'direction': StringEnum([ 'asc', 'desc' ]),
        }),
        'offset': Integer({ minimum: 0 }),
        'limit': Integer({ maximum: 1000 }),
    };

    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required)
    });

    return schema;
}

module.exports = BodySchema;
