'use strict';
var PointerMapping = () => {
    var mapping = {},
        wrapper = {};

    mapping[''] = ''; // static root schema pointer

    wrapper.all = () => ({ ...mapping });
    wrapper.get = (k) => (mapping[k]);

    wrapper.addFromTraverse = (
        currentSchema,
        inSchemaPointer,
        rootSchema,
        parentInSchemaPointer,
        parentKeyword,
        parentSchema,
        propNameOrIndex
    ) => {
        var mappedParentPointer = mapping[parentInSchemaPointer];
        if (
            mapping[inSchemaPointer] === undefined
        ) {
            var shouldAppendPropName = (
                // FIXME: this might be evil
                // oneOf/allOf have numbers in this parameter
                // real property key are always strings i.e.
                // { [1]: 'foo' } => { '1': 'foo' }
                typeof propNameOrIndex === 'string'
            )
            mapping[inSchemaPointer] = (
                shouldAppendPropName
                ? mappedParentPointer + '/' + propNameOrIndex
                : mappedParentPointer
            )
        }
    };

    return wrapper;
}

module.exports = PointerMapping;
