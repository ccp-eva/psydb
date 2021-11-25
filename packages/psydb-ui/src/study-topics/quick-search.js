import React from 'react';

import {
    Icons,
    Button,
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

//className='d-flex align-items-end quick-search-fixes'
const QuickSearch = (ps) => {
    var { searchValues, onSubmit } = ps;
    var className = (
        'bg-light border-bottom px-3 py-2 d-flex justify-content-start'
    );

    var wrappedOnSubmit = (formData, formikProps) => (
        onSubmit(formData['$'])
    );

    return (
        <div className={ className }>

            <DefaultForm
                className='d-flex align-items-end quick-search-fixes'
                onSubmit={ wrappedOnSubmit }
                initialValues={{}}
            >
                {(formikProps) => {
                    return (
                        <>
                            <Fields.SaneString
                                label='Name'
                                dataXPath='$.name'
                            />
                            <Button
                                className='ml-3'
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
        </div>
    )
}

export default QuickSearch;
