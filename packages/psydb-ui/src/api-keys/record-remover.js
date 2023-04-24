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

    return (
        <FormBox title='Api-Key löschen' titleClassName='text-danger'>
            <Pair 
                label='Api-Key'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { label }
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
        <FormBox titleClassName='text-success' title='Api-Key gelöscht'>
            <i>Api-Key wurde erfolgreich gelöscht</i>
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
    urlIdParam: 'id',
});
