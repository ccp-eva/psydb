import React from 'react';
import { Button } from 'react-bootstrap';
import GeneralSubjectTypeSettings from './general-subject-type-settings';
import ConditionsByAgeFrame from './conditions-by-age-frame';

const SelectionSettingsBySubjectType = ({
    record: studyRecord,
    settings,

    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,

    onSuccessfulUpdate,
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

                    studyRecord,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                    
                    onSuccessfulUpdate,
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
    
    studyRecord,
    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    
    onSuccessfulUpdate,
}) => {
    return (
        <div>
            <h5 className='border-bottom mb-2'>Probandentyp: { 
                relatedCustomRecordTypeLabels
                .subject[subjectRecordType].state.label
            }</h5>
            
            <GeneralSubjectTypeSettings { ...({
                subjectRecordType,
                externalLocationGrouping,
                enableOnlineTesting,

                studyRecord,
                subjectTypeData,
    
                onSuccessfulUpdate,
            }) } />

            <div className=''>
                <header><b>Altersfenster-Einstellungen</b></header>
                <ConditionsByAgeFrame { ...({
                    subjectRecordType,
                    conditionsByAgeFrame, 
                    
                    studyRecord,
                    subjectTypeData,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
    
                    onSuccessfulUpdate,
                }) } />
            </div>
        </div>
    )
}

export default SelectionSettingsBySubjectType;
