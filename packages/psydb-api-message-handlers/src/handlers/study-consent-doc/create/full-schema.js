'use strict';
var Fields = require('@mpieva/psydb-schema-fields');
var { ExactObject, ClosedObject, ForeignId, ForeignIdList } = Fields;

var FullSchema = (bag) => {
    var { studyConsentForm, subjectCRT } = bag;

    var required = {
        'studyConsentFormId': ForeignId({ collection: 'studyConsentForm' }),
        'subjectId': ForeignId({ collection: 'subject' }),
        'labOperatorIds': ForeignIdList({
            collection: 'personnel', minItems: 1
        }),
        'props': ClosedObject({
            'elementValues': ElementValues({ studyConsentForm, subjectCRT }),
        }),
    }
    var optional = {
        'experimentId': ForeignId({ collection: 'experiment' })
    }

    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required),
    });
    
    return schema;
}

var ElementValues = (bag) => {
    var { studyConsentForm, subjectCRT } = bag;
    var { elements } = studyConsentForm.state;

    var required = {};
    var optional = {};
    for (var [ ix, it ] of elements.entries()) {
        var { type, isRequired } = it;
        var target = isRequired ? required : optional;

        if (['subject-field', 'extra-field'].includes(type)) {
            var ElementValue = switchType(type);
            target[ix] = ElementValue({ definition: it, subjectCRT });
        }
    }
    
    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required)
    });

    return schema;
}

var switchType = (type) => {
    switch (type) {
        case 'subject-field':
            return SubjectFieldValue;
        case 'extra-field':
            return ExtraFieldValue;
        default:
            throw new Error(`unknown element type "${type}"`)
    }
}

var SubjectFieldValue = (bag) => {
    var { definition, subjectCRT } = bag;
    var { pointer, isRequired } = definition;
   
    var { systemType, props } = subjectCRT.findOneCustomField({ pointer });

    if (isRequired) {
        if (['SaneString', 'FullText'].includes(systemType)) {
            props.minLength = 1;
        }
    }
    
    var schema = Fields[systemType](props);
    return schema;
}

var ExtraFieldValue = (bag) => {
    var { definition } = bag;
    var { systemType, isRequired, requiredValue = 'any' } = definition;

    var props = {};
    if (isRequired) {
        if (['SaneString', 'FullText'].includes(systemType)) {
            props.minLength = 1;
        }
        if (requiredValue !== 'any') {
            props.const = requiredValue;
        }
    }

    console.log(systemType);
    var schema = Fields[systemType](props);
    return schema;
}


module.exports = FullSchema;
