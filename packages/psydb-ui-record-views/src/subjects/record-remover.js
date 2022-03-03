import React from 'react';

import { useFetch, useSendRemove } from '@mpieva/psydb-ui-hooks';

import {
    Pair,
    Button,
    Icons,
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import { withRecordRemover, FormBox } from '@mpieva/psydb-ui-lib';

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
        subChannels: [ 'gdpr', 'scientific' ],
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

    return (
        <FormBox title='Proband löschen' titleClassName='text-danger'>
            <Pair 
                label='Proband'
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
            <Button
                variant='danger'
                onClick={ send.exec }
            >
                Löschen
            </Button>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    return (
        <FormBox titleClassName='text-success' title='Proband gelöscht'>
            <i>Proband wurde erfolgreich gelöscht</i>
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
