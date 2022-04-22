'use strict';

var convertSchemaPointerToMongoSearchPath = (schemaPointer) => {
    var inObject = false;
    var inOneOf = false;

    var searchPath = (
        schemaPointer
        .split(/\//)
        .filter((it, ix, ary) => {
            //console.log(it, ix, ary);
            if (!it) {
                return false;
            }
            if (it === 'properties' && !inObject) {
                inObject = true;
                return false;
            }

            if (it === 'items' && !inObject) {
                return false;
            }

            if (it === 'oneOf' && !inObject) {
                inOneOf = true;
                return false;
            }

            if (inOneOf) {
                inOneOf = false;
                return false;
            }

            inObject = false;
            return true;
        })
        .join('.')
    );

    //console.log(searchPath);
    return searchPath;
}

module.exports = convertSchemaPointerToMongoSearchPath;
