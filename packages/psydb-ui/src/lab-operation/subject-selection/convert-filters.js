import {
    unescapeJsonPointer,
    parseEncodedInterval,
} from './utils';

export const convertFilters = (filters) => {
    var converted = [];
    var sorted = Object.keys(filters).sort();
    console.log(sorted);
    for (var key of sorted) {
        var value = filters[key];

        var segments = key.split('/');
        var [
            studyId,
            ageFrameKey,
            ...rest
        ] = segments;

        var ageFrameInterval = (
            parseEncodedInterval(ageFrameKey)
        );

        if (segments.length === 2) {
            converted.push({
                studyId,
                ageFrameInterval,
                isEnabled: value,
            });
        }
        else if (segments.length === 4) {
            var [
                escapedPointer,
                conditionValue
            ] = rest;

            var pointer = (
                unescapeJsonPointer(escapedPointer)
            );

            converted.push({
                studyId,
                ageFrameInterval,
                pointer,
                value: conditionValue,
                isEnabled: value,
            });
        }
    }

    return converted;
}
