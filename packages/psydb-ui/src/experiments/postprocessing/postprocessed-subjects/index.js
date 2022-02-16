import React from 'react';
import { Alert } from '@mpieva/psydb-ui-layout';
import { withLabProcedureSettingsIterator } from '@mpieva/psydb-ui-lib';
import SubjectList from '../../subjects-container/subject-list';

const PostprocessedSubjects = withLabProcedureSettingsIterator({
    SubjectTypeContainer: (ps) => {
        var {
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
                <h5>
                    { subjectTypeLabel }
                </h5>
                <SubjectList { ...({
                    experimentRecord: experimentData.record,
                    records,
                    ...related,
                    ...pass
                }) } />
            </div>
        );
    }
})

export default PostprocessedSubjects;
