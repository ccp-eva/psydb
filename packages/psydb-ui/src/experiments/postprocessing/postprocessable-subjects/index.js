import React from 'react';
import { withLabProcedureSettingsIterator } from '@mpieva/psydb-ui-lib';
import SubjectTypeContainer from './subject-type-container';

// NOTE: its an idea but im not a fan yet
//const Foo = (ps) => {
//    var { labProcedureSettingsData, ...pass } = ps;
//    var bag = { labProcedureSettingsData };
//    return (
//        <LabProcedureSettings { ...bag }>
//            {(item) => {
//                var {
//                    subjectTypeKey,
//                    subjectTypeLabel,
//                    subjectsPerExperiment,
//                } = item;
//
//                var {
//                    experimentData,
//                    subjectDataByType,
//                    onSuccessfulUpdate,
//                } = pass;
//                
//                var fullSubjectData = subjectDataByType[subjectTypeKey];
//                if (fullSubjectData.records.length < 1) {
//                    return null;
//                }
//            }}
//        </LabProcedureSettings>
//    )
//}

// NOTE:
//var composed = withComponentComposition({
//    composition: [
//        (c) => withTable({ Body: c, Header }),
//        (c) => withTableBody({ Row: c }),
//        (c) => withLabProcedureSettingsIterator({ SubjectTypeContainer: c })
//    ],
//    Component: (ps) => {}
//});

const PostprocessableSubjects = withLabProcedureSettingsIterator({
    SubjectTypeContainer: (ps) => {
        var {
            subjectTypeKey,
            subjectTypeLabel,
            subjectsPerExperiment,

            subjectDataByType,
            ...pass
        } = ps;

        var fullSubjectData = subjectDataByType[subjectTypeKey];
        if (fullSubjectData.records.length < 1) {
            return null;
        }
                
        return (
            <SubjectTypeContainer { ...({
                subjectTypeKey,
                subjectTypeLabel,
                subjectsPerExperiment,

                fullSubjectData,
                ...pass
            })} />
        );
    }
})

export default PostprocessableSubjects;
