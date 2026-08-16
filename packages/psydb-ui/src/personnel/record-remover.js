import React from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import { Pair, AsyncButton, Icons, LoadingIndicator, Alert }
    from '@mpieva/psydb-ui-layout';
import { withRecordRemover, FormBox, ReverseRefList }
    from '@mpieva/psydb-ui-lib';


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

    var [{ translate }] = useI18N();

    var send = useSend(() => ({
        type: 'personnel/remove',
        payload: { _id: record._id }
    }), { onSuccessfulUpdate: (response) => {
        onSuccessfulUpdate?.({ response });
    }});

    var [ didFetchRefs, fetchedReverseRefs ] = useFetch((agent) => (
        agent.fetchRecordReverseRefs({ collection, id })
    ), [ collection, id ]);

    if (!didFetchRefs) {
        return <LoadingIndicator size='lg' />
    }
    var { reverseRefs } = fetchedReverseRefs.data;

    return (
        <FormBox
            title={ translate('Delete Staff Member') }
            titleClassName='text-danger'
        >
            <Pair 
                label={ translate('Staff Member') }
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { _recordLabel }
            </Pair>
            <Pair 
                label={ translate('ID No.') }
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { sequenceNumber }
            </Pair>
            <hr />
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('Staff member is referenced by other records!') }
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
                { translate('Remove') }
            </AsyncButton>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    var [{ translate }] = useI18N();

    return (
        <FormBox
            titleClassName='text-success'
            title={ translate('Staff Member Deleted') }
        >
            <i>{ translate('Staff member was deleted successfully!') }</i>
            { successInfoBackLink && (
                <>
                    <hr />
                    <a href={ successInfoBackLink }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>{ translate('Back to List') }</b>
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
