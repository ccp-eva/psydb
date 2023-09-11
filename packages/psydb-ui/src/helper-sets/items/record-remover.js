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

    var { record } = fetched;
    var { sequenceNumber, _recordLabel } = record;

    var translate = useUITranslation();

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
        <FormBox
            title={ translate('Delete Helper Table Item') }
            titleClassName='text-danger'
        >
            <Pair 
                label={ translate('Helper Table Item') }
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { _recordLabel }
            </Pair>
            <hr />
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('Helper table item is referenced by other records!') }
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
                { translate('Delete') }
            </Button>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    var translate = useUITranslation();
    return (
        <FormBox
            titleClassName='text-success'
            title={ translate('Helper Table Item Deleted') }
        >
            <i>{ translate('Helper table item deleted succcessfully.') }</i>
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
