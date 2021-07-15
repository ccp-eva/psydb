import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';

import * as fieldSchemas from '@mpieva/psydb-schema-fields';
import fieldMetadata from '@mpieva/psydb-common-lib/src/field-type-metadata'

import SchemaForm from './default-schema-form';

const createSchema = (displayFieldData) => {
    var properties = {};
    for (var it of displayFieldData.slice(0,5)) {
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
              
                // cannot pass all props since the might include
                // string constraints like minLength
                ...(it.props && ({
                    collection: it.props.collection,
                    recordType: it.props.recordType,
                    constraints: it.props.constraints,
                    set: it.props.set,
                })),
            });
        }
    }

    //console.log(properties);

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
        <div className='bg-light border-bottom pr-3 pl-3 pt-2 pb-2 d-flex justify-content-start'>
            <SchemaForm
                className='d-flex align-items-end quick-search-fixes'
                buttonLabel='Suchen'
                showResetButton={ true }
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
            >
                <Button
                    className='mr-2'
                    variant='outline-secondary'
                    onClick={ () => onSubmit({}) }
                >
                    X
                </Button>
            </SchemaForm>
        </div>
    )
}

export default QuickSearch;
