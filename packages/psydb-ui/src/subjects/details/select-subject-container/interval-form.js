import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    Button,
    SplitPartitioned
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

const IntervalForm = (ps) => {
    var {
        initialValues,
        onSubmit,
    } = ps;

    var translate = useUITranslation();

    return (
        <>
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
            >
                {(formikProps) => (
                    <SplitPartitioned
                        partitions={[ 2.3, 5, 5, 1 ]}
                        extraClassName='align-items-center'
                    >
                        <b>
                            { translate('Desired Time Range') }
                        </b>
                        <Fields.DateOnlyServerSide
                            formGroupClassName='m-0'
                            label={ translate('Start') }
                            dataXPath='$.start'
                        />
                        <Fields.DateOnlyServerSide
                            formGroupClassName='m-0'
                            label={ translate('End') }
                            dataXPath='$.end'
                        />
                        <div className='d-flex justify-content-end'>
                            <Button type='submit'>
                                { translate('Search') }
                            </Button>
                        </div>
                    </SplitPartitioned>
                )}
            </DefaultForm>
        </>
    );
}

export default IntervalForm;
