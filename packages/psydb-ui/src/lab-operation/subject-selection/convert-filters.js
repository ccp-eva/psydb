import {
    unescapeJsonPointer,
    parseEncodedInterval,
} from './utils';

export const convertFilters = (filters) => {
    var converted = [];
    var sorted = Object.keys(filters).sort();
    //console.log({ sorted });
    for (var key of sorted) {
        var value = filters[key];

        var segments = key.split('/');
        var [
            studyId,
            ageFrameId,
            ...rest
        ] = segments;

        /*var ageFrameInterval = (
            parseEncodedInterval(ageFrameKey)
        );*/

        if (segments.length === 2) {
            converted.push({
                studyId,
                ageFrameId,
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
                ageFrameId,
                pointer,
                value: conditionValue,
                isEnabled: value,
            });
        }
    }

    console.log({ converted });
    return converted;
}
