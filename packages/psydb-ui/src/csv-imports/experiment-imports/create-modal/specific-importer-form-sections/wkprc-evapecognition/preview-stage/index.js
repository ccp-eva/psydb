import React, { useState } from 'react';

import { only, groupBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import {
    Alert,
    Button,
    SmallFormFooter,
    LoadingIndicator,
    AsyncButton,
} from '@mpieva/psydb-ui-layout';

import PreviewRecord from './preview-record';
import ButtonHeader from './button-header';
import IssueItemsAlert from './issue-items-alert';

const PreviewStage = (ps) => {
    var { studyId, subjectType, formValues, gotoPrepare } = ps;
    var {
        locationType,
        locationId,
        labOperatorIds = [],
        fileId,
    } = formValues['$'];

    var translate = useUITranslation();

    var saneLabOperatorIds = filterTruthy(labOperatorIds);
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});

    var commonPayload = {
        fileId, studyId, subjectType, locationId,
        labOperatorIds: filterTruthy(labOperatorIds)
    }
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.previewCSVExperimentImport({
            ...commonPayload,
            extraAxiosConfig: { disableErrorModal: [ 409 ]}
        })
    ), []);

    var send = useSend(() => ({
        type: 'csv-import/experiment/create-wkprc-evapecognition',
        payload: { ...commonPayload }
    }), { ...triggerBag })

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    if (fetched.errorResponse) {
        var { apiStatus, data } = fetched.errorResponse.data;
        var { message } = data;
        return (
            <>
                <ButtonHeader
                    { ...send.passthrough }
                    enableSubmit={ false }
                    onClickBack={ gotoPrepare }
                />
                <hr />
                <Alert variant='danger'>
                    <b>{ apiStatus }</b>
                    <div>{ message }</div>
                </Alert>
            </>
        )
    }
    else {
        var { previewRecords, related, pipelineData } = fetched.data;

        var { invalid, unresolved } = groupBy({
            items: pipelineData,
            createKey: (it) => (
                !it.isValid ? 'invalid' : (
                    !it.isRefReplacementOk ? 'unresolved' : 'ok'
                )
            )
        })

        var allOk = (
            invalid.length === 0
            && unresolved.length === 0
            && previewRecords.length > 0
        );

        var canForceImport = (
            previewRecords.length > 0
        );

        var forceImport = false;

        return (
            <>
                <ButtonHeader
                    { ...send.passthrough }
                    enableSubmit={ allOk || (canForceImport && forceImport) }
                    onClickBack={ gotoPrepare }
                />
                <hr />
                { !allOk && (
                    <IssueItemsAlert
                        invalid={ invalid }
                        unresolved={ unresolved }
                    />
                )}
                { (allOk || canForceImport) && (
                    <div className='d-flex flex-column gapy-2'>
                        { previewRecords.map((it, ix) => {
                            return (
                                <PreviewRecord
                                    key={ ix }
                                    previewRecord={ it }
                                    related={ related }
                                />
                            )
                        })}
                    </div>
                )}
            </>
        )
    }
}

var filterTruthy = (ary) => ary.filter(it => !!it);

export default PreviewStage;
