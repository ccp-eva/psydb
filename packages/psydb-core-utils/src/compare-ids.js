'use strict';
var equalIds = (idA, idB) => {
    var useEqualsFn = (
        idA?.equals && idB?.equals
    );
    
    return (
        useEqualsFn
        ? !!idA.equals(idB)
        : String(idA) === String(idB)
    )
};

equalIds.lambda = (idB) => (idA) => equalIds(idA, idB);

module.exports = equalIds; // TODO: rename compareIds => equalIds
