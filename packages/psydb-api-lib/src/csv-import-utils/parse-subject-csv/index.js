'use strict';
var { CsvError, parse: parseCSV } = require('csv-parse/sync');
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { UnknownCSVColumnKeys } = require('../errors');

var isUnsupportedType = (systemType) => {
    return [
        'ListOfObjects',
    ].includes(systemType)
}

var parseSubjectCSV = (bag) => {
    var { data, subjectCRT } = bag;

    var allFields = subjectCRT.allCustomFields();
    var allRequired = subjectCRT.findRequiredCustomFields();
    var missingRequired = [ ...allRequired ];
   
    var head, lines;
    try {
        ([ head, ...lines ] = parseCSV(data));
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
        subjectCRT, csvColumns: head
    });

    var out = [];
    for (var linedata of lines) {
        var parsedline = [];
        for (var entry of linedata.entries()) {
            var [ ix, value ] = entry;
            var { definition, realKey, extraPath } = mapping[ix];
            var { systemType, pointer } = definition;

            var fullPointer = [ pointer, ...extraPath ].join('/');
            if (isUnsupportedType(systemType)) {
                // FIXME
                throw new Error('unsupported field type');
            }
            var deserialize = deserializers[systemType] || ((v) => (v));
            parsedline.push({
                definition, realKey, extraPath,
                value: deserialize(String(value).trim(), definition)
            });
        }
        out.push(parsedline);
    }

    return out;
}

var maybeAsObjectId = (value) => (
    /[0-9A-Fa-f]{24}/.test(value)
    ? ObjectId(value)
    : value
);
var split = (value) => value.split(/\s*,\s*/);
var deserializers = {
    'HelperSetItemIdList': (value, definition) => (
        split(value).map(maybeAsObjectId)
    ),
    'ForeignIdList': (value, definition) => (
        split(value).map(maybeAsObjectId)
    ),
    'HelperSetItemId': (value, definition) => (
        maybeAsObjectId(value)
    ),
    'ForeignId': (value, definition) => (
        maybeAsObjectId(value)
    ),
    'EmailList': (value, definition) => (
        split(value).map((it, ix) => ({
            email: it, isPrimary: ix === 0,
        }))
    ),
    'PhoneWithTypeList': (value, definition) => (
        split(value).map((it, ix) => ({
            number: it, type: 'private'
        }))
    ),
    'PhoneList': split,
    'SaneStringList': split,
    'URLStringList': split,
    'DefaultBool': (value, definition) => {
        var lcvalue = value.toLowerCase();
        if (['true', 'false'].includes(lcvalue)) {
            return (lcvalue === 'true');
        }
        else {
            return value;
        }
    },
    'Integer': (value, definition) => {
        var i = parseInt(value);
        if (Number.isNaN(i)) {
            return value;
        }
        else {
            return i;
        }
    }
}

var createCSVColumnMapping = (bag) => {
    var { subjectCRT, csvColumns } = bag;

    var infos = [];
    var unknownCSVColumnKeys = [];
    for (var entry of csvColumns.entries()) {
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
        else if (realKey === 'comment') {
            infos.push({
                definition: { pointer: '/scientific/state/comment' },
                realKey, extraPath
            });
        }
        else {
            var found = subjectCRT.findCustomFields({ key: realKey });

            if (found < 1) {
                unknownCSVColumnKeys.push(realKey)
            }
            else if (found > 1) {
                throw new Error(
                    `multiple fields match column key "${realKey}"`
                );
            }
            else {
                infos.push({ definition: found[0], realKey, extraPath });
            }
        }
    }

    if (unknownCSVColumnKeys.length > 0) {
        throw new UnknownCSVColumnKeys(unknownCSVColumnKeys);
    }

    return infos;
}

module.exports = parseSubjectCSV;
