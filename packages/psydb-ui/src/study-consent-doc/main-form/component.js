import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { AsyncButton } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import ConsentDocElement from './consent-doc-element';

export const Component = (ps) => {
    var {
        studyConsentForm, subjectCRT, labOperatorIds, consentObtainedBy,
        initialValues, onSubmit, isTransmitting,
    } = ps;

    var { studyId } = studyConsentForm;
    var { title, titleI18N } = studyConsentForm.state;
    var [{ translate, language }] = useI18N();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
        >
            {(formikProps) => (
                <>
                    <InfoBox
                        studyId={ studyId }
                        labOperatorIds={ labOperatorIds }
                        consentObtainedBy={ consentObtainedBy }
                    />

                    <h1>{ titleI18N?.[language] || title }</h1>
                    <hr />
                    <FormFields
                        studyConsentForm={ studyConsentForm }
                        subjectCRT={ subjectCRT }
                    />
                    <AsyncButton
                        type='submit'
                        isTransmitting={ isTransmitting }
                    >
                        { translate('Save') }
                    </AsyncButton>
                </>
            )}
        </DefaultForm>
    );
}

const FormFields = (ps) => {
    var { studyConsentForm, subjectCRT } = ps;
    var [{ translate }] = useI18N();

    var { elements } = studyConsentForm.state;

    return (
        <>
            { elements.map((it, ix) => (
                <ConsentDocElement
                    { ...it } key={ ix } 
                    index={ ix } subjectCRT={ subjectCRT }
                />
            ))}
        </>
    )
}

export var InfoBox = (ps) => {
    var {
        style, className, studyId, labOperatorIds = [], consentObtainedBy
    } = ps;
    var [{ translate }] = useI18N();

    // NOTE: older docs dont have consentObtainedBy
    var personnelIds = [
        ...labOperatorIds,
        ...(consentObtainedBy ? [ consentObtainedBy ] : [])
    ];
    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        personnel: agent.personnel.readManyLabels({ ids: personnelIds }),
        study: agent.study.readManyLabels({ ids: [ studyId ] }),
    }), [ studyId, personnelIds.join(',') ])

    if (!didFetch) {
        return null;
    }

    var { personnel, study } = fetched._stageDatas;

    return (
        <div className='d-flex justify-content-between mb-3'>
            <div>
                <header><b>{ translate('Study') }</b></header>
                { study.labels[studyId] }
            </div>
            <div>
                <header><b>{ translate('Study Investigator') }</b></header>
                { labOperatorIds.map((it, ix) => (
                    <div key={ ix }>{ personnel.labels[it] }</div>
                )) }
            </div>
            <div>
                <header><b>{ translate('Person obtaining consent') }</b></header>
                { personnel.labels[consentObtainedBy] }
            </div>
        </div>
    )
}
