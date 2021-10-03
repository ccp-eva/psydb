import React, { useCallback, useMemo } from 'react';
import createSend from '@mpieva/psydb-ui-lib/src/use-send';
import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

import SubjectTypeContainer from './subject-type-container';

const Subjects = ({
    experimentData,
    studyData,
    subjectDataByType,

    ActionsComponent,
}) => {
    var { selectionSettingsBySubjectType } = studyData.record.state;
    var stringifyStudyValue = createStringifier(studyData);

    return (
        <div className='p-3'>
            { selectionSettingsBySubjectType.map((it, index) => {
                var {
                    subjectRecordType,
                    subjectsPerExperiment
                } = it;
                
                var subjectTypeLabel = stringifyStudyValue({
                    ptr: `/state/selectionSettingsBySubjectType/${index}/subjectRecordType`,
                    collection: 'subject',
                    type: 'CustomRecordTypeKey',
                });

                var fullSubjectData = subjectDataByType[subjectRecordType];
                if (fullSubjectData.records.length < 1) {
                    return null;
                }
                
                return (
                    <SubjectTypeContainer { ...({
                        key: subjectRecordType,
                        
                        subjectTypeKey: subjectRecordType,
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

export default Subjects;
