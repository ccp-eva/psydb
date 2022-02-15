import React, { useMemo } from 'react';
import classnames from 'classnames';
import { Button, Icons } from '@mpieva/psydb-ui-layout';

import * as fieldSchemas from '@mpieva/psydb-schema-fields';
import fieldMetadata from '@mpieva/psydb-common-lib/src/field-type-metadata'

import {
    DefaultForm,
    QuickSearchFields
} from './formik';

import { SchemaForm } from './schema-form';

const createSchema = (displayFieldData) => {
    var properties = {};
    for (var it of displayFieldData.slice(0,4)) {
        //console.log(displayFieldData);
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
                    setId: it.props.setId,
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
    var className = classnames([
        'bg-light border-bottom',
        'pr-3 pl-3 pt-2 pb-2',
        'd-flex justify-content-start align-items-end quick-search-fixes',
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
                            Suchen
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
    console.log(displayFieldData);

    return (
        <>
            { displayFieldData.map(it => {
                var Field = QuickSearchFields[it.type || it.systemType];
                if (!Field) {
                    return null;
                }
                return (
                    <Field
                        key={ it.key }
                        label={ it.displayName }
                        dataXPath={ `$.${it.dataPointer}` }
                    />
                )
            }) }
        </>
    );
}


//const QuickSearch_OLD = ({
//    displayFieldData,
//    filters,
//    onSubmit
//}) => {
//    var schema = useMemo(() => (
//        createSchema(displayFieldData)
//    ), [ displayFieldData ]);
//
//    var className = classnames([
//        'bg-light border-bottom',
//        'pr-3 pl-3 pt-2 pb-2',
//        'd-flex justify-content-start',
//    ]);
//
//    return (
//        <div className={ className }>
//            <SchemaForm
//                className='d-flex align-items-end quick-search-fixes'
//                buttonLabel='Suchen'
//                noErrorIndicator={ true }
//                schema={ schema }
//                formData={ filters }
//                onSubmit={
//                    ({ formData }) => {
//                        
//                        var sanitized = {};
//                        for (var key of Object.keys(formData)) {
//                            var v = formData[key];
//                            // filter string values that are empty
//                            if (v || typeof v !== 'string') {
//                                sanitized[key] = v;
//                            }
//                        }
//
//                        onSubmit({ filters: sanitized })
//                        return Promise.resolve();
//                    }
//                }
//            >
//                <Button
//                    className='ml-2'
//                    variant='outline-secondary'
//                    onClick={ () => onSubmit({}) }
//                >
//                    <Icons.XLg style={{
//                        height: '13px',
//                        width: '13px',
//                        marginTop: '-2px'
//                    }} />
//                </Button>
//            </SchemaForm>
//        </div>
//    )
//}

export default QuickSearch;
