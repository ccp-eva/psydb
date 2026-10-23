'use strict';
var {
    entries,
    groupBy,
    convertPointerToPath
} = require('@mpieva/psydb-core-utils');

var { getDemappedCols } = require('./utils');

var CSVSubjectColumnRemapper = (bag) => {
    var { subjectCRT } = bag;
    var remapper = {};
    
    var mappings = {
        csv2obj: preGenerate.csv2obj({ subjectCRT }),
        obj2csv: preGenerate.obj2csv({ subjectCRT }),
    }

    remapper.mappings = mappings;

    remapper.csv2obj = (bag) => {
        var { colkey } = bag;
        
        var maybeArrayIndexMatch = colkey.match(/^(.*)\[(\d+)\]$/);
        var maybeArrayIndex = undefined;
        if (maybeArrayIndexMatch) {
            colkey = maybeArrayIndexMatch[1]
            maybeArrayIndex = maybeArrayIndexMatch[2]
        }
        
        var out = mappings.csv2obj[colkey];
        if (maybeArrayIndex) {
            out += `.${maybeArrayIndex}`;
        }
        return out;
    }

    remapper.obj2csv = (bag) => {
        var { path } = bag;
        return getDemappedCols({ path, mapping: mappings.obj2csv });
    }

    remapper.ajvpath2csv = (bag) => {
        var { path } = bag;

        var maybeArrayIndexMatch = path.match(/^(.*)\[(\d+)\]$/);
        var maybeArrayIndex = undefined;
        if (maybeArrayIndexMatch) {
            path = maybeArrayIndexMatch[1]
            maybeArrayIndex = maybeArrayIndexMatch[2]
        }
        
        var cols = getDemappedCols({ path, mapping: mappings.obj2csv });
        if (maybeArrayIndex) {
            cols = cols.map(it => it += `[${maybeArrayIndex}]`);
        }
        return cols;
    }
    
    return remapper;
}

// NOTE: address fields are imported via one column per part
// i.e. 'address.street', 'address.city', ...
var ADDRESS_SUBKEYS = [
    'street', 'housenumber', 'affix', 'postcode', 'city', 'country'
];

var preGenerate = {
    csv2obj: (bag) => {
        var { subjectCRT } = bag;

        var definitions = subjectCRT.allCustomFields(); 
        var dups = _gatherDups({ definitions });

        var staticMapping = {
            'comment': 'scientific.state.comment',
        };

        var customMapping = {};
        for (var it of definitions) {
            var { key, subChannel, pointer, systemType } = it;
            var mkey = (
                (dups.includes(key) || staticMapping[key])
                ? `${subChannel}.${key}`
                : key
            );
            var path = convertPointerToPath(pointer);
            if (systemType === 'Address') {
                for (var subkey of ADDRESS_SUBKEYS) {
                    customMapping[`${mkey}.${subkey}`] = `${path}.${subkey}`;
                }
            }
            else {
                customMapping[mkey] = path;
            }
        }

        var mapping = {
            ...staticMapping,
            ...customMapping,
        }

        return mapping;
    },

    obj2csv: (bag) => {
        var { subjectCRT } = bag;
        
        var definitions = subjectCRT.allCustomFields();
        var dups = _gatherDups({ definitions });

        var staticMapping = {
            'comment': [
                { key: 'scientific', type: 'object' },
                { key: 'state', type: 'object' },
                { key: 'comment', type: 'scalar' },
            ],
        }

        var customMapping = {};
        for (var it of definitions) {
            var { key, subChannel, systemType } = it;

            var mkey = (
                (dups.includes(key) || staticMapping[key])
                ? `${subChannel}.${key}`
                : key
            );
            var base = [
                { key: subChannel, type: 'object' },
                { key: 'state', type: 'object' },
                { key: 'custom', type: 'object' },
            ];
            if (systemType === 'Address') {
                for (var subkey of ADDRESS_SUBKEYS) {
                    customMapping[`${mkey}.${subkey}`] = [
                        ...base,
                        { key: key, type: 'object' },
                        { key: subkey, type: 'scalar' },
                    ];
                }
            }
            else {
                customMapping[mkey] = [
                    ...base,
                    { key: key, type: 'scalar' },
                ];
            }
        }
        
        var mapping = {
            ...staticMapping,
            ...customMapping,
        }
        return mapping;
    }
}

var _gatherDups = ({ definitions }) => {
    var dups = entries(
        groupBy({ items: definitions, byProp: 'key' })
    ).filter(([key, items]) => items.length > 1).map(it => it.key);

    return dups;
}

module.exports = CSVSubjectColumnRemapper;
