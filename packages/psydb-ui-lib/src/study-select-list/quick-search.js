import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    Icons,
    Button,
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    QuickSearchFields
} from '../formik';

export const QuickSearch = (ps) => {
    var {
        className,
        displayFieldData,
        searchValues,
        onSubmit
    } = ps;
    
    var translate = useUITranslation();

    return (
        <div className={ className }>
            <DefaultForm
                className='d-flex align-items-end quick-search-fixes'
                onSubmit={ onSubmit }
                initialValues={ searchValues || {}}
            >
                {(formikProps) => {
                    return (
                        <>
                            <FieldList
                                displayFieldData={ displayFieldData }
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
        </div>
    )
}

const FieldList = (ps) => {
    var { displayFieldData } = ps;

    return (
        <>
            { displayFieldData.map(it => {
                var Field = QuickSearchFields[it.systemType];
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
