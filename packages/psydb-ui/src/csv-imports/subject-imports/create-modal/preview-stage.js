import React, { useState } from 'react';
import classnames from 'classnames';

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
    Icons,
} from '@mpieva/psydb-ui-layout';

import { RecordDetails } from '@mpieva/psydb-ui-record-views/subjects';

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
    var [ selectedIndex, setSelectedIndex ] = useState(0);
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.previewCSVSubjectImport({
            fileId,
            subjectType,
            researchGroupId,
            extraAxiosConfig: { disableErrorModal: [ 409 ]}
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

    //var { status } = (fetched.response || fetched.errorResponse)
    //if (status !== 200) {
    //    return (
    //        <>
    //            <Button
    //                variant='outline-primary'
    //                onClick={ gotoPrepare }
    //            >
    //                { translate('Back') }
    //            </Button>
    //            <hr />
    //            <ErrorInfo fetched={ fetched } />
    //        </>
    //    )
    //}

    if (fetched.errorResponse) {
        var { apiStatus, data } = fetched.errorResponse.data;
        var { message } = data;
        return (
            <>
                <SmallFormFooter>
                    <AsyncButton { ...send.passthrough } disabled={ true }>
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
                <Alert variant='danger'>
                    <b>{ apiStatus }</b>
                    <div>{ message }</div>
                </Alert>
            </>
        )
    }
    else {
        var { previewRecords, related, crtSettings } = fetched.data;
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
                <SplitPartitioned partitions={[ 4, 8 ]}>
                    <div className='d-flex flex-column gapy-2'>
                        { previewRecords.map((it, ix) => {
                            return (
                                <AComponent
                                    key={ ix }
                                    previewRecord={ it }
                                    onClick={ () => setSelectedIndex(ix) }
                                    isActive={ selectedIndex === ix }
                                >
                                    { it._recordLabel }
                                </AComponent>
                            )
                        })}
                    </div>
                    <div className='border ml-3 px-3 py-1'>
                        <RecordDetails.Body fetched={{
                            record: previewRecords[selectedIndex],
                            related,
                            crtSettings,
                        }} />
                    </div>
                </SplitPartitioned>
            </>
        )
    }
}

const AComponent = (ps) => {
    var {
        isActive,
        onClick,
        children,
    } = ps;

    var className = classnames([
        'd-flex justify-content-between align-items-center',
        `bg-white px-3 py-2 border`
    ]);

    return (
        <a 
            className='link'
            style={{ color: (isActive ? 'var(--primary)' : 'var(--default-text)') }}
            onClick={ onClick }
        >
            <b className={ className } role='button'>
                <span>{ children }</span>
                <Icons.ChevronDoubleRight />
            </b>
        </a>
    )
}

const ErrorInfo = (ps) => {
    var { fetched } = ps;
    var { apiStatus, data: {
        message, stack, ...errorInfo
    }} = fetched.errorResponse.data;

    return (
        <>
            <Alert variant='danger' className='mb-3'>
                <b>{ message }</b>
            </Alert>
            <pre className='bg-white border p-3'>
                { JSON.stringify(errorInfo, null, 4) }
            </pre>
        </>
    )
}

export default PreviewStage;
