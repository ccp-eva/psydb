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

    remapper.csv2obj = (bag) => {
        var { colkey } = bag;
        return mappings.csv2obj[colkey];
    }
    remapper.obj2csv = (bag) => {
        var { path } = bag;
        return getDemappedCols({ path, mapping: mappings.obj2csv });
    }
    
    return remapper;
}

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
            var { key, subChannel, pointer } = it;
            var mkey = (
                (dups.includes(key) || staticMapping[key])
                ? `${subChannel}.${key}`
                : key
            );
            customMapping[mkey] = convertPointerToPath(pointer);
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
            var { key, subChannel } = it;

            var mkey = (
                (dups.includes(key) || staticMapping[key])
                ? `${subChannel}.${key}`
                : key
            );
            customMapping[mkey] = [
                { key: subChannel, type: 'object' },
                { key: 'state', type: 'object' },
                { key: 'custom', type: 'object' },
                { key: key, type: 'scalar' },
            ];
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
