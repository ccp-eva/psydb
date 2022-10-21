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
        agent.fetchLocationReverseRefs({ id })
    ), [ id ]);

    if (!didFetchRefs) {
        return <LoadingIndicator size='lg' />
    }
    var { reverseRefs } = fetchedReverseRefs.data;

    return (
        <FormBox title='Location löschen' titleClassName='text-danger'>
            <Pair 
                label='Location'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { _recordLabel }
            </Pair>
            <Pair 
                label='ID Nr.'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { sequenceNumber }
            </Pair>
            <hr />
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Location wird von anderen Datensätzen referenziert
                    </b></Alert>

                    <ReverseRefList reverseRefs={ reverseRefs } />
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
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    return (
        <FormBox titleClassName='text-success' title='Location gelöscht'>
            <i>Location wurde erfolgreich gelöscht</i>
            { successInfoBackLink && (
                <>
                    <hr />
                    <a href={ successInfoBackLink }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>zurück zur Liste</b>
                    </a>
                </>
            )}
        </FormBox>
    )
}

export const RecordRemover = withRecordRemover({
    SafetyForm,
    SuccessInfo
});
