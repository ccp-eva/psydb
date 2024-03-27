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

    return (
        <FormBox
            title={ translate('Delete API Key') }
            titleClassName='text-danger'
        >
            <Pair 
                label={ translate('API Key')}
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { label }
            </Pair>
            <hr />
            <Button
                variant='danger'
                onClick={ send.exec }
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
            title={ translate('API Key Deleted') }
        >
            <i>
                { translate('API Key was deleted successfully!') }
            </i>
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
    urlIdParam: 'id',
});
