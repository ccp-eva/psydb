import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import {
    Alert,
    Button,
    SmallFormFooter,
    LoadingIndicator,
    SplitPartitioned,
    AsyncButton,
} from '@mpieva/psydb-ui-layout';

const PreviewStage = (ps) => {
    var { formValues, gotoPrepare } = ps;
    var {
        subjectType,
        researchGroupId,
        fileId,
    } = formValues['$'];
    
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate', 'onFailedUpdate'
    ]});
    
    var translate = useUITranslation();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.previewCSVSubjectImport({
            fileId,
            subjectType,
            researchGroupId,
        })
    ), []);
    
    var send = useSend(() => ({
        type: 'csv-import/subject/create-default',
        payload: {
            subjectType,
            researchGroupId,
            fileId,
        }
    }), { ...triggerBag })

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }
    
    var { previewRecords, related, csvErrors } = fetched.data;
    
    return (
        <>
            <SmallFormFooter>
                <AsyncButton { ...send.passthrough }>
                    { translate('Import') }
                </AsyncButton>
                <Button
                    disabled={ send.isTransmitting }
                    variant='outline-primary'
                    onClick={ gotoPrepare }
                >
                    { translate('Back') }
                </Button>
            </SmallFormFooter>
            <hr />
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
        </>
    )
}

const PreviewRecord = (ps) => {
    var { previewRecord, related } = ps;
    var {
        _recordLabel
    } = previewRecord;

    var translate = useUITranslation();

    return (
        <div>
            { _recordLabel }
        </div>
    )
}

export default PreviewStage;
