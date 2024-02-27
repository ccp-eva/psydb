import React from 'react';

import {
    format as formatDateInterval
} from '@mpieva/psydb-date-interval-fns';

import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    EditIconButtonInline,
    DetailsIconButton,
    ExperimentIconButton,
    SubjectIconButton,
    Alert,
    Table,
} from '@mpieva/psydb-ui-layout';

import { PostprocessSubjectForm } from '@mpieva/psydb-ui-lib';
import { DetailedPostprocessModal } from '@mpieva/psydb-ui-compositions';

const InhouseList = (ps) => {
    var {
        subjectType,

        records,
        relatedCustomRecordTypeLabels,
        relatedHelperSetItems,
        relatedRecordLabels,

        onSuccessfulUpdate
    } = ps;

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

const ExperimentSubjectItems = (ps) => {
    var {
        subjectType,
        experimentRecord,
        relatedRecordLabels,
        
        canReadSubjects,
        canWriteSubjects,
        subjectModal,
        onSuccessfulUpdate
    } = ps;

    var locale = useUILocale();
    var translate = useUITranslation();

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
    } = formatDateInterval(experimentRecord.state.interval, { locale });

    return (
        <>
            { subjectData.map((it, index) => {
                var subjectLabel = (
                    relatedRecordLabels
                    .subject[it.subjectId]._recordLabel
                );

                var onClickEdit = () => subjectModal.handleShow({
                    title: translate(
                        'Postprocessing (${subject} - ${study})',
                        {
                            subject: subjectLabel,
                            study: studyLabel
                        }
                    ),
                    subjectType,
                    subjectId: it.subjectId,
                    experimentRecord,
                    relatedRecordLabels,
                });

                return (
                    <tr key={ `${experimentRecord._id}_${it.subjectId}` }>
                        <Cell>
                            { subjectLabel }
                            { canWriteSubjects && (
                                <EditIconButtonInline
                                    onClick={ onClickEdit }
                                />
                            )}
                            { !canWriteSubjects && canReadSubjects && (
                                <SubjectIconButton
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
                            <ExperimentIconButton
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
    var translate = useUITranslation();
    return (
        <thead>
            <tr>
                <th>{ translate('Subject') }</th>
                <th>{ translate('Date') }</th>
                <th>{ translate('Study') }</th>
                <th>{ translate('Status') }</th>
            </tr>
        </thead>
    );
}

const Fallback = (ps) => {
    var translate = useUITranslation();
    return (
        <>
            <Table className='mb-1'>
                <TableHead />
            </Table>
            <Alert variant='info'>
                <i>{ translate('No unprocessed appointments found.') }</i>
            </Alert>
        </>
    )
}

export default InhouseList;
