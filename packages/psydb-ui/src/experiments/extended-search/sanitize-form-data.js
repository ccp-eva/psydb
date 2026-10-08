const sanitizeFormData = (formData) => {
    var { specialFilters, ...pass } = formData;

    return {
        ...pass,
        specialFilters: sanitizeSpecialFilters(specialFilters),
    };
}

const sanitizeSpecialFilters = (values) => {
    var {
        labMethods, interval,
        studyIds, experimentOperatorIds,
        isCanceled, isPostprocessed,
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
        ...sanitizeNegatableIds('studyIds', studyIds),
        ...sanitizeNegatableIds(
            'experimentOperatorIds', experimentOperatorIds
        ),
        ...(isCanceled && { isCanceled }),
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
