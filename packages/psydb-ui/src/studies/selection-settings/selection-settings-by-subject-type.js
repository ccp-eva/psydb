import React from 'react';
import { Button } from 'react-bootstrap';
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
            <hr />
            <div className='mt-3'>
                <Button size='sm'>
                    + Probandentyp
                </Button>
            </div>
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
            <h5 className='border-bottom mb-2'>Probandentyp: { 
                relatedCustomRecordTypeLabels
                .subject[subjectRecordType].state.label
            }</h5>
            <div className=''>
                <ConditionsByAgeFrame { ...({
                    conditionsByAgeFrame, 
                    
                    subjectTypeData,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                }) } />
            </div>
        </div>
    )
}

export default SelectionSettingsBySubjectType;
