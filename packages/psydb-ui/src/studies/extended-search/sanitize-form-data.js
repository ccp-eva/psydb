import { only } from '@mpieva/psydb-core-utils';

const sanitizeFormData = (fieldDefinitions, formData) => {
    var {
        specialFilters,
        customFilters,
    } = formData;

    var sanitized = {
        ...formData,
        specialFilters: sanitizeSpecialFilters(specialFilters),
        customFilters: sanitizeCustomFieldValues({
            fieldDefinitions,
            values: customFilters,
        }),
    };

    //console.log('sanitized', sanitized);

    return sanitized;
}

const sanitizeCustomFieldValues = (options) => {
    var {
        fieldDefinitions, values
    } = options;

    var sanitized = {};
    for (var field of fieldDefinitions) {
        var { key, type } = field;
        switch (type) {
            case 'ForeignId':
            case 'ForeignIdList':
            case 'HelperSetItemId':
            case 'HelperSetItemIdList':
                var input = values[key];
                var saneValues = (
                    input &&
                    input.values &&
                    input.values.filter(it => !!it)
                );
                if (saneValues && saneValues.length > 0) {
                    sanitized[key] = {
                        ...input,
                        values: saneValues
                    };
                }
                break;
            default:
                sanitized[key] = values[key];
        }
    }
    return sanitized;
}

const sanitizeSpecialFilters = (values) => {
    var sanitized = sanitizeCustomFieldValues({
        fieldDefinitions: [
            { key: 'scientistIds', type: 'ForeignIdList' },
            { key: 'studyTopicIds', type: 'ForeignIdList' },
            { key: 'researchGroupIds', type: 'ForeignIdList' },
        ],
        values
    })
    var { studyId, sequenceNumber, isHidden, name, shorthand } = values;
    return {
        studyId, name, shorthand,
        ...(sequenceNumber && { sequenceNumber }),
        ...(isHidden !== '' && { isHidden }),
        ...sanitized,
    };
}

export default sanitizeFormData;
