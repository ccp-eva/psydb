import React from 'react';
import { Table } from 'react-bootstrap';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import formatInterval from '@mpieva/psydb-ui-lib/src/format-date-interval';
import { DetailsIconButton } from '@mpieva/psydb-ui-layout';
import PostprocessSubjectForm from '@mpieva/psydb-ui-lib/src/experiments/postprocess-subject-form';

const InhouseList = ({
    subjectType,

    records,
    relatedCustomRecordTypeLabels,
    relatedHelperSetItems,
    relatedRecordLabels,

    onSuccessfulUpdate
}) => {
    var permissions = usePermissions();
    var canReadSubjects = permissions.hasFlag('canReadSubjects');

    return (
        <Table>
            <thead>
                <tr>
                    <th>Proband</th>
                    <th>Datum</th>
                    <th>Studie</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                { records.map((experimentRecord, index) => (
                    <ExperimentSubjectItems { ...({
                        key: index,
                        
                        subjectType,
                        experimentRecord,
                        relatedRecordLabels,
                        
                        canReadSubjects,
                        onSuccessfulUpdate
                    })} />
                )) }
            </tbody>
        </Table>
    )
}

const ExperimentSubjectItems = ({
    subjectType,
    experimentRecord,
    relatedRecordLabels,
    
    canReadSubjects,
    onSuccessfulUpdate
}) => {
    var { subjectData } = experimentRecord.state;
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
                    <tr key={ index }>
                        <Cell>
                            { subjectLabel }
                            { canReadSubjects && (
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
                            experimentId: experimentRecord._id,
                            subjectId: it.subjectId,
                            onSuccessfulUpdate,
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
)

export default InhouseList;
