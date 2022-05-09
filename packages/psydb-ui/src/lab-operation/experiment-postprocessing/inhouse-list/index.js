import React from 'react';
import { Table } from 'react-bootstrap';
import { usePermissions, useModalReducer } from '@mpieva/psydb-ui-hooks';

import formatInterval from '@mpieva/psydb-ui-lib/src/format-date-interval';
import {
    EditIconButtonInline,
    DetailsIconButton,
    Alert,
} from '@mpieva/psydb-ui-layout';

import PostprocessSubjectForm from '@mpieva/psydb-ui-lib/src/experiments/postprocess-subject-form';

import { DetailedPostprocessModal } from '@mpieva/psydb-ui-compositions';

const InhouseList = ({
    subjectType,

    records,
    relatedCustomRecordTypeLabels,
    relatedHelperSetItems,
    relatedRecordLabels,

    onSuccessfulUpdate
}) => {
    var subjectModal = useModalReducer();

    var permissions = usePermissions();
    var canReadSubjects = permissions.hasFlag('canReadSubjects');
    var canWriteSubjects = permissions.hasFlag('canWriteSubjects');

    if (records.length < 1) {
        return <Fallback />
    }

    return (
        <>
            <DetailedPostprocessModal
                { ...subjectModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <Table>
                <TableHead />
                <tbody>
                    { records.map((experimentRecord, index) => (
                        <ExperimentSubjectItems { ...({
                            key: index,
                            
                            subjectType,
                            experimentRecord,
                            relatedRecordLabels,
                            
                            canReadSubjects,
                            canWriteSubjects,
                            subjectModal,
                            onSuccessfulUpdate
                        })} />
                    )) }
                </tbody>
            </Table>
        </>
    )
}

const ExperimentSubjectItems = ({
    subjectType,
    experimentRecord,
    relatedRecordLabels,
    
    canReadSubjects,
    canWriteSubjects,
    subjectModal,
    onSuccessfulUpdate
}) => {
    var { _enableFollowUpExperiments, state } = experimentRecord;
    var { subjectData } = state;
    subjectData = subjectData.filter(it => (
        it.subjectType === subjectType && it.participationStatus === 'unknown'
    ))
    var studyLabel = (
        relatedRecordLabels
        .study[experimentRecord.state.studyId]._recordLabel
    );

    var {
        startDate,
        startTime,
        endTime
    } = formatInterval(experimentRecord.state.interval);

    return (
        <>
            { subjectData.map((it, index) => {
                var subjectLabel = (
                    relatedRecordLabels
                    .subject[it.subjectId]._recordLabel
                );
                return (
                    <tr key={ `${experimentRecord._id}_${it.subjectId}` }>
                        <Cell>
                            { subjectLabel }
                            { canWriteSubjects && (
                                <EditIconButtonInline onClick={ () => (
                                    subjectModal.handleShow({
                                        title: `Nachbereitung (${subjectLabel} - ${studyLabel})`,
                                        subjectType,
                                        subjectId: it.subjectId,
                                        experimentRecord,
                                        relatedRecordLabels,
                                    })
                                )} />
                            )}
                            { !canWriteSubjects && canReadSubjects && (
                                <DetailsIconButton
                                    to={`/subjects/${subjectType}/${it.subjectId}`}
                                    target='_blank'
                                />
                            )}
                        </Cell>
                        <Cell>
                            { startDate }
                            {' '}
                            { startTime }
                            {' - '}
                            { endTime }
                            {' '}
                            <DetailsIconButton
                                to={`/experiments/${experimentRecord.type}/${experimentRecord._id}`}
                                target='_blank'
                            />
                        </Cell>
                        <Cell>{ studyLabel }</Cell>
                        <Cell>
                        <PostprocessSubjectForm { ...({
                            subjectLabel,
                            experimentId: experimentRecord._id,
                            subjectId: it.subjectId,
                            onSuccessfulUpdate,
                            enableFollowUpExperiments: (
                                _enableFollowUpExperiments
                            )
                        }) } />
                        </Cell>
                    </tr>
                );
            })}
        </>
    );
}

const Cell = ({ children }) => (
    <td style={{ verticalAlign: 'middle' }}>
        { children }
    </td>
);

const TableHead = (ps) => {
    return (
        <thead>
            <tr>
                <th>Proband:in</th>
                <th>Datum</th>
                <th>Studie</th>
                <th>Status</th>
            </tr>
        </thead>
    );
}

const Fallback = (ps) => {
    return (
        <>
            <Table className='mb-1'>
                <TableHead />
            </Table>
            <Alert variant='info'>
                <i>Keine offenen Nachbereitungen gefunden</i>
            </Alert>
        </>
    )
}

export default InhouseList;
