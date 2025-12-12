import React, { useState } from 'react';
import classnames from 'classnames';
import { JsonBase64 } from '@cdxoo/json-base64';

import { merge } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useRevision, useSelectionReducer }
    from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    LoadingIndicator,
    Grid,
    SmallFormFooter,
    Button,
    Alert,
} from '@mpieva/psydb-ui-layout';

import { GenericEnum, PlainCheckbox } from '@mpieva/psydb-ui-form-controls';
import ConsentPrepareForm from './consent-prepare-form';
import ExistingConsent from './existing-consent';

const FetchWrapper = (ps) => {
    var {
        onHide, modalPayloadData,
        experimentRecord, labTeamRecord, related,
    } = ps;

    var { subjectRecord } = modalPayloadData;

    var { _id: experimentId, state: { studyId }} = experimentRecord;
    var { _id: subjectId, type: subjectType } = subjectRecord;

    var revision = useRevision();

    var deferredConsentDocFetch = useFetch((agent) => {
        return agent.studyConsentDoc.readByExperimentAndSubject({
            experimentId, subjectId,
        })
    }, [ revision.value ]);

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.study.relatedStudyConsentForms({
            studyId, subjectType,
        })
    }, []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    //related = merge(related, fetched.data.related);

    var bag = {
        onHide,
        experimentRecord, subjectRecord, labTeamRecord,
        studyConsentFormRecords: fetched.data.records,
        related,

        deferredConsentDocFetch,
        revision,
    }

    return (
        <ConsentFormSelectModalBody { ...bag } />
    );
}

const ConsentFormSelectModalBody = (ps) => {
    var {
        onHide,
        experimentRecord, subjectRecord, labTeamRecord,
        studyConsentFormRecords,
        related,

        deferredConsentDocFetch,
        revision,
    } = ps;

    var [{ translate }] = useI18N();

    var prepareBag = {
        onHide,
        experimentRecord, subjectRecord, labTeamRecord,
        studyConsentFormRecords,
        related,
        
        deferredConsentDocFetch,
    }

    var existingBag = {
        deferredConsentDocFetch,
        revision,
    }

    return (
        <div>
            <ConsentPrepareForm { ...prepareBag }/>
            <ExistingConsent { ...existingBag } />
        </div>
    )
}


export const ConsentFormSelectModal = WithDefaultModal({
    title: 'Consent Form',
    size: 'lg',
    bodyClassName: 'bg-white pt-3 pr-3 pl-3',
    Body: FetchWrapper,
});

