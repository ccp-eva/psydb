'use strict';
var sift = require('sift').default;
var { arrify } = require('@mpieva/psydb-core-utils');

var CRTSettings = ({ data }) => {
    var crt = {};
    var flattenedFieldDefinitions = undefined;

    crt.getFlattenedFieldDefinitions = () => {
        if (!flattenedFieldDefinitions) {
            var flattened = [];
            var subChannels = crt.getSubChannelKeys();
            if (subChannels) {
                for (var sc of subChannels) {
                    for (var field of data.fieldDefinitions[sc]) {
                        flattened.push({
                            ...field,
                            subChannel: sc,
                        })
                    }
                }
            }
            else {
                flattened = data.fieldDefinitions;
            }

            flattenedFieldDefinitions = flattened;
        }

        return flattenedFieldDefinitions;
    }

    crt.getRaw = () => data;
    crt.getCollection = () => data.collection;
    crt.allStaticFields = () => (data.staticFieldDefinitions || []);

    crt.getSubChannelKeys = () => {
        if (data.hasSubChannels) {
            return Object.keys(data.fieldDefinitions);
        }
        else {
            return undefined;
        }
    }

    crt.hasSubChannels = (maybeNames) => {
        if (data.hasSubChannels) {
            var keys = crt.getSubChannelKeys()
            if (maybeNames) {
                maybeNames = arrify(maybeNames);
                keys = keys.filter(it => maybeNames.includes(it));
            }
            return keys;
        }
        else {
            return false
        }
    }

    crt.allCustomFields = crt.getFlattenedFieldDefinitions;
    crt.findCustomFields = (filter) => {
        var fields = crt.getFlattenedFieldDefinitions();
        return (
            filter
            ? fields.filter(sift(filter))
            : fields
        );
    }

    return crt;
}

module.exports = CRTSettings;
