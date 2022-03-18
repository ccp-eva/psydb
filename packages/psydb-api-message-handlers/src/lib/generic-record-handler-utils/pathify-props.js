'use strict';

var pathifyProps = ({
    subChannelKey,
    props,
    prefix,
    depth = 0
}) => {
    var mongoSet = Object.keys(props).reduce((acc, key) => {
        var value = props[key];
        var path = (
            prefix
            ? `${prefix}.${key}`
            : subChannelKey 
            ? `${subChannelKey}.state.${key}`
            : `state.${key}`
        );

        var converted = (
            key === 'custom' && depth === 0
            ? pathifyProps({
                props: value,
                prefix: path,
                depth: depth + 1
            })
            : { [path]: value }
        );

        return {
            ...acc,
            ...converted
        };
    }, {});

    return mongoSet;
}

module.exports = { pathifyProps };
