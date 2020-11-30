'use strict';
var entityConstructionData = require('./entity-construction-data');

var createAllEntityData = ({
    customSchemaCollectionRecords
}) => {
    var data = Object.keys(entityConstructionData).reduce(
        (acc, key) => ({
            ...acc,
            [key]: createEntityData({
                entityConstructionData: entityConstructionData[key],
                customSchemaCollectionRecords: (
                    customSchemaCollectionRecords
                    .filter(it => it.state.entity === key)
                )
            })
        }),
        {}
    );

    return data;
}

var createEntityData = ({
    entityConstructionData,
    customSchemaCollectionRecords,
}) => {

    return data;
}
