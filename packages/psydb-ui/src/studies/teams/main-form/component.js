import React from 'react';

import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var { initialValues, onSubmit, hasExperiments } = ps;

    return (
        <DefaultForm
            useAjvAsync
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <FormFields
                        hasExperiments={ hasExperiments }
                    />
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
    var { hasExperiments } = ps;

    return (
        <>
            <Fields.Color
                dataXPath='$.color'
                label='Farbe'
            />
            { hasExperiments && (
                <div className='mb-3'>
                    <i>
                        Team ist bereits Terminen zugeordnet,
                        Experimenter daher nicht mehr änderbar
                    </i>
                </div>
            )}
            <Fields.ForeignIdList
                dataXPath='$.personnelIds'
                label='Experimenter'
                collection='personnel'
                disabled={ hasExperiments }
            />
        </>
    )
}
