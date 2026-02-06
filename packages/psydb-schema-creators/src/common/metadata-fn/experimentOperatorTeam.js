'use strict';

module.exports = (bag) => {
    var meta = {
        collection: 'experimentOperatorTeam',
        isGenericRecord: true,
        hasCustomTypes: false,
        hasSubChannels: false,
        recordLabelDefinition: {
            format: '${#}',
            tokens: [
                {
                    systemType: 'SaneString',
                    dataPointer: '/state/name'
                }
            ]
        }
    };
    return meta;
}
