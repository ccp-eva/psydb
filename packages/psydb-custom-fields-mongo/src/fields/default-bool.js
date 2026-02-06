'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');

var { 
    switchQueryFilterType,
    Boolify, JustEqual,
} = require('../utils');

var createQueryFilter = (bag) => {
    var { type, definition, input } = bag;
    var { pointer } = definition;
   
    var filter = switchQueryFilterType({
        'extended-search': () => {
            if (typeof input === 'string') {
                return Boolify(pointer, input, [
                    'only-true', 'only-false'
                ]);
            }
            // FIXME: there are 2 versions, one for radio isHiden and one for
            // miltiple checkbox suff custom fields; can we unify?
            if (input) {
                var values = [];
                if (input['true'] === true) {
                    values.push(true);
                }
                if (input['false'] === true) {
                    values.push(false);
                }
                
                if (values.length > 0) {
                    var path = convertPointerToPath(pointer);
                    return { [path]: { $in: values }}
                }
                
                return undefined;
            }
            
            return undefined;
        },
        'quick-search': () => JustEqual(pointer, input)
    })(type);

    return filter;
}

module.exports = {
    createQueryFilter,
}
