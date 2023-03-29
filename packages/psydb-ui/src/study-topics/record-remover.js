import React from 'react';

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
                label='Themengebiet'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { _recordLabel }
            </Pair>
            <hr />
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Themengebiet wird von anderen Datensätzen referenziert
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
                Löschen
            </Button>
        </>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink, onHide } = ps;
    return (
        <>
            <div className='text-success'>
                Themengebiet wurde erfolgreich gelöscht
            </div>
            <>
                <hr />
                <a onClick={ onHide } style={{ cursor: 'pointer' }}>
                    <Icons.ArrowLeftShort />
                    {' '}
                    <b>zurück zur Liste</b>
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
