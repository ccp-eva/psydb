import React from 'react';

import { inlineText } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
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
                    <FormFields { ...pass } formikProps={ formikProps } />
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
    var { hasExperiments, enableVisibility, formikProps } = ps;
    var { values } = formikProps;
    var { researchGroupId } = values['$'];

    var translate = useUITranslation();
    var permissions = usePermissions();

    return (
        <>
            <Fields.Color
                dataXPath='$.color'
                label={ translate('Color') }
            />
            { hasExperiments && (
                <div className='mb-3'>
                    <i>{ translate(inlineText`
                        Experimenters and research group can not be changed,
                        as the team already has appointments.
                    `)}</i>
                </div>
            )}
            
            <Fields.ForeignId
                dataXPath='$.researchGroupId'
                label={ translate('Research Group') }
                collection='researchGroup'
                constraints={{
                    ...(!permissions.isRoot() && {
                        '/_id': permissions.getResearchGroupIds()
                    })
                }}
                disabled={ hasExperiments }
            />
            <Fields.ForeignIdList
                dataXPath='$.personnelIds'
                label={ translate('Experimenters') }
                collection='personnel'
                constraints={{
                    '/scientific/state/researchGroupSettings/researchGroupId': researchGroupId
                }}
                disabled={ hasExperiments || !researchGroupId }
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
