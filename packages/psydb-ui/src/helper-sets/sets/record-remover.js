import React from 'react';
import { useFetch, useSendRemove } from '@mpieva/psydb-ui-hooks';
import {
    Pair,
    Button,
    Icons,
    LoadingIndicator,
    Alert,
    CRTFieldRefList,
    FormBox,
} from '@mpieva/psydb-ui-layout';

import {
    withRecordRemover,
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
    var { state: { label }} = record;

    var send = useSendRemove({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });

    var [ didFetchInfo, fetchedInfo ] = useFetch((agent) => (
        agent.fetchHelperSetPreRemoveInfo({ id })
    ), [ id ]);

    if (!didFetchInfo) {
        return <LoadingIndicator size='lg' />
    }
    var { existingItemCount, crtFieldRefs } = fetchedInfo.data;

    return (
        <FormBox title='Hilfstabelle löschen' titleClassName='text-danger'>
            <Pair 
                label='Hilfstabelle'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { label }
            </Pair>
            <hr />
            { existingItemCount > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Es existieren noch Einträge in dieser Hilfstabelle
                    </b></Alert>
                    <hr />
                </>
            )}
            { crtFieldRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Hilfstabelle wird von Feldern
                        in Datensatztypen referenziert
                    </b></Alert>

                    <CRTFieldRefList crtFieldRefs={ crtFieldRefs} />
                    <hr />
                </>
            )}
            <Button
                variant='danger'
                onClick={ send.exec }
                disabled={
                    existingItemCount > 0
                    || crtFieldRefs.length > 0
                }
            >
                Löschen
            </Button>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    return (
        <FormBox titleClassName='text-success' title='Hilfstabelle gelöscht'>
            <i>Hilfstabelle wurde erfolgreich gelöscht</i>
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
    SuccessInfo,
    urlIdParam: 'setId',
});
