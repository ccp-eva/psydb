import React, { useCallback, useMemo } from 'react';
import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

import SubjectTypeContainer from './subject-type-container';

const PostprocessableSubjects = ({
    experimentData,
    labProcedureSettingData,
    studyData,
    subjectDataByType,
    onSuccessfulUpdate,
}) => {
    var {
        records: settingRecords,
        ...settingRelated
    } = labProcedureSettingData;

    return (
        <div className='p-3'>
            { settingRecords.map((it, index) => {
                var {
                    subjectTypeKey,
                    subjectsPerExperiment,
                } = it.state;

                var subjectTypeLabel = (
                    settingRelated.relatedCustomRecordTypes
                    .subject[subjectTypeKey].state.label
                );
                
                var fullSubjectData = subjectDataByType[subjectTypeKey];
                if (fullSubjectData.records.length < 1) {
                    return null;
                }
                
                return (
                    <SubjectTypeContainer { ...({
                        key: subjectTypeKey,
                        
                        subjectTypeKey,
                        subjectTypeLabel,
                        subjectsPerExperiment,

                        experimentData,
                        fullSubjectData,

                        onSuccessfulUpdate
                    })} />
                );
            })}
        </div>
    );
}

export default PostprocessableSubjects;
