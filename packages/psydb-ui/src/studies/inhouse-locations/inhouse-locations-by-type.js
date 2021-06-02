import React, { useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import EditIconButton from '@mpieva/psydb-ui-lib/src/edit-icon-button';
import AddLocationTypeModal from './add-location-type-modal';
import EditEnabledLocationsModal from './edit-enabled-locations-modal';

const InhouseLocationsByType = ({
    record: studyRecord,
    settings,

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
                    <i>Keine Location-Typen vorhanden</i>
                </div>
            )}
            { settings.map(it => (
                <LocationType { ...({
                    key: it.customRecordType,

                    ...it,

                    studyRecord,
                    relatedRecordLabels,
                    relatedHelperSetItems,
                    relatedCustomRecordTypeLabels,
                    
                    onSuccessfulUpdate,
                }) } />
            )) }
            <hr />
            <div className='mt-3'>
                <Button size='sm' onClick={ handleShowModal }>
                    + Location-Typ
                </Button>
                <AddLocationTypeModal { ...({
                    show: showModal,
                    onHide: handleHideModal,
                    
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

const LocationType = ({
    customRecordType,
    enabledLocationIds,
    
    studyRecord,
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
            <header><b>Location-Typ {
                relatedCustomRecordTypeLabels
                .location[customRecordType].state.label
            }</b></header>
            <div className='bg-white border mb-2 p-3 position-relative'>
                <ul className='mb-0'>
                    { enabledLocationIds.map(it => (
                        <li key={ it }>
                            { relatedRecordLabels.location[it]._recordLabel }
                        </li>
                    ))}
                </ul>
                <div style={{ position: 'absolute', top: '-1px', right: '-1px'}}>
                    <EditIconButton
                        onClick={ handleShowModal }
                    />
                    <EditEnabledLocationsModal { ...({
                        show: showModal,
                        onHide: handleHideModal,

                        locationType: customRecordType,
                        enabledLocationIds,

                        studyRecord,
                        relatedRecordLabels,
                        relatedHelperSetItems,
                        relatedCustomRecordTypeLabels,
                    }) } />
                </div>
            </div>
        </>
    )
}

export default InhouseLocationsByType;
