import React, { useContext } from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { withPair } from './with-pair';

export const addComponents = (target, context, labels, items) => {
    items.forEach(it => {
        var { cname, path, Component } = it;
        
        if (!Component) {
            Component = withPair();
        }

        target[cname] = (ps) => {
            var translate = useUITranslation();

            var { value, ...pass } = useContext(context);
            var propLabel = labels[path];
            var propValue = (
                path
                ? jsonpointer.get(value, path)
                : value
            );
            return (
                <Component
                    label={ translate(propLabel) }
                    value={ propValue }
                    { ...pass }
                    { ...ps }
                    record={ value }
                />
            );
        }
    });
}
