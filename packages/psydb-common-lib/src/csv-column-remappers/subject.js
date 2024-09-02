'use strict';
var {
    entries,
    groupBy,
    convertPointerToPath
} = require('@mpieva/psydb-core-utils');

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
        var { path: dataPath } = bag;
        console.log({ dataPath })
        
        if (dataPath[0] === '.') {
            dataPath = dataPath.substr(1);
        }

        var matchCounts = [];
        for (var [ col, demapPath ] of entries(mappings.obj2csv)) {
            var matchCount = 0;
            var dataPathTokens = dataPath.split('.');
            for (var demapToken of demapPath) {
                if (demapToken.type === 'array') {
                    // XXX: ajv does some wierd path stuff with array
                    // i.e. uses subjectData[0]
                    //var baseToken = dataPathTokens.shift();
                    //var indexToken = dataPathTokens.shift();
                    //if (baseToken === demapToken.key) {
                    //    matchCount += 1;
                    //}
                    //else {
                    //    break;
                    //}
                    var aryToken = dataPathTokens.shift();
                    if (new RegExp(
                        `^${demapToken.key}(\\[\\d+\\])?$`
                    ).test(aryToken)) {
                        matchCount += 1;
                    }
                    else {
                        break;
                    }
                }
                else {
                    var token = dataPathTokens.shift()
                    if (token === demapToken.key) {
                        matchCount += 1
                    }
                    else {
                        break;
                    }
                }
            }
            if (matchCount > 0) {
                matchCounts.push({ col, count: matchCount });
            }
        }

        // XXX
        if (matchCounts.length < 1) {
            return [ dataPath ];
        }

        // NOTE: multiple paths could maybe have same match count
        // in some wierd edge cases
        var grouped = groupBy({
            items: matchCounts,
            byProp: 'count'
        });

        var max = (
            Object.values(grouped)
            .sort((a, b) => ( a[0].count < b[0].count ? 1 :-1 ))
            .shift()
        );

        return max.map(it => it.col);
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
