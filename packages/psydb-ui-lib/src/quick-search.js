import React, { useMemo } from 'react';
import classnames from 'classnames';

import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { Button, Icons } from '@mpieva/psydb-ui-layout';

import * as fieldSchemas from '@mpieva/psydb-schema-fields';
import fieldMetadata from '@mpieva/psydb-common-lib/src/field-type-metadata'

import {
    DefaultForm,
    QuickSearchFields
} from './formik';

const QuickSearch = (ps) => {
    var {
        displayFieldData,
        filters,
        onSubmit
    } = ps;

    var translate = useUITranslation();

    var className = classnames([
        'bg-light',
        'pr-3 pl-3 pt-2 pb-2',
        'd-flex justify-content-start align-items-end quick-search-fixes',
        'media-print-hidden'
    ]);

    var handleSubmit = (formData) => {
        var sanitized = {};
        for (var key of Object.keys(formData)) {
            var v = formData[key];
            // filter string values that are empty
            if (v || typeof v !== 'string') {
                sanitized[key] = v;
            }
        }

        return onSubmit({ filters: sanitized })
    }

    return (
        <DefaultForm
            className={ className }
            initialValues={ filters || {} }
            onSubmit={ handleSubmit }
            enableReinitialize={ true }
        >
            {(formikProps) => {
                return (
                    <>
                        <FieldList displayFieldData={
                            displayFieldData.slice(0,4)
                        } />
                        <Button
                            className=''
                            type='submit'
                        >
                            { translate('Search') }
                        </Button>
                        <Button
                            className='ml-2'
                            variant='outline-secondary'
                            onClick={ () => {
                                onSubmit({});
                                formikProps.resetForm();
                            }}
                        >
                            <Icons.XLg style={{
                                height: '13px',
                                width: '13px',
                                marginTop: '-2px'
                            }} />
                        </Button>
                    </>
                );
            }}
        </DefaultForm>
    )
}

const FieldList = (ps) => {
    var { displayFieldData } = ps;
    var [ language ] = useUILanguage();
    //console.log(displayFieldData);

    return (
        <>
            { displayFieldData.map((it, ix) => {
                var {
                    key,
                    type,
                    systemType,
                    displayName,
                    displayNameI18N = {},
                    pointer,
                    dataPointer
                } = it; 
                
                // FIXME: use fixDefintions()
                pointer = pointer || dataPointer;
                type = type || systemType;

                var Field = QuickSearchFields[type];
                if (!Field) {
                    return null;
                }
                return (
                    <Field
                        autoFocus={ ix === 0 }
                        key={ key }
                        label={ displayNameI18N[language] || displayName }
                        dataXPath={ `$.${pointer}` }
                    />
                )
            }) }
        </>
    );
}

export default QuickSearch;
