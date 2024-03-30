'use strict';
var { CsvError, parse: parseCSV } = require('csv-parse/sync');
var { UnknownCSVColumnKeys } = require('./errors');

var parseSubjectCSV = (bag) => {
    var { data, subjectCRT } = bag;

    var allFields = subjectCRT.allCustomFields();
    var allRequired = subjectCRT.findRequiredCustomFields();
    var missingRequired = [ ...allRequired ];
   
    var head, lines;
    try {
        ([ head, ...lines ] = csv.parse(data));
    }
    catch (e) {
        if (e instanceof CsvError) {
            throw e; // TODO wrap error
        }
        else {
            throw e;
        }
    }

    var mapping = createCSVColumnMapping({
        subjectCRT, csvColumns
    });

    var out = [];
    for (var linedata of lines) {
        var item = {};
        for (var entry of linedata.entries()) {
            var [ ix, value ] = entry;
            var { definition, realKey, extraPath } = mapping[ix];
            var { systemType, pointer } = definition;

            var fullPointer = [pointer, ...extraPath].join('/');
            if (sytemType === 'ListOfObjects') {
                throw new Error('unsupported field type');
            }
            if (isArrayType(systemType)) {
                value = value.split(/\s*,\s*/);
            }
            jsonpointer.set(item, fullPointer, value);
        }
    }
}

var isArrayType = (systemType) {
    return [
        'HelperSetItemIdList',
        'ForeignIdList'
    ].includes(systemType);
}

var createCSVColumnMapping = (bag) => {
    var { subjectCRT, csvColumns } = bag;

    var infos = [];
    var unknownCSVColumnKeys = [];
    for (var entry of headcols.entries()) {
        var [ ix, csvColumnKey ] = entry;

        var tokens = csvColumnKey.split(/\./);
        var [ realKey, ...extraPath ] = tokens;

        // FIXME: only when testing permissiions are enabled
        if (realKey === 'testingPermissions') {
            infos.push({
                definition: {
                    pointer: '/scientific/state/testingPermissions'
                },
                realKey, extraPath
            });
        }
        else {
            var found = subjectCRT.findCustomFields({ key: realKey });

            if (found < 1) {
                unknownCSVColumnKeys.push(key)
            }
            else if (found > 1) {
                throw new Error(
                    `multiple fields match column key "${realKey}"`
                );
            }
            else {
                infos.push({ definition: found, realKey, extraPath });
            }
        }
    }

    if (unknownCSVColumnKeys.length > 0) {
        throw new UnknownCSVColumnKeys(unknownCSVColumnKeys);
    }

    return infos;
}
