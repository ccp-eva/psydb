'use strict';
var entityMetadataSkeleton = require('../../enitity-flags');

var CustomSchemaState = ({
    entityKey,
    hasGdprPortion,
    type,
    hasCustomSubTypes,
})

var createAllFixedTypeEntityMetadata = ({
    entityKey,
    canHaveGdprPortion,
    fixedTypes,
}) => {
    Object.keys(fixedTypes).reduce((acc, key) => {})

    return fixedTypeEntityMetadata;
}

var createAllCustomEntityMetadata = () => {
    var metadata = Object.keys(entityMetadataSkeleton).reduce(
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
