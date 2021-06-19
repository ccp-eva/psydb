import React, { useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import GeneralSubjectTypeSettings from './general-subject-type-settings';
import ConditionsByAgeFrame from './conditions-by-age-frame';
import AddSubjectTypeModal from './add-subject-type-modal';

const SelectionSettingsBySubjectType = ({
    record: studyRecord,
    settings,

    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,

    onSuccessfulUpdate,
}) => {
    var [ showModal, setShowModal ] = useState(false);
    var [
        handleShowModal,
        handleHideModal
    ] = useMemo(() => ([
        () => setShowModal(true),
        () => setShowModal(false),
    ]), []);

    return (
        <>
            { settings.length === 0 && (
                <div className='p-3 text-muted'>
                    <i>Keine Probandentypen vorhanden</i>
                </div>
            )}
            { settings.map((it, index) => (
                <div key={ it.subjectRecordType }>
                    { index !== 0 && (
                        <hr />
                    )}
                    <SubjectType { ...({
                        //key: it.subjectRecordType,

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
                </div>
            )) }
            <hr />
            <div className='mt-3'>
                <Button size='sm' onClick={ handleShowModal }>
                    + Probandentyp
                </Button>
                <AddSubjectTypeModal { ...({
                    show: showModal,
                    onHide: handleHideModal,
                    
                    existingSubjectTypeKeys: !settings.map(it => (
                        it.subjectRecordType
                    )),

                    studyRecord,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,

                    onSuccessfulUpdate,
                })} />
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
    subjectsPerExperiment,
    
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
                subjectsPerExperiment,

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
