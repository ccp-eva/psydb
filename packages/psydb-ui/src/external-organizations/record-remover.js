import React from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSendRemove } from '@mpieva/psydb-ui-hooks';
import { Pair, AsyncButton, Icons, LoadingIndicator, Alert, FormBox }
    from '@mpieva/psydb-ui-layout';

import {
    withRecordRemover,
    ReverseRefList,
    DefaultRecordRemoverSuccessInfo,
} from '@mpieva/psydb-ui-lib';

const Pair39 = (ps) => (
    <Pair wLeft={ 3 } wRight={ 9 } className='px-3' { ...ps } />
)

const SafetyForm = (ps) => {
    var {
        collection, recordType, id, fetched,
        onSuccessfulUpdate
    } = ps;

    var { record } = fetched;
    var { sequenceNumber, _recordLabel } = record;

    var [{ translate }] = useI18N();

    var send = useSendRemove({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });

    var [ didFetchRefs, fetchedReverseRefs ] = useFetch((agent) => (
        agent.fetchRecordReverseRefs({ collection, id })
    ), [ collection, id ]);

    if (!didFetchRefs) {
        return <LoadingIndicator size='lg' />
    }
    var { reverseRefs } = fetchedReverseRefs.data;

    return (
        <FormBox
            title={ translate('Delete External Organization') }
            titleClassName='text-danger'
        >
            <Pair label={ translate('External Organization') }>
                { _recordLabel }
            </Pair>
            <Pair label={ translate('ID No.') }>
                { sequenceNumber }
            </Pair>
            <hr />
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('External Organization is referenced by other records!') }
                    </b></Alert>

                    <ReverseRefList reverseRefs={ reverseRefs } />
                    <hr />
                </>
            )}
            <AsyncButton
                variant='danger'
                disabled={ reverseRefs.length > 0 }
                { ...send.passthrough }
            >
                { translate('Delete') }
            </AsyncButton>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <DefaultRecordRemoverSuccessInfo
            title={ translate('External Organization Deleted') }
            blurp={ translate(
                'External Organization was deleted successfully!'
            )}
            { ...ps }
        />
    )
}

export const RecordRemover = withRecordRemover({
    SafetyForm,
    SuccessInfo
});
