import React from 'react';

import {
    Icons,
    Button,
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    QuickSearchFields
} from '@mpieva/psydb-ui-lib';

export const QuickSearch = (ps) => {
    var {
        className,
        searchValues,
        onSubmit
    } = ps;

    var wrappedOnSubmit = (formData, formikProps) => (
        onSubmit(formData['$'])
    );

    return (
        <div className={ className }>
            <DefaultForm
                className='d-flex align-items-end quick-search-fixes'
                onSubmit={ wrappedOnSubmit }
                initialValues={ searchValues || {}}
            >
                {(formikProps) => {
                    return (
                        <>
                            <QuickSearchFields.SaneString
                                label='Name/Kürzel'
                                dataXPath='$.nameOrShorthand'
                                groupClassName='flex-grow'
                            />
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
        </div>
    )
}
