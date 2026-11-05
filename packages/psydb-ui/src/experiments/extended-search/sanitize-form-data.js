const sanitizeFormData = (formData) => {
    var { specialFilters, ...pass } = formData;
    var { subjectType } = specialFilters || {};

    return {
        ...pass,
        // NOTE: enables subject columns
        ...(subjectType && { subjectType }),
        specialFilters: sanitizeSpecialFilters(specialFilters),
    };
}

const sanitizeSpecialFilters = (values) => {
    var {
        labMethods, interval,
        studyIds, subjectType, subjectIds, experimentOperatorIds,
        isPostprocessed,
    } = values;

    var saneLabMethods = (
        Object.keys(labMethods || {}).filter(key => labMethods[key])
    );
    var saneInterval = {
        ...(interval?.start && { start: interval.start }),
        ...(interval?.end && { end: interval.end }),
    };

    return {
        ...(saneLabMethods.length > 0 && { labMethods: saneLabMethods }),
        ...(Object.keys(saneInterval).length > 0 && {
            interval: saneInterval
        }),
        ...(studyIds && { studyIds: studyIds.filter(it => !!it) }),
        // NOTE: subjectType is only used for the subject picker
        ...(subjectIds && { subjectIds: subjectIds.filter(it => !!it) }),
        ...sanitizeNegatableIds(
            'experimentOperatorIds', experimentOperatorIds
        ),
        ...(isPostprocessed && { isPostprocessed }),
    };
}

const sanitizeNegatableIds = (key, input) => {
    if (!input) {
        return {};
    }
    if (input.any) {
        return { [key]: input };
    }
    var values = (input.values || []).filter(it => !!it);
    return (
        values.length > 0
        ? { [key]: { ...input, values }}
        : {}
    );
}

export default sanitizeFormData;
