import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

export const Component = (ps) => {
    var { initialValues, onSubmit, ...pass } = ps;

    var translate = useUITranslation();

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
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
                    </div>
                </>
            )}
        </DefaultForm>
    )
}

const FormFields = (ps) => {
    var { hasExperiments, enableVisibility } = ps;

    var translate = useUITranslation();

    return (
        <>
            <Fields.Color
                dataXPath='$.color'
                label={ translate('Color') }
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
                label={ translate('Experimenters') }
                collection='personnel'
                disabled={ hasExperiments }
            />
            { enableVisibility && (
                <Fields.DefaultBool
                    dataXPath='$.hidden'
                    label={ translate('Hidden') }
                />
            )}
        </>
    )
}
