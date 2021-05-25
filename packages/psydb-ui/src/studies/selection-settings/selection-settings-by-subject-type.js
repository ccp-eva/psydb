import React from 'react';
import ConditionsByAgeFrame from './conditions-by-age-frame';

const SelectionSettingsBySubjectType = ({
    record,
    settings,

    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {
    return (
        <>
            { settings.map(it => (
                <SubjectType { ...({
                    key: it.subjectRecordType,

                    ...it,
                    subjectTypeData: subjectTypeData.find(td => (
                        td.type === it.subjectRecordType
                    )),
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                }) } />
            )) }
        </>
    )
}

const SubjectType = ({
    subjectRecordType,
    generalConditions,
    conditionsByAgeFrame,
    externalLocationGrouping,
    enableOnlineTesting,
    
    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {
    console.log(conditionsByAgeFrame)
    return (
        <div>
            { 
                relatedCustomRecordTypeLabels
                .subject[subjectRecordType].state.label
            }
            <ConditionsByAgeFrame { ...({
                conditionsByAgeFrame, 
                
                subjectTypeData,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
            }) } />
        </div>
    )
}

export default SelectionSettingsBySubjectType;
