import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Alert, SubjectIconButton } from '@mpieva/psydb-ui-layout';
import { withLabProcedureSettingsIterator } from '@mpieva/psydb-ui-lib';
import SubjectList from '../../subjects-container/subject-list';

const PostprocessedSubjects = withLabProcedureSettingsIterator({
    SubjectTypeContainer: (ps) => {
        var {
            isMultiTypeExperiment,

            subjectTypeKey,
            subjectTypeLabel,
            subjectsPerExperiment,

            experimentData,
            subjectDataByType,

            ...pass
        } = ps;

        var fullSubjectData = subjectDataByType[subjectTypeKey];
        if (fullSubjectData.records.length < 1) {
            return null;
        }

        var unprocessedSubjects = (
            experimentData.record.state.subjectData.filter(it => (
                it.participationStatus !== 'unknown'
            ))
        );
        if (unprocessedSubjects.length < 1) {
            return (
                <Alert variant='info'>
                    <i>Bisher keine Probanden nachbereitet</i>
                </Alert>
            );
        }

        var {
            records,
            ...related
        } = fullSubjectData;

        var processedIds = (
            experimentData.record.state.subjectData
            .filter(it => it.participationStatus !== 'unknown')
            .map(it => it.subjectId)
        );
        records = records.filter(it => processedIds.includes(it._id));

        return (
            <div>
                { isMultiTypeExperiment && (
                    <h5>{ subjectTypeLabel }</h5>
                )}
                <SubjectList { ...({
                    experimentRecord: experimentData.record,
                    records,
                    ...related,
                    ...pass,
                    ActionsComponent
                }) } />
            </div>
        );
    }
})

const ActionsComponent = ({
    experimentSubjectData,
    subjectRecord,

    hasContactIssue,
    isUnparticipated,
}) => {
    var permissions = usePermissions();
    return (
        <div className='d-flex justify-content-end'>
            { permissions.hasFlag('canReadSubjects') && (
                <SubjectIconButton
                    to={`/subjects/${subjectRecord.type}/${subjectRecord._id}`}
                />
            )}
        </div>
    )
}
export default PostprocessedSubjects;
