import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Pair, AsyncButton, Icons } from '@mpieva/psydb-ui-layout';
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

    var [{ translate }] = useI18N();

    var send = useSend(() => ({
        type: `${collection}/clean-gdpr`,
        payload: { _id: record._id },
    }), { onSuccessfulUpdate });

    var title = translate('Anonymize Staff-Member');
    return (
        <FormBox title={ title } titleClassName='text-danger'>
            <Pair 
                label={ translate('Staff-Member') }
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
            <AsyncButton variant='danger' { ...send.passthrough }>
                { translate('Anonymize') }
            </AsyncButton>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    var [{ translate }] = useI18N();
    
    var title = translate('Staff-Member Anonymized');
    return (
        <FormBox titleClassName='text-success' title={ title }>
            <i>{ translate('Staff-Member was successfully anonymized') }</i>
            { successInfoBackLink && (
                <>
                    <hr />
                    <a href={ successInfoBackLink }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>{ translate('back to List') }</b>
                    </a>
                </>
            )}
        </FormBox>
    )
}

export const RecordAnonymizer = withRecordRemover({
    SafetyForm,
    SuccessInfo
});
