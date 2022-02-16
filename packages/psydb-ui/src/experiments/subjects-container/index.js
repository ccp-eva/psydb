import React, { useCallback, useMemo } from 'react';
import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

import { withLabProcedureSettingsIterator } from '@mpieva/psydb-ui-lib';
import SubjectTypeContainer from './subject-type-container';

const SubjectsContainer = withLabProcedureSettingsIterator({
    SubjectTypeContainer: (ps) => {
        var {
            subjectTypeKey,
            subjectTypeLabel,
            subjectsPerExperiment,

            experimentData,
            subjectDataByType,
            
            ActionsComponent,
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

                ActionsComponent
            })} />
        );
    }
});

export default SubjectsContainer;
