'use strict';

var gatherRemovedFields = (crt) => {
    var { fields, subChannelFields } = crt.state.settings;
    
    var removed = (
        subChannelFields
        ? ([
            ...subChannelFields.scientific.filter(it => it.isRemoved),
            ...subChannelFields.gdpr.filter(it => it.isRemoved)
        ])
        : (
            fields.filter(it => it.isRemoved)
        )
    );
    
    return removed;
}

module.exports = {
    gatherRemovedFields
}
