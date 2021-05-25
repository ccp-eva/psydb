import React from 'react';

const SelectionSettingsBySubjectType = ({
    record,
    settings,

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
    
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {
    return (
        <div>
            { subjectRecordType }
        </div>
    )
}

export default SelectionSettingsBySubjectType;
