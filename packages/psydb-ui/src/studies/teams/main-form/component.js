import React from 'react';

import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var { initialValues, onSubmit } = ps;

    return (
        <DefaultForm
            useAjvAsync
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <FormFields />
                    <hr />
                    <div className='d-flex justify-content-end'>
                        <Button type='submit'>Speichern</Button>
                    </div>
                </>
            )}
        </DefaultForm>
    )
}

const FormFields = (ps) => {
    return (
        <>
            <Fields.Color
                dataXPath='$.color'
                label='Farbe'
            />
            <Fields.ForeignIdList
                dataXPath='$.personnelIds'
                label='Experimenter'
                collection='personnel'
            />
        </>
    )
}
