'use strict';
var fetchAvailableFieldRecords = async ({
    db,
    collection,
    recordType,
    constraints
}) => {
    constraints = convertConstraintsToMongoPath(constraints);

    var records = await (
        db.collection(collection).aggregate([
            { $match: {
                ...(recordType && { type: recordType }),
                ...constraints
            }},
            { $project: {
                events: false
            }},
        ]).toArray()
    );

    return records;
}

var convertConstraintsToMongoPath = (constraints) => {
    if (constraints === undefined) {
        return {};
    }

    var converted = {};
    for (var pointer of Object.keys(constraints)) {
        converted[convertPointerToPath] = constraints[pointer];
    }

    return converted;
}

var hasDotRegex = /\./;
var hasEscapeRegex = /~/;
var escapeMatcher = /~[01]/g;
function escapeReplacer (m) {
  switch (m) {
    case '~1': return '/';
    case '~0': return '~';
  }
  throw new Error('Invalid tilde escape: ' + m);
}
var convertPointerToPath = (pointer) => {
    if (hasDotRegex.test(pointer)) {
        throw new Error(
            //FIXME: are dots escapeable somehow?
            `Unconvertible Pointer: "${pointer}"`
        );
    }
    var tokens = split('/', pointer),
        converted = [];
    for (var token of tokens) {
        if (!hasEscapeRegex.test(token)) {
            converted.push(token)
        }
        else {
            converted.push(token.replace(escapeMatcher, escapeReplacer));
        }
    }

    return converted.join('.');
}

module.exports = fetchAvailableFieldRecords;
