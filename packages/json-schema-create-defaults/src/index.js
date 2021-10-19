import jsonpointer from 'jsonpointer';

const traverse = (schema, data, callback) => {
    const recursiveTraverse = ({ schema, dataPointer, callback }) => {
        callback({ schema, dataPointer });

        if (schema.oneOf) {
            // if data is given we only can figure out
            // which subschema branch to use with ajv so we dont descent
            if (!data) {
                recursiveTraverse({
                    schema: schema.oneOf[0],
                    dataPointer,
                    callback
                });
            }
        }
        else {
            let defaultType = (
                Array.isArray(schema.type)
                ? schema.type[0]
                : schema.type
            );

            if (defaultType === 'object') {
                for (let key of Object.keys(schema.properties)) {
                    recursiveTraverse({
                        schema: schema.properties[key],
                        dataPointer: `${dataPointer}/${key}`,
                        callback
                    })
                }
            }
        }
    }

    let dataPointer = '';
    recursiveTraverse({ schema, dataPointer, callback });
}

const createSchemaDefaults = (rootSchema, data) => {

    let schemaDefaults = data || {};
    traverse(rootSchema, data, ({ schema, dataPointer }) => {
        if (Object.keys(schema).includes('default')) {
            let existing = jsonpointer.get(schemaDefaults, dataPointer);
            if (existing === undefined) {
                jsonpointer.set(schemaDefaults, dataPointer, schema.default);
            }
        }
        else if (Object.keys(schema).includes('const')) {
            let existing = jsonpointer.get(schemaDefaults, dataPointer);
            if (existing === undefined) {
                jsonpointer.set(schemaDefaults, dataPointer, schema.const);
            }
        }
    });

    return schemaDefaults;
}

export default createSchemaDefaults;
