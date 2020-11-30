'use strict';
var entityMetadataSkeleton = require('../../enitity-flags');

var CustomSchemaState = ({
    entityKey,
    hasGdprPortion,
    type,
    hasCustomSubTypes,
})

var createAllFixedTypeSchemas = ({
    entityKey,
    canHaveGdprPortion,
    fixedTypes,
}) => {
    
    return fixedTypeSchemas
}

var createAllCustomSchemaStates = () => {
    var states = Object.keys(entityMetadataSkeleton).reduce(
        (acc, key) => {
            var {
                canHaveGdprPortion,
                hasCustomTypes,
                fixedTypes,
            } = entityMetadata[key];

            if (fixedTypes) {
                var fixedTypeSchemas = createAllFixedTypeSchemas({
                    entityKey: key,
                    canHaveGdprPortion,
                    fixedTypes,
                });
            }
            else {

            }

        },
        {}
    )
};
