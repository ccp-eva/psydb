import React, { useContext } from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { withPair } from './with-pair';

export const addComponents = (target, context, labels, items) => {
    items.forEach(it => {
        var { cname, path, Component } = it;
        
        if (!Component) {
            Component = withPair();
        }

        target[cname] = (ps) => {
            var [{ translate }] = useI18N();
            var { value, ...pass } = useContext(context);
            var propLabel = labels[path];

            var isRedacted = (
                path.startsWith('/gdpr/state')
                && jsonpointer.get(value, '/gdpr/state') === '[[REDACTED]]'
            );
            
            if (isRedacted) {
                var RComponent = withPair();
                return <RComponent
                    label={ translate(propLabel) }
                    value={(
                        <span className='text-danger'>
                            { translate('Anonymized') }
                        </span>
                    )}
                />
            }

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
