import React from 'react';
import jsonpointer from 'jsonpointer';

export const withRenderer = (options) => {
    var { labels, fields, entityProp } = options;
    
    var Renderer = (ps) => {
        var { pointers, ...pass } = ps;
        var entity = ps[entityProp];

        return pointers.map(pointer => {
            var Component = fields[pointer];
            var value = jsonpointer.get(entity, pointer);
            
            //var nestedPointers = (
            //    pointers
            //    .filter(it => it.startsWith(pointer) && it !== pointer)
            //    .map(it => it.slice(pointer.length))
            //);
            
            return (
                <Component
                    { ...pass }
                    label={ labels[pointer] }
                    //pointer={ pointer }
                    //nestedPointers={ nestedPointers }
                    value={ value }
                />
            )
        })
    }

    return Renderer;
}
