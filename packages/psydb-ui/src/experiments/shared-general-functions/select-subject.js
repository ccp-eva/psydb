import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    WithDefaultModal,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

// TODO
export const SelectSubjectContainer = (ps) => {
    var translate = useUITranslation();
    var modal = useModalReducer();

    return (
        <>
            <Button
                size='sm'
                className='mr-3'
                onClick={ modal.handleShow }
            >
                { translate('Add Subject') }
            </Button>
            <SelectSubjectModal
                { ...modal.passthrough }
                { ...ps }
            />
        </>
    );
};

const SelectSubjectModalBody = (ps) => {
    var {
        onHide,
        experimentRecord,
    } = ps;

    var { _id: expId, state } = experimentRecord;
    var { studyId, selectedSubjectIds, interval } = state;

    return (
        <div>FOOOO</div>
    );
}

const SelectSubjectModal = WithDefaultModal({
    title: 'Add Subject',
    size: 'xl',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: SelectSubjectModalBody,
});

