'use strict';
var {
    createAllSchemas,
} = require('@mpieva/psydb-schema');

var withRecordSchemas = () => async (context, next) => {
    var { db } = context;

    var _cachedSchemas = undefined;

    context.getRecordSchemas = async () => {
        if (_cachedSchemas) {
            return _cachedSchemas;
        }

        var customTypeRecords = await (
            db.collection('customRecordType').find({
                'state.isNew': false
            }).toArray()
        );

        //console.dir(customTypeRecords.map(it => it.state), { depth: null });

        // TODO: actually we need to pass permissions 
        // to the schema creator since the actual schema
        // the user is able to use probably depends
        // in some way on that permissions
        // => available message types (this is already the case)
        // => for available types (probably in the future)
        // => for available fields (maybe in the future)
        //
        // => i decided that we acually want to show all possible
        // events so that the user can actually have permission denied
        // and know about that it exists but they cant use it
        // this is better than hiding this i think
        var schemas = createAllSchemas({
            records: customTypeRecords
        });

        // TODO rename collections to records in psydb-schema
        schemas.collections.find = (
            ({ collection, type, subtype }) => {
                var filtered = schemas.collections.filter(
                    it => (
                        it.collection === collection
                        && it.type === type
                        //&& it.subtype === subtype
                    )
                );

                if (filtered.length > 1) {
                    // TODO: decide if thats actually an error
                    // might also return undefined
                    throw new Error('found multiple schemas');
                }
                else if (filtered.length === 1) {
                    return filtered[0].schemas;
                }
                else {
                    return undefined;
                }
            }
        );

        return schemas.collections;
    }

    await next();
}

module.exports = withRecordSchemas;
