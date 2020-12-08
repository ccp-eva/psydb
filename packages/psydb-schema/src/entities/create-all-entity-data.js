'use strict';
var rootEntityConstructionData = require('./entity-construction-data');

var createAllEntityData = ({
    customSchemaCollectionRecords,
    entityConstructionData
}) => {
    entityConstructionData = (
        entityConstructionData || rootEntityConstructionData
    );

    var data = Object.keys(entityConstructionData).reduce(
        (acc, key) => ({
            ...acc,
            [key]: createEntityData({
                entity: key,
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
    entity,
    entityConstructionData,
    customSchemaCollectionRecords,
}) => {
    var {
        hasCustomFields,
        hasCustomTypes,
        hasGdprPortion,
        fixedTypes,

        createCustomTypeSchemas,
        createCustomTypeScientificSchemas,
        createCustomTypeGdprSchemas,
    } = entityConstructionData;

    if (!hasCustomTypes && !fixedTypes) {
        return createStaticEntityData({ entityConstructionData });
    }

    var tree = createRecordTree({
        customSchemaCollectionRecords,
    });
    
    var customTypeRecords = [],
        customSubtypeRecordsByType = undefined;

    if (fixedTypes) {
        customSubtypeRecordsByType = Object.keys(fixedTypes).reduce(
            (acc, key) => ({ [key]: [] }),
            {}
        );
    }

    customSchemaCollectionRecords.forEach(record => {
        var { type, subtype } = record.state;

        if (customSubTypeRecordsByType[type]) {
            customSubtypeRecordsByType[type].push(record);
        }
        else {
            customTypeRecords.push(record)
        }
    })

    var customTypeData = customTypeRecords.reduce((acc, record) => ({
        ...acc,
        [record.state.type]: createCustomTypeData({
            entity,
            record,
    
            hasCustomFields,
            canHaveGdprPortion,

            createSchemas: createCustomTypeSchemas,
            createScientificSchemas: createCustomTypeScientificSchemas,
            createGdprSchemas: createCustomTypeGdprSchemas,
        })
    }), {});

    var fixedTypeData = undefined;
    if (fixedTypes) {
        fixedTypeData = Object.keys(fixedTypes).reduce((acc, key) => {
            var {
                hasCustomSubtypes,
                createCustomSubtypeSchemas,
                createCustomSubtypeScientificSchemas,
                createCustomSubtypeGdprSchemas,
            } = fixedTypes[key];

            var subtypes = undefined,
                schemas = undefined;
            if (hasCustomSubTypes) {
                subtypes = createAllCustomSubtypeData({
                    type: key,
                    customSubTypeRecords: customSubTypeRecords[key],
                    
                    entity,
                    hasCustomFields,
                    canHaveGdprPortion,
                    
                    createCustomSubtypeSchemas,
                    createCustomSubtypeScientificSchemas,
                    createCustomSubtypeGdprSchemas,
                })
            }
            else {
                schemas = createAllSchemas({
                    entity,
                    record,

                    hasCustomFields,
                    canHaveGdprPortion,
        
                    createSchemas: createCustomSubtypeSchemas,
                    createScientificSchemas: createCustomSubtypeScientificSchemas,
                    createGdprSchemas: createCustomSubtypeGdprSchemas
                })
            }

            return {
                [key]: {
                    hasCustomFields,
                    hasCustomSubtypes,
                    canHaveGdprPortion,
                }
            }
        }, {});
    }

    var data = {
        hasCustomFields,
        hasCustomTypes,
        canHaveGdprPortion,
        fixedTypeData,
        customTypeData,
    }

    return data;
}

var createCustomTypeData = ({
    entity,
    record,
    
    hasCustomFields,
    canHaveGdprPortion,

    createSchemas,
    createScientificSchemas,
    createGdprSchemas,
}) => ({
    hasCustomFields,
    canHaveGdprPortion,
    schemas: createAllSchemas({
        entity,
        record,

        hasCustomFields,
        canHaveGdprPortion,
        
        createSchemas,
        createScientificSchemas,
        createGdprSchemas,
    })
})

var createAllSchemas = ({
    entity,
    record,

    hasCustomFields,
    canHaveGdprPortion,
        
    createSchemas,
    createScientificSchemas,
    createGdprSchemas,
}) => (
    canHaveGdprPortion
    ? ({
        scientific: createScientificSchemas({
            entity,
            type: record.state.type,
            subtype: record.state.subtype,
            customInnerSchema: (
                record.state.customScientificFields
            )
        }),
        gdpr: createGdprSchemas({
            entity,
            type: record.state.type,
            subtype: record.state.subtype,
            customInnerSchema: (
                record.state.customGdprFields
            )
        }),
    })
    : (
        createSchemas({
            entity,
            type: record.state.type,
            subtype: record.state.subtype,
            customInnerSchema: (
                record.state.customFields
            )
        })
    )
)

module.exports = createAllSchemas;
