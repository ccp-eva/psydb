'use strict';
var compareIds = (idA, idB) => {
    var beLazy = (
        typeof idA === 'string' || typeof idB === 'string'
    );
    
    return (
        beLazy
        ? String(idA) === String(idB)
        : !!idA?.equals(idB) // NOTE: idA could be non-object here
    )
};

compareIds.lambda = (idB) => (idA) => compareIds(idA, idB);

module.exports = compareIds
