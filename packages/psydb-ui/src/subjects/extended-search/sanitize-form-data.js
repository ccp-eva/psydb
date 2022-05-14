
const sanitizeFormData = (fieldDefinitions, formData) => {
    var {
        specialFilters,
        customGdprFilters,
        customScientificFilters
    } = formData;

    var sanitized = {
        ...formData,
        specialFilters: sanitizeSpecialFilters(specialFilters),
        customGdprFilters: sanitizeCustomFieldValues({
            fieldDefinitions,
            subChannelKey: 'gdpr',
            values: customGdprFilters,
        }),
        customScientificFilters: sanitizeCustomFieldValues({
            fieldDefinitions,
            subChannelKey: 'scientific',
            values: customScientificFilters,
        }),
    };

    //console.log('sanitized', sanitized);

    return sanitized;
}

const sanitizeCustomFieldValues = (options) => {
    var {
        fieldDefinitions, subChannelKey, values
    } = options;

    var sanitized = {};
    for (var field of fieldDefinitions[subChannelKey]) {
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
    var {
        sequenceNumber,
        didParticipateIn,
        didNotParticipateIn,
        ...pass
    } = values;

    var sanitized = {
        ...pass,
        ...(typeof sequenceNumber === 'number' && { sequenceNumber }),
        ...(didParticipateIn && {
            didParticipateIn: didParticipateIn.filter(it => !!it)
        }),
        ...(didNotParticipateIn && {
            didNotParticipateIn: didNotParticipateIn.filter(it => !!it)
        })
    }
    return sanitized;
}

export default sanitizeFormData;
