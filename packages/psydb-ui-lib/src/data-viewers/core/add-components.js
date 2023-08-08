import React, { useContext } from 'react';
import jsonpointer from 'jsonpointer';
import { withPair } from './with-pair';

export const addComponents = (target, context, labels, items) => {
    items.forEach(it => {
        var { cname, path, Component } = it;
        
        if (!Component) {
            Component = withPair();
        }

        target[cname] = (ps) => {
            var { value, ...pass } = useContext(context);
            var propLabel = labels[path];
            var propValue = (
                path
                ? jsonpointer.get(value, path)
                : value
            );
            return (
                <Component
                    label={ propLabel }
                    value={ propValue }
                    { ...pass }
                    { ...ps }
                    record={ value }
                />
            );
        }
    });
}
