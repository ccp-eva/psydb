'use strict';

var gatherCustomColumns = (options) => {
    var { schema, customRecordType, subChannelKeys } = options;

    var columns = [];
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
    
    return columns;
}

var getCustomFields = (schema, subChannelKey) => (
    schema.properties[subChannelKey]
    .properties.state.properties.custom.properties
);

module.exports = gatherCustomColumns;

