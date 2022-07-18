import React from 'react';
import jsonpointer from 'jsonpointer';

import {
    findCRTAgeFrameField,
    calculateAge,
} from '@mpieva/psydb-common-lib';

import {
    useFetch,
    useReadRecord,
    useModalReducer
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    WithDefaultModal,
    LoadingIndicator,
} from '@mpieva/psydb-ui-layout';

import { datefns } from '@mpieva/psydb-ui-lib';

const SelectSubjectContainer = (ps) => {
    var { className, ...pass } = ps;
    var modal = useModalReducer();
    return (
        <>
            <Button
                className={ className }
                onClick={ modal.handleShow }
            >
                in Termin entragen
            </Button>
            <SelectSubjectModal
                { ...modal.passthrough }
                { ...pass }
            />
        </>
    );
};

const SelectSubjectModalBody = (ps) => {
    var {
        onHide,
        subjectId,
        subjectType,
    } = ps;

    var [ didFetch, fetched ] = useReadRecord({
        collection: 'subject',
        id: subjectId,
        recordType: subjectType,
        shouldFetchSchema: false,
    });

    if (!didFetch) {
        return <LoadingIndicator />
    }

    var { record, related, crtSettings } = fetched;
    var ageField = findCRTAgeFrameField(crtSettings, { as: 'definition' });
    console.log(ageField);


    return (
        <div className='mt-3'>
            <div>
                <b>Proband:in:</b> { record._recordLabel }
                {' '}
                <b>{ ageField.displayName }:</b>
                {' '}
                { datefns.format(
                    new Date(jsonpointer.get(record, ageField.pointer)),
                    'dd.MM.yyyy'
                )}
                {' '}
                <b>Alter:</b>
                {' '}
                { calculateAge({
                    base: jsonpointer.get(record, ageField.pointer),
                    relativeTo: new Date()
                })}
            </div>
            <div>
                <SelectableStudies
                    subjectId={ subjectId }
                    onSelect=''
                />
            </div>
        </div>
    );
}

const SelectableStudies = (ps) => {
    var { subjectId, onSelect, onSuccessfulUpdate } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/search-studies-testable-for-subject', {
            subjectId
        })
    ), [ subjectId ]);

    return (
        <div>FOO</div>
    )
}

const SelectSubjectModal = WithDefaultModal({
    title: 'Proband:in hinzufügen',
    size: 'xl',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: SelectSubjectModalBody,
});


export default SelectSubjectContainer;
