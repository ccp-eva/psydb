'use strict';
var stringifyPath = require('@cdxoo/stringify-path-perlstyle');

var findMatchingSchemaPath = (bag) => {
    var { path, schemaPaths } = bag;
    var foundMatchingPath = false;
    for (var schemaPath of schemaPaths) {
        //console.log({
        //    p: stringifyPath(path),
        //    s: stringifyPath(schemaPath)
        //});
        var matchingTokenCount = 0;
        for (var [ ix, rTok ] of path.entries()) {
            var sTok = schemaPath[ix];
            
            var rTokType_sane = (
                ['array', 'object'].includes(rTok.type)
                ? rTok.type
                : 'scalar'
            );
            var sTokType_sane = (
                ['array', 'object'].includes(sTok.type)
                ? sTok.type
                : 'scalar'
            );

            if (sTokType_sane !== rTokType_sane) {
                break;
            }
            if (sTok.format === 'pattern') {
                var rx = new RegExp(sTok.key);
                if (!rx.test(rTok.key)) {
                    break;
                }
            }
            else {
                if (sTok.key !== rTok.key) {
                    break;
                }
            }

            matchingTokenCount += 1;
        }
        if (matchingTokenCount === path.length) {
            //console.log(' => found')
            foundMatchingPath = true;
            break;
        }
    }

    return foundMatchingPath;
}

module.exports = findMatchingSchemaPath;
