'use strict';
var { entries, groupBy } = require('@mpieva/psydb-core-utils');

var getDemappedCols = (bag) => {
    var { path: dataPath, mapping } = bag;

    if (dataPath[0] === '.') {
        dataPath = dataPath.substr(1);
    }

    var matchCounts = [];
    for (var [ col, demapPath ] of entries(mapping)) {
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

module.exports = {
    getDemappedCols
};
