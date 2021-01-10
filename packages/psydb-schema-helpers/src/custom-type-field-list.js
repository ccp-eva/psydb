'use strict';
// FIXME: maxbe ExactObject should not be in that package
var {
    ExactObject,
    IdentifierString,
} = require('@mpieva/psydb-schema-fields');

var FieldDefinition = ({
    type,
    props,
    requiredProps = [],
}) => ExactObject({
    properties: {
        type: { const: type },
        key: IdentifierString(),
        props: ExactObject({
            properties: props || {},
            required: requiredProps
        }),
    },
    required: [
        'key',
        'type',
        ...(requiredProps.length ? [ 'props' ] : [])
    ]
});

var Available = {};

Available.Address = FieldDefinition({
    type: 'Address',
});

Available.BiologicalGender = FieldDefinition({
    type: 'BiologicalGender'
});

Available.BlockedWeekdays = FieldDefinition({
    type: 'BlockedWeekdays'
});

Available.DateTime = FieldDefinition({
    type: 'DateTime'
});

Available.DateTimeInterval = FieldDefinition({
    type: 'DateTimeInterval'
});

Available.ExtBool = FieldDefinition({
    type: 'ExtBool'
});

Available.EmailList = FieldDefinition({
    type: 'EmailList'
});

Available.PhoneList = FieldDefinition({
    type: 'PhoneList'
});

Available.ForeignId = FieldDefinition({
    type: 'ForeignId'
});

Available.FullText = FieldDefinition({
    type: 'FullText'
});

Available.IdentifierString = FieldDefinition({
    type: 'IdentifierString'
});

Available.ParticipationStatus = FieldDefinition({
    type: 'ParticipationStatus'
});

Available.SaneString = FieldDefinition({
    type: 'SaneString'
});

Available.Time = FieldDefinition({
    type: 'Time'
});

Available.TimeInterval = FieldDefinition({
    type: 'TimeInterval'
});

Available.SpecialHumanName = FieldDefinition({
    type: 'SpecialHumanName'
});

Available.HelperItemId = FieldDefinition({
    type: 'HelperItemId'
});

Available.HelperItemIdList = FieldDefinition({
    type: 'HelperItemIdList'
});


var CustomTypeFieldList = () => ({
    type: 'array',
    default: [],
    items: {
        oneOf: Object.values(Available)
    }
})

module.exports = CustomTypeFieldList;
