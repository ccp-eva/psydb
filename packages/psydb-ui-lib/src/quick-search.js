import React, { useMemo } from 'react';

import * as fieldSchemas from '@mpieva/psydb-schema-fields';
import fieldMetadata from '@mpieva/psydb-common-lib/src/field-type-metadata'

import SchemaForm from './default-schema-form';

const createSchema = (displayFieldData) => {
    var properties = {};
    for (var it of displayFieldData) {
        // FIXME: there is an issue with static fields
        // having a different key for their type
        var type = it.type || it.systemType;

        var meta = fieldMetadata[type];
        if (meta && meta.canSearch) {
            var realType = (
                meta.searchDisplayType || meta.searchType || type
            );
            properties[it.dataPointer] = fieldSchemas[realType]({
                title: it.displayName,
                systemProps: { uiWrapper: 'MultiLineWrapper' },
               
                ...(it.props && ({
                    ...it.props,
                })),
            });
        }
    }

    console.log(properties);

    return fieldSchemas.ExactObject({
        properties,
    });
}

const QuickSearch = ({
    displayFieldData,
    filters,
    onSubmit
}) => {
    var schema = useMemo(() => (
        createSchema(displayFieldData)
    ), [ displayFieldData ]);

    return (
        <div className='bg-light border-bottom pr-3 pl-3 pt-2 pb-2'>
            <SchemaForm
                className='d-flex align-items-end quick-search-fixes'
                buttonLabel='Suchen'
                schema={ schema }
                formData={ filters }
                onSubmit={
                    ({ formData }) => {
                        
                        var sanitized = {};
                        for (var key of Object.keys(formData)) {
                            var v = formData[key];
                            // filter string values that are empty
                            if (v || typeof v !== 'string') {
                                sanitized[key] = v;
                            }
                        }

                        onSubmit({ filters: sanitized })
                        return Promise.resolve();
                    }
                }
            />
        </div>
    )
}

export default QuickSearch;
