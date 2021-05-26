import React, { useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import EditIconButton from '@mpieva/psydb-ui-lib/src/edit-icon-button';
import stringifyFieldValue from '@mpieva/psydb-ui-lib/src/stringify-field-value';

import ConditionsByAgeFrameModal from './conditions-by-age-frame-modal';

const ConditionsByAgeFrame = ({
    subjectRecordType,
    conditionsByAgeFrame, 

    studyRecord,
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
            { conditionsByAgeFrame.map((it, index) => (
                <AgeFrameContainer { ...({
                    key: index,
                    ...it,
                    
                    subjectRecordType,
                    studyRecord,
                    subjectTypeData,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                    
                    onSuccessfulUpdate,
                }) } />
            ))}
            <div className='mt-2 d-flex justify-content-end'>
                <Button size='sm' onClick={ handleShowModal }>
                    + Altersfenster
                </Button>
                <ConditionsByAgeFrameModal { ...({
                    type: 'create',
                    show: showModal,
                    onHide: handleHideModal,

                    subjectRecordType,
                    subjectTypeData,
                    studyRecord,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
    
                    onSuccessfulUpdate,
                }) } />
            </div>
        </>
    );
}

const AgeFrameContainer = ({
    ageFrame,
    conditions,

    subjectRecordType,
    studyRecord,
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

    var stringifiedAgeFrame = stringifyFieldValue({
        rawValue: ageFrame,
        fieldDefinition: { type: 'AgeFrame' }
    });

    return (
        <div className='bg-white border mb-2 position-relative'>
            <div className='p-3 d-flex'>
                <div style={{ width: '33%' }}>
                    <b className='d-block'>Altersfenster</b>
                    { stringifiedAgeFrame }
                </div>
                <div className='flex-grow'>
                    <b className='d-block'>Bedingungen</b>
                    <div>
                        { conditions.map((it, index) => (
                            <Condition { ...({
                                key: index,
                                ...it,
                        
                                subjectRecordType,
                                studyRecord,
                                subjectTypeData,
                                relatedRecordLabels,
                                relatedHelperSetItems,
                                relatedCustomRecordTypeLabels,
                            }) } />
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', top: '-1px', right: '-1px'}}>
                <EditIconButton
                    onClick={ handleShowModal }
                />
                <ConditionsByAgeFrameModal { ...({
                    type: 'edit',
                    show: showModal,
                    onHide: handleHideModal,

                    ageFrame,
                    conditions,

                    subjectRecordType,
                    subjectTypeData,
                    studyRecord,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                    
                    onSuccessfulUpdate,
                }) } />
            </div>
        </div>
    );
}

const Condition = ({
    fieldKey,
    values,

    subjectRecordType,
    studyRecord,
    subjectTypeData,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {
    
    var fieldDefinition = (
        subjectTypeData.state.settings.subChannelFields.scientific
        .find(it => it.key === fieldKey )
    );

    // FIXME: this is lab-operation/../selection-settings-form-schema.js
    var realType = fieldDefinition.type;
    // FIXME: maybe we can just cut the "List" suffix via regex
    if (fieldDefinition.type === 'HelperSetItemIdList') {
        realType = 'HelperSetItemId';
    }
    if (fieldDefinition.type === 'ForeignIdList') {
        realType = 'ForeignId';
    }

    return (
        <div className='d-flex'>
            <div style={{ width: '20%' }}>
                { fieldDefinition.displayName }:
            </div>
            <div className='flex-grow'>
                { values.map(rawValue => stringifyFieldValue({
                    rawValue,
                    fieldDefinition: {
                        ...fieldDefinition,
                        type: realType
                    },
                    
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                })).join(', ') }
            </div>
        </div>
    );
}

export default ConditionsByAgeFrame;
