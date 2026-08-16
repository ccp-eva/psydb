'use strict';
var debug = require('debug')('psydb:api:fetchRelated');
var { jsonpointer, forcePush } = require('@mpieva/psydb-core-utils');
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

        if (/^HelperSetItem/.test(systemType)) {
            todoHelperSetItemIds.push(...fromItems(pointer));
        }

        if (/^ForeignId/.test(systemType)) {
            var { collection } = props;
            forcePush({
                into: todoRecordIds, pointer: '/' + collection,
                values: fromItems(pointer)
            });
        }

        // XXX: only personnel is using ths though
        if ('PersonnelResearchGroupSettingsList' === systemType) {
            var todoResearchGroupIds = [];
            var todoSystemRoleIds = [];
            for (var r of records) {
                var settings = jsonpointer.get(r, pointer);
                for (var s of settings) {
                    todoResearchGroupIds.push(s.researchGroupId)
                    todoSystemRoleIds.push(s.systemRoleId)
                }
            }

            forcePush({
                into: todoRecordIds, pointer: '/researchGroup',
                values: todoResearchGroupIds
            });
            forcePush({
                into: todoRecordIds, pointer: '/systemRole',
                values: todoSystemRoleIds
            });
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
