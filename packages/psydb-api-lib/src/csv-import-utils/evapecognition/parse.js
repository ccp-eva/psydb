'use strict';
var sift = require('sift');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { UnknownCSVColumnKeys } = require('../errors');
var dumpParseCSV = require('../dumb-parse-csv');

var parseLines = (bag) => {
    var { data } = bag;
    var { csvColumns, csvLines } = dumbParseCSV(data);

    var mapping = createCSVColumnMapping({
        definitions, csvColumns, throwUnknown: false
    });

    var out = [];
    for (var linedata of csvLines) {
        var parsedline = [];
        for (var entry of linedata.entries()) {
            var [ ix, value ] = entry;
            var m = mapping[ix];

            // FIXME: naming of 'mapping' is off since we have unmapped
            var { isUnmapped } = m;
            if (isUnmapped) {
                continue;
            }
            
            var { definition, realKey, extraPath  } = m;
            var { systemType } = definition;
            
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
    'ForeignId': (value, definition) => (
        maybeAsObjectId(value)
    ),
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
    var { definitions, csvColumns, throwUnknown = true } = bag;
    
    var infos = [];
    var unknownCSVColumnKeys = [];
    for (var entry of csvColumns.entries()) {
        var [ ix, csvColumnKey ] = entry;
        
        var tokens = csvColumnKey.split(/\./);
        var [ realKey, ...extraPath ] = tokens;

        var found = definitions(sift({
            $or: [
                { csvColumnKey },
                { csvColumnKey: { $exist: false }, key: realKey }
            ]
        }));

        if (found > 1) {
            throw new Error(
                `multiple fields match column key "${csvColumnKey}"`
            );
        }
        else if (found < 1) {
            infos.push({ realKey, extraPath, isUnmapped: true })
            unknownCSVColumnKeys.push(csvColumnKey);
        }
        else {
            infos.push({ definition: found[0], realKey, extraPath });
        }
    }
    
    if (throwUnknown && unknownCSVColumnKeys.length > 0) {
        throw new UnknownCSVColumnKeys(unknownCSVColumnKeys);
    }
}

var definitions = [
    { 
        csvColumnKey: 'experment_name',
        systemType: 'SaneString',
        pointer: '/experimentName'
    },

     //systemType: 'YMDServerSide', // XXX: ???
    {
        csvColumnKey: 'year',
        systemType: 'Integer', props: {},
        pointer: '/timestamp/year',
    },
    {
        csvColumnKey: 'month',
        systemType: 'Integer', props: {},
        pointer: '/timestamp/month',
    },
    {
        csvColumnKey: 'day',
        systemType: 'Integer', props: {},
        pointer: '/timestamp/day',
    },

    { 
        csvColumnKey: 'participant',
        systemType: 'ForeignId',
        props: { collection: 'subject', /* XXX: recordType??? */ },
        pointer: '/subjectData/0/subjectId', // XXX
    },

    {
        csvColumnKey: 'participant_2',
        systemType: 'ForeignId',
        props: { collection: 'subject', /* XXX: recordType??? */ },
        pointer: '/subjectData/1/subjectId', // XXX
    },

    {
        csvColumnKey: 'room_or_enclosure',
        definition: { systemType: 'SaneString' }, // XXX
        realKey: 'roomOrEnclosure',
        extraPath: []
    },
    {
        csvColumnKey: 'comment',
        systemType: 'SaneString'// XXX
    },
]

var isUnsupportedType = (systemType) => {
    return [
        'ListOfObjects',
    ].includes(systemType)
}

module.exports = parseLines;
