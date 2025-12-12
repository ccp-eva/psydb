import React, { useState } from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useSelectionReducer } from '@mpieva/psydb-ui-hooks';
import { Grid, Alert, SmallFormFooter } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from '@mpieva/psydb-ui-form-controls';

import { LabOperatorCheckbox, GotoButton } from './utils';

const ConsentPrepareForm = (ps) => {
    var {
        onHide,
        experimentRecord, subjectRecord, labTeamRecord,
        studyConsentFormRecords,
        related,

        deferredConsentDocFetch,
    } = ps;

    var [{ translate }] = useI18N();

    var [
        selectedStudyConsentFormId,
        setSelectedStudyConsentFormId
    ] = useState(
        studyConsentFormRecords.length === 1
        ? studyConsentFormRecords[0]._id
        : undefined
    );

    var selectedLabOperatorIds = useSelectionReducer();

    var { _id: experimentId, state: { studyId }} = experimentRecord;
    var { _id: subjectId } = subjectRecord;

    var labOperatorIds = (
        labTeamRecord?.state.personnelIds
        || experimentRecord?.state.experimentOperatorIds
        || []
    );

    var gotoBag = {
        experimentId, subjectId, studyId,
        studyConsentFormId: selectedStudyConsentFormId,
        labOperatorIds: selectedLabOperatorIds.value
    }

    var [ didFetch, fetched ] = deferredConsentDocFetch;
    if (didFetch && fetched?.data?.record) {
        return null;
    }

    return (
        <Grid cols={[ '1fr' ]} gap='1rem'>
            <Grid cols={[ '200px', '1fr' ]} className='align-items-center'>
                <b>{ translate('Consent Form') }</b>
                <GenericEnum
                    options={ studyConsentFormRecords.reduce((acc, it) => ({
                        ...acc, [it._id]: it.state.internalName
                    }), {}) }
                    value={ selectedStudyConsentFormId }
                    onChange={ setSelectedStudyConsentFormId }
                />
            </Grid>
            <Grid cols={[ '200px', '1fr' ]} className='align-items-center'>
                <b>{ translate('Experimenters') }</b>
                <div>
                    { labOperatorIds.map((it, ix) => (
                        <LabOperatorCheckbox
                            key={ ix } _id={ it } related={ related }
                            selection={ selectedLabOperatorIds }
                        />
                    )) }
                </div>
            </Grid>
            { !(
                selectedStudyConsentFormId
                && selectedLabOperatorIds.value.length > 0
            ) && (
                <Alert variant='info'>
                    <i>{ translate('Please select consent form and lab operators.') }</i>
                </Alert>
            ) }
            <SmallFormFooter>
                <GotoButton { ...gotoBag } />
            </SmallFormFooter>
        </Grid>
    )
}

export default ConsentPrepareForm;
