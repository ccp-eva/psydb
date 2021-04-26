'use strict';
var traverse = require('json-schema-traverse'),
    jsonpointer = require('jsonpointer'),
    inline = require('@cdxoo/inline-text'),
    deconstructArrays = require('@mpieva/json-schema-deconstruct-arrays'),
    convertPointer = require('@mpieva/json-schema-convert-pointer');

//var PointerMapping = require('./pointer-mapping');
var OneofResolver = require('./oneof-resolver');

// TODO: lazyResolvePropPointers a mapping of pointers within the schema
// that is used instead of the inschema "lazyResolveProp" when
// the schema can not be edited by the user
// e.g.:
// { '/properties/foo/': 'isEnabled', ... }
// where the key refers to a prop containing a oneOf declaration
var lazyResolveAll = (schema, data, lazyResolvePropPointers) => {
    var schemaParts = deconstructArrays(schema);
    //console.log(schemaParts);

    var resolvedParts = [];
    lazyResolveZero({
        resolvedParts,
        schemaParts,
        currentData: data,
        currentPart: schemaParts[0]
    });

    return resolvedParts;
}

var lazyResolveZero = ({
    resolvedParts,
    schemaParts,
    currentData,
    currentPart,
}) => {
    //console.log('lazyResolveZero');
    var { inSchemaPointer, schema } = currentPart;

    var requiredType = 'array';
    if (inSchemaPointer === '') {
        requiredType = jsonpointer.get(schema, inSchemaPointer).type;
    }

    //console.log('#############requiredType', requiredType);
    //console.log(currentData);
    
    if (requiredType === 'array') {
        /*var dataPointer = convertPointer(inSchemaPointer, currentData);
        var partData = dataPointer.map(it => (
            jsonpointer.get(data, it))
        );*/

        var buffer = [];
        //console.log('currentData', currentData);
        for (var [index, dataItem] of currentData.entries()) {
            //console.log(dataItem);
            var out = lazyResolve(schema, dataItem);
            buffer.push(out);
            //console.log('out', out)

            var includedArrays = resolveIncludedArrays({
                schema,
                oneOfTransformations: out.transformations,
            });
            //console.log('AAAAAAAAAAAAAa', schema);
            //console.log('insludedArrays', includedArrays);
            //console.log(out.transformations);
            for (var arrayPointer of includedArrays) {
                var nextPointer = `${inSchemaPointer}${arrayPointer}/items`;
                var nextPart = schemaParts.find(it => (
                    it.inSchemaPointer === nextPointer
                ));

                //console.log(it);
                var dataPointer = convertPointer(arrayPointer);
                //console.log('dataPointer', dataPointer);
                //console.log('dataItem', dataItem);
                var nextData = jsonpointer.get(dataItem, dataPointer);
                //console.log('nextData', nextData);
                //console.log('nextPart', nextPart);

                //console.log('ary next part', nextPart);
                //console.log(nextData);

                //console.log('CALLING FROM INSIDE')
                lazyResolveZero({
                    resolvedParts,
                    schemaParts,
                    currentData: nextData,
                    currentPart: nextPart
                })
            }
        }

        resolvedParts.push({
            type: 'array',
            inSchemaPointer,
            itemSchemas: buffer.map(it => it.schema)
        });
    }
    else {

        //var dataPointer = convertPointer(inSchemaPointer, currentData);
        //var partData = jsonpointer.get(data, dataPointer);

        var out = lazyResolve(schema, currentData);
        /*resolvedTransformations = [
            ...resolvedTransformations,
            ...out.transformations.map(it => ({
                from: `${part.inSchemaPointer}${it.from}`,
                to: `${part.inSchemaPointer}${it.to}`,
            })),
        ];*/
        resolvedParts.push({
            type: 'schema',
            inSchemaPointer,
            schema: out.schema,
        });

        var includedArrays = resolveIncludedArrays({ schema });
        for (var arrayPointer of includedArrays) {
            var nextPointer = `${inSchemaPointer}${arrayPointer}/items`;
            var nextPart = schemaParts.find(it => (
                it.inSchemaPointer === nextPointer
            ));
            var dataPointer = convertPointer(arrayPointer, currentData);
            var nextData = jsonpointer.get(currentData, dataPointer);

            //console.log('NEXT', nextPart, nextPointer);
            //console.log('NEXT DATA', nextData);
            //console.log('CALLING FROM OUTSIDE')
            lazyResolveZero({
                resolvedParts,
                schemaParts,
                currentData: nextData,
                currentPart: nextPart
            })
        }

    }
}

var resolveIncludedArrays = ({ schema, oneOfTransformations }) => {
    var foundArrays = [];
    traverse(schema, { allKeys: false }, (...traverseArgs) => {
        var [
            currentSchema,
            currentInSchemaPointer,
        ] = traverseArgs;

        //if (currentSchema.type === 'array' && currentInSchemaPointer !== '') {
        if (currentSchema.type === 'array') {
            foundArrays.push(currentInSchemaPointer)
        }
    })

    if (!oneOfTransformations) {
        return foundArrays;
    }

    var included = [];

    for (var ptr of foundArrays) {
        var match = ptr.match(/^(.*\/oneOf\/\d+)(.*?)$/)
        if (match) {
            var [ _ununsed, head, tail] = match;
            for (var trans of oneOfTransformations) {
                if (head === trans.to) {
                    included.push(ptr);
                } 
            }
        }
        else {
            included.push(ptr);
        }
    }

    return included;
}

var lazyResolve = (schema, data) => {
    // this wrapper enables us to replace the schema root if required
    var evilRefHack = { schema };

    //var pointerMapping = PointerMapping();
    var oneofResolver = OneofResolver();
    var transformations = [];

    traverse(schema, { allKeys: false }, (...traverseArgs) => {
        var [
            currentSchema,
            inSchemaPointer,
            rootSchema,
            parentInSchemaPointer,
            parentKeyword,
            parentSchema,
            propNameOrIndex
        ] = traverseArgs;

        //pointerMapping.addFromTraverse(...traverseArgs);
        
        //var dataPointer = pointerMapping.get(inSchemaPointer);
        var dataPointer = convertPointer(inSchemaPointer);
        var currentData = data;
        if (typeof data === 'object') {
            currentData = jsonpointer.get(data, dataPointer);
        }
        /*console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        console.log(currentSchema);
        console.log(dataPointer); // 0 1 2
        console.log(currentData);*/
        //var currentData = jsonpointer.get(data, dataPointer);
        //console.log(currentData);

        // NOTE: this should never happen as we deconstruct schema arrays
        // TODO: this can happen when root schema is an array
        if (currentSchema.type === 'array' && currentSchema.items) {
            throw new Error(inline`
                array with item definition found in "${inSchemaPointer}";
                its not possible to resolve wihtin array item definitions,
                the items in the corresponding array must be resolved
                individially
            `);
        }

        if (currentSchema.oneOf) {
            oneofResolver.resolve({
                traverseArgs,
                currentData,
            });
        }

    });

    var transformations = oneofResolver.transformations();
    for (var i = transformations.length - 1; i >= 0; i -= 1) {
        var { from, to } = transformations[i];
        from = `/schema${from}`;
        to = `/schema${to}`;

        //console.log('fromto', from, to);

        jsonpointer.set(
            evilRefHack,
            from,
            jsonpointer.get(evilRefHack, to)
        );
    }

    return {
        transformations,
        schema: evilRefHack.schema
    };
}

module.exports = lazyResolveAll;
