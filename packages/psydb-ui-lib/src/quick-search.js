import React, { useMemo } from 'react';

import * as fieldSchemas from '@mpieva/psydb-schema-fields';
import fieldMetadata from '@mpieva/psydb-common-lib/src/field-type-metadata'

import SchemaForm from './default-schema-form';

const createSchema = (displayFieldData) => {
    console.log(displayFieldData);
    
    var properties = {};
    for (var it of displayFieldData) {
        var meta = fieldMetadata[it.type];
        if (meta && meta.canSearch) {
            var realType = (
                meta.searchDisplayType || meta.searchType || it.type
            );
            properties[it.dataPointer] = fieldSchemas[realType]({
                title: it.displayName,
                
                collection: it.props.collection,
                set: it.props.set,
            });
        }
    }

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
        <div className='bg-light p-3 border-bottom'>
            <SchemaForm
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
