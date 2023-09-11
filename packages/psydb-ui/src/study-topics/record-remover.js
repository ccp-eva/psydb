import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSendRemove } from '@mpieva/psydb-ui-hooks';
import {
    Pair,
    Button,
    Icons,
    LoadingIndicator,
    Alert,
} from '@mpieva/psydb-ui-layout';

import {
    withRecordRemover,
    FormBox,
    ReverseRefList
} from '@mpieva/psydb-ui-lib';

const SafetyForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var translate = useUITranslation();

    var { record } = fetched;
    var { sequenceNumber, _recordLabel } = record;

    var send = useSendRemove({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });

    var [ didFetchRefs, fetchedReverseRefs ] = useFetch((agent) => (
        agent.fetchRecordReverseRefs({
            collection,
            id
        })
    ), [ collection, id ]);

    if (!didFetchRefs) {
        return <LoadingIndicator size='lg' />
    }
    var { reverseRefs } = fetchedReverseRefs.data;

    return (
        <>
            <Pair 
                label={ translate('Study Topic') }
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { _recordLabel }
            </Pair>
            <hr />
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('Study topic is referenced by other records!') }
                    </b></Alert>

                    <ReverseRefList
                        reverseRefs={ reverseRefs }
                        shouldInlineItems={ true }
                    />
                    <hr />
                </>
            )}
            <Button
                variant='danger'
                onClick={ send.exec }
                disabled={ reverseRefs.length > 0 }
            >
                { translate('Delete') }
            </Button>
        </>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink, onHide } = ps;
    var translate = useUITranslation();
    return (
        <>
            <div className='text-success'>
                { translate('Study topic was deleted successfully!') }
            </div>
            <>
                <hr />
                <a onClick={ onHide } style={{ cursor: 'pointer' }}>
                    <Icons.ArrowLeftShort />
                    {' '}
                    <b>{ translate('Back to List') }</b>
                </a>
            </>
        </>
    )
}

export const RecordRemover = withRecordRemover({
    SafetyForm,
    SuccessInfo,
    noRouting: true
});
