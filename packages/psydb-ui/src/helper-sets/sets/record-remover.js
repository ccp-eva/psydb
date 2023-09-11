import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

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
        <FormBox
            title={ 'Delete Helper Table' }
            titleClassName='text-danger'
        >
            <Pair 
                label={ 'Helper Table' }
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { label }
            </Pair>
            <hr />
            { existingItemCount > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('There are still records in this helper table!') }
                    </b></Alert>
                    <hr />
                </>
            )}
            { crtFieldRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('Helper table is referenced by record type fields!') }
                    </b></Alert>

                    <CRTFieldRefList crtFieldRefs={ crtFieldRefs } />
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
            title={ translate('Helper Table Deleted') }
        >
            <i>{ translate('Helper table deleted succcessfully.') }</i>
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
    SuccessInfo,
    urlIdParam: 'setId',
});
