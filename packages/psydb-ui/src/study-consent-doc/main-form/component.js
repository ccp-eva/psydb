import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

import ConsentDocElement from './consent-doc-element';

export const Component = (ps) => {
    var {
        studyConsentForm, subjectCRT, labOperatorIds,
        initialValues, onSubmit
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
                    />

                    <h1>{ titleI18N?.[language] || title }</h1>
                    <hr />
                    <FormFields
                        studyConsentForm={ studyConsentForm }
                        subjectCRT={ subjectCRT }
                    />
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
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

var InfoBox = (ps) => {
    var { style, className, studyId, labOperatorIds = [] } = ps;
    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        personnel: agent.personnel.readManyLabels({ ids: labOperatorIds }),
        study: agent.study.readManyLabels({ ids: [ studyId ] }),
    }), [ studyId, labOperatorIds.join(',') ])

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
                { Object.values(personnel.labels).map((it, ix) => (
                    <div>{ it }</div>
                )) }
            </div>
        </div>
    )
}
