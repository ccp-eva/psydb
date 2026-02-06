import React, { useMemo } from 'react';
import classnames from 'classnames';

import { entries } from '@mpieva/psydb-core-utils';
import { __fixDefinitions } from '@mpieva/psydb-common-compat';

import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { Button, Icons } from '@mpieva/psydb-ui-layout';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import * as fieldSchemas from '@mpieva/psydb-schema-fields';
import fieldMetadata from '@mpieva/psydb-common-lib/src/field-type-metadata'

import {
    DefaultForm,
    QuickSearchFields
} from './formik';

const QuickSearch = (ps) => {
    var {
        target,
        displayFieldData,
        filters,
        onSubmit
    } = ps;

    var translate = useUITranslation();

    // TODO: make this controllable via crt settings
    var maxFields = (target === 'table' || !target) ? 5 : 3;

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
                        <FieldList
                            displayFieldData={ displayFieldData }
                            maxFields={ maxFields }
                        />
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
    var { displayFieldData: definitions, maxFields } = ps;
    var definitions = __fixDefinitions(definitions);
    
    var [ language ] = useUILanguage();
    //console.log(displayFieldData);

    var count = 0;
    var rendered = [];
    for (var [ix, def] of definitions.entries()) {
        var {
            key,
            systemType,
            displayName,
            displayNameI18N = {},
            pointer,
            props
        } = def;
       
        // XXX hotfix for quick search in subject groups
        if (systemType === 'ForeignId' && !props.recordType) {
            var c = allSchemaCreators[props.collection];
            if (c.hasCustomTypes) {
                continue;
            }
        }
        
        var Field = QuickSearchFields[systemType];
        if (!Field) {
            continue;
        }

        if (props && props.constraints) {
            props.constraints = entries(props.constraints).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    ...(!value.startsWith('$data') && { [key]: value })
                }), {}
            )
        }

        rendered.push(
            <Field
                key={ key }
                label={ displayNameI18N[language] || displayName }
                dataXPath={ `$.${pointer}` }
                autoFocus={ ix === 0 }
                { ...props }
            />
        );
        count += 1;
        
        if (count >= maxFields) {
            break;
        }
    }

    return rendered;
}

export default QuickSearch;
