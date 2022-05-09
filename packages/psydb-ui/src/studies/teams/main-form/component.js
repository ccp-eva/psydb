import React from 'react';

import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var { initialValues, onSubmit, ...pass } = ps;

    return (
        <DefaultForm
            useAjvAsync
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <FormFields { ...pass } />
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
    var { hasExperiments, enableVisibility } = ps;

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
                        Experimenter:innen daher nicht mehr änderbar
                    </i>
                </div>
            )}
            <Fields.ForeignIdList
                dataXPath='$.personnelIds'
                label='Experimenter:innen'
                collection='personnel'
                disabled={ hasExperiments }
            />
            { enableVisibility && (
                <Fields.DefaultBool
                    dataXPath='$.hidden'
                    label='Ausgeblendet'
                />
            )}
        </>
    )
}
