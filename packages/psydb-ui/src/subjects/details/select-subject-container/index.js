import React, { useState } from 'react';
import { useHistory } from 'react-router';
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
    SplitPartitioned,
    PillNav,
    Alert,
} from '@mpieva/psydb-ui-layout';

import { datefns } from '@mpieva/psydb-ui-lib';
import * as intervalfns from '@mpieva/psydb-date-interval-fns';


import SubjectSummary from './subject-summary';
import IntervalForm from './interval-form';
import SelectableStudies from './selectable-studies';
import SelectableProcedures from './selectable-procedures';
import Schedule from './schedule';

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

    var now = new Date();
    var history = useHistory();
    var [ selectedStudy, setSelectedStudy ] = useState();
    var [ desiredTestInterval, setDesiredTestInterval ] = useState(
        intervalfns.add({ start: now, end: now }, { end: { months: 1 }})
    );
    
    var [ selectedProcedure, setSelectedProcedure ] = useState();

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

    return (
        <div className='mt-3'>
            <SubjectSummary { ...fetched } />
            <div className='p-3 border bg-white'>

                <IntervalForm
                    initialValues={ desiredTestInterval }
                    onSubmit={ (formData) => {
                        setSelectedProcedure();
                        setSelectedStudy();
                        setDesiredTestInterval(formData);
                    }}
                />

                <hr />

                <SelectableStudies
                    subjectId={ subjectId }
                    desiredTestInterval={ desiredTestInterval }
                    selectedStudy={ selectedStudy }
                    onSelect={ setSelectedStudy }
                />

                <hr />
                
                <SelectableProcedures
                    selectedStudy={ selectedStudy }
                    selectedProcedure={ selectedProcedure }
                    onSelect={ setSelectedProcedure }
                />
               
                { selectedStudy && (
                    <hr />
                )}

                <Schedule
                    subjectRecord={ record }
                    selectedStudy={ selectedStudy }
                    inviteType={ selectedProcedure }
                    subjectType={ record.type }
                    onSuccessfulUpdate={ (shouldHide, response) => {
                        var experimentId = response.data.data.find(it => (
                            it.collectionName === 'experiment'
                        )).channelId;
                        history.push(`/experiments/${selectedProcedure}/${experimentId}`)
                    }}
                />
            </div>
        </div>
    );
}



const SelectSubjectModal = WithDefaultModal({
    title: 'Termin für Proband:in',
    size: 'xl',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: SelectSubjectModalBody,
});


export default SelectSubjectContainer;
