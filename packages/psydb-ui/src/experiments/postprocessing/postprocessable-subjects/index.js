import React, { useCallback, useMemo } from 'react';
import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

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

            experimentData,
            subjectDataByType,
            onSuccessfulUpdate,
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

                experimentData,
                fullSubjectData,

                onSuccessfulUpdate
            })} />
        );
    }
})

export default PostprocessableSubjects;
