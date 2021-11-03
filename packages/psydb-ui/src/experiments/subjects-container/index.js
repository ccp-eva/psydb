import React, { useCallback, useMemo } from 'react';
import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

import SubjectTypeContainer from './subject-type-container';

const SubjectsContainer = ({
    experimentData,
    labProcedureSettingData,
    studyData,
    subjectDataByType,

    ActionsComponent,
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

                        ActionsComponent
                    })} />
                );
            })}
        </div>
    );
}

export default SubjectsContainer;
