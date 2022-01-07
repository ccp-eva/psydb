import React from 'react';

import {
    Icons,
    Button,
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    QuickSearchFields
} from '../formik';

//className='d-flex align-items-end quick-search-fixes'
export const QuickSearch = (ps) => {
    var {
        searchValues, onSubmit,
        fillX,
        className,
    } = ps;

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
                            <QuickSearchFields.SaneString
                                label='Name'
                                dataXPath='$.name'
                                groupClassName={ fillX ? 'flex-grow' : '' }
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
