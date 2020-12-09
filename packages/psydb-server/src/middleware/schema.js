'use strict';
var {
    createAllSchemas,
} = require('@mpieva/psydb-schema');

var createSchemaMiddleware = () => async (context, next) => {
    var { db, ajv } = context;

    var customEntityTypeRecords = await (
        db.collection('customEntityType').find().toArray()
    );

    var schemas = createAllSchemas({
        records: customEntityTypeRecords
    });

    context.schemas = {};

    context.schemas.collections = (
        schemas.collections
        .map(it => ({
            ...it,
            validators: Object.keys(it.schemas).reduce((acc, key) => {
                console.log(it.collection, it.type, it.subtype, key);
                return {
                    ...acc,
                    [key]: ajv.compile(it.schemas[key]),
                };
            }, {})
        }))
    );


    context.schemas.collections.findDefinitions = (
        createFind(context.schemas.collections, 'schemas')
    );
    context.schemas.collections.findValidators = (
        createFind(context.schemas.collections, 'validators')
    );
    
    await next();
}

var createFind = (list, prop) => ({ collection, type, subtype }) => {
    var filtered = list.filter(it => (
        it.collection === collection
        && it.type === type
        && it.subtype === subtype
    ));

    if (filtered.length > 1) {
        // TODO: decide if thats actually an error
        // might also return undefined
        throw new Error('found multiple schemas');
    }
    else if (filtered.length === 1) {
        return filtered[0][prop];
    }
    else {
        return undefined;
    }
}

module.exports = createSchemaMiddleware;
