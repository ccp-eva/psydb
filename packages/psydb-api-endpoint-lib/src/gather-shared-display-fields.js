'use strict';
var { intersect } = require('@mpieva/psydb-core-utils');
var { fetchAllCRTSettings } = require('@mpieva/psydb-api-lib');

var gatherSharedDisplayFields = async (bag) => {
    var { db, collection, target } = bag;

    var crtSettingsList = await fetchAllCRTSettings(
        db, [{ collection }], { wrap: true, asTree: false }
    );

    var sharedDisplayFields = undefined;
    var compare = (a, b) => (
        a.pointer === b.pointer && a.systemType === b.systemType
    )
    for (var it of crtSettingsList) {
        var current = it.augmentedDisplayFields(target);

        if (!sharedDisplayFields) {
            sharedDisplayFields = current;
        }
        else {
            sharedDisplayFields = intersect(
                sharedDisplayFields, current, { compare }
            )
        }
    }

    return sharedDisplayFields;
}

module.exports = gatherSharedDisplayFields;
