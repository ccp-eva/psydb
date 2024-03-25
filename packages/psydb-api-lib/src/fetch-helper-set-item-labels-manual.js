'use strict';
var {
    keyBy,
    groupBy,
} = require('@mpieva/psydb-core-utils');

var withRetracedErrors = require('./with-retraced-errors');
var aggregateToArray = require('./aggregate-to-array');


var fetchHelperSetItemLabelsManual = async (db, ids, options = {}) => {
    var { oldWrappedLabels = false, language } = options;

    var items = await withRetracedErrors(
        aggregateToArray({ db, helperSetItem: [
            { $match: {
                _id: { $in: ids }
            }},
            { $project: {
                'setId': true,
                'state.label': true,
                'state.displayNameI18N': true,
            }}
        ]})
    );

    // FIXME: use hsi translation helper
    var setGroups = groupBy({
        items,
        byProp: 'setId',
    });

    for (var setId of Object.keys(setGroups)) {
        setGroups[setId] = keyBy({
            items: setGroups[setId],
            byProp: '_id',
            transform: (
                oldWrappedLabels
                ? undefined
                : (it) => (
                    it.state.displayNameI18N[language] || it.state.label
                )
            )
        })
    }

    return setGroups;
}

module.exports = fetchHelperSetItemLabelsManual;
