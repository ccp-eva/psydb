import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
                            <QuickSearchFields.SaneString
                                label={ translate('Name/Shorthand') }
                                dataXPath='$.nameOrShorthand'
                                groupClassName='flex-grow'
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
