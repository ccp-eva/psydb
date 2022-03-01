import React from 'react';

import { Pair, Button } from '@mpieva/psydb-ui-layout';
import { withRecordRemover, FormBox } from '@mpieva/psydb-ui-lib';

const SafetyForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { sequenceNumber, _recordLabel } = fetched.record;

    var send = {};
    /*var send = useSendRemove({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });*/


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
    return (
        <div>success</div>
    )
}

export const RecordRemover = withRecordRemover({
    SafetyForm,
    SuccessInfo
});
