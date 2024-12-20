'use strict';
var debug = require('debug')('psydb:api:fetchRelated');
var {
    mappifyPointer,
    fetchRecordLabelsManual,
    fetchHelperSetItemLabelsManual,
} = require('@mpieva/psydb-api-lib');

var fetchRelated = async (bag) => {
    var { db, records, definitions, i18n } = bag;

    debug('preparing related ids');
    var fromItems = mappifyPointer(records, { spreadArrays: true });

    var todoRecordIds = {};
    var todoHelperSetItemIds = [];
    for (var it of definitions) {
        var { systemType, pointer, props } = it;

        if (/^ForeignId/.test(systemType)) {
            var { collection } = props;
            todoRecordIds[collection] = fromItems(pointer);
        }

        if (/^HelperSetItem/.test(systemType)) {
            todoHelperSetItemIds.push(...fromItems(pointer));
        }
    }

    debug('fetching related...');
    var relatedRecordLabels = await fetchRecordLabelsManual(
        db, todoRecordIds, { ...i18n, oldWrappedLabels: true }
    );
    var relatedHelperSetItems = await fetchHelperSetItemLabelsManual(
        db, todoHelperSetItemIds, { ...i18n, oldWrappedLabels: true }
    );
    // TODO: related crts
    debug('done');

    return {
        relatedRecordLabels,
        relatedHelperSetItems,
    }
}

module.exports = fetchRelated;
