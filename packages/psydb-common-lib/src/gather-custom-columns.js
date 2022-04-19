'use strict';

var gatherCustomColumns = (options) => {
    var { schema, customRecordType, subChannelKeys } = options;

    var columns = [];
    if (subChannelKeys) {
        for (var subChannelKey of subChannelKeys) {
            if (schema) {
                var fields = getCustomFields(schema, subChannelKey);
                for (var fieldKey of Object.keys(fields)) {
                    var field = fields[fieldKey];
                    
                    columns.push({
                        pointer: `/${subChannelKey}/state/custom/${fieldKey}`,
                        label: field.title
                    });
                }
            }
            else {
                throw new Error('TODO')
            }
        }
    }
    else {
        if (schema) {
            var fields = getCustomFields(schema);
            for (var fieldKey of Object.keys(fields)) {
                var field = fields[fieldKey];
                
                columns.push({
                    pointer: `/state/custom/${fieldKey}`,
                    label: field.title
                });
            }
        }
        else {
            throw new Error('TODO')
        }
    }
    
    return columns;
}

var getCustomFields = (schema, subChannelKey) => {
    var base = (
        subChannelKey
        ? schema.properties[subChannelKey]
        : schema
    )
    return base.properties.state.properties.custom.properties
};

module.exports = gatherCustomColumns;

