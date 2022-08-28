import React from 'react';
import { useFetch, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    WithDefaultModal,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

export const SelectSubjectContainer = (ps) => {
    var modal = useModalReducer();
    return (
        <>
            <Button
                size='sm'
                className='mr-3'
                onClick={ modal.handleShow }
            >
                Proband:in hinzufügen
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
    title: 'Proband:in hinzufügen',
    size: 'xl',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: SelectSubjectModalBody,
});

