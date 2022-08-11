import React from 'react';
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

    return (
            <DefaultForm
                initialValues={ initialValues }
                onSubmit={ onSubmit }
            >
                {(formikProps) => (
                    <SplitPartitioned partitions={[ 5, 5, 1 ]}>
                        <Fields.DateOnlyServerSide
                            formGroupClassName='m-0'
                            label='Beginn'
                            dataXPath='$.start'
                        />
                        <Fields.DateOnlyServerSide
                            formGroupClassName='m-0'
                            label='Ende'
                            dataXPath='$.end'
                        />
                        <div className='d-flex justify-content-end'>
                            <Button type='submit'>Filtern</Button>
                        </div>
                    </SplitPartitioned>
                )}
            </DefaultForm>
    );
}

export default IntervalForm;
