
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
                var any = input && input.any;
                var saneValues = (
                    input &&
                    input.values &&
                    input.values.filter(it => !!it)
                );
                if (any || saneValues && saneValues.length > 0) {
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
        participationInterval,
        ...pass
    } = values;

    var sanitized = {
        ...pass,
        ...(sequenceNumber && { sequenceNumber }),
        ...(didParticipateIn && {
            didParticipateIn: didParticipateIn.filter(it => !!it)
        }),
        ...(didNotParticipateIn && {
            didNotParticipateIn: didNotParticipateIn.filter(it => !!it)
        }),
        ...((participationInterval?.start || participationInterval?.end) && {
            participationInterval: {
                ...(participationInterval?.start && {
                    start: participationInterval.start
                }),
                ...(participationInterval?.end && {
                    end: participationInterval.end
                })
            }
        })
    }
    return sanitized;
}

export default sanitizeFormData;
