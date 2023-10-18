import React  from 'react';
import { sliceDays } from '@mpieva/psydb-date-interval-fns';
import { compareIds, groupBy } from '@mpieva/psydb-core-utils';

import {
    Button,
    WithDefaultModal,
    LoadingIndicator,
    Container,
    Pair,
    LinkButton,
} from '@mpieva/psydb-ui-layout';

import {
    useSend,
    useFetchChain,
    useSelectionReducer
} from '@mpieva/psydb-ui-hooks';

import datefns from '../../date-fns';
import {
    default as LocationTimeSlotList
} from '../../study-inhouse-locations/location-time-table/time-slot-list';

const ChangeInviteLocationModalBody = (ps) => {
    var {
        onHide,
        experimentId,
        experimentStart,
        experimentEnd,
        studyId,
        currentLocationId,
        onSuccessfulUpdate
    } = ps;

    var selection = useSelectionReducer();

    var [ didFetch, fetched ] = useFetchChain(() => ([
        ({ agent }) => ({
            labSettings: agent.fetchExperimentVariantSettings({
                studyId,
            })
        }),
        ({ agent, context }) => ({
            timetable: agent.fetchReservableLocationTimeTable({
                locationIds: (
                    context.labSettings.data.records
                    .filter(it => ['inhouse', 'online-video-call'].includes(it.type))
                    .reduce((acc, s) => ([
                        ...acc,
                        ...s.state.locations.map(l => l.locationId)
                    ]), [])
                ),
                start: experimentStart,
                end: experimentEnd,
                //showPast: true, // FIXME
            })
        })
    ]), [ studyId, experimentStart, experimentEnd ]);

    var { exec: handleSubmit } = useSend((formData) => ({
        type: `experiment/change-location`,
        payload: {
            experimentId,
            locationId: selection.value[0],
            // forceOverrideReservation // XXX ???
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] })

    if (!didFetch) {
        return <LoadingIndicator size='lg' />;
    }

    var {
        labSettings,
        timetable
    } = fetched._stageDatas;

    var locationIds = (
        labSettings.records
        .filter(it => ['inhouse', 'online-video-call'].includes(it.type))
        .reduce((acc, s) => ([
            ...acc,
            ...s.state.locations.map(l => l.locationId)
        ]), [])
        .filter(it => !compareIds(it, currentLocationId))
    );

    var reservationRecordsByLocation = groupBy({
        items: timetable.reservationRecords,
        byPointer: '/state/locationId'
    });

    var experimentRecordsByLocation = groupBy({
        items: timetable.experimentRecords,
        byPointer: '/state/locationId'
    });

    var t = new Date(experimentStart);
    var day = {
        start: datefns.startOfDay(t),
        end: datefns.startOfDay(t),
    };
    var startTimeInt = (
        new Date(experimentStart).getTime() - day.start.getTime()
    );
    var endTimeInt = (
        new Date(experimentEnd).getTime() - day.start.getTime()
    );

    return (
        <div className='mt-3'>
            <div className='bg-white px-3 py-2 border'>
                <header className='pb-1 border-bottom mb-2'>
                    <b>Neuen Raum wählen</b>
                </header>
                { (locationIds.length < 1) && (
                    <i className='text-muted'>
                        Keine Weiteren Räume gefunden
                    </i>
                )}
                <div className='d-flex'>
                    { locationIds.map((it, ix) => (
                        <div className='ml-3' key={ ix }>
                            <header className={ 'text-center border-bottom bg-light px-3' }>
                                <b>{ labSettings.relatedRecords.location[it]._recordLabel }</b>
                                <div>Uhrzeit</div>
                            </header>
                            <LocationTimeSlotList { ...({
                                locationRecord: { _id: it },

                                reservationRecords: reservationRecordsByLocation[it] || [],
                                experimentRecords: experimentRecordsByLocation[it] || [],
                                teamRecords: timetable.labTeamRecords,
                                settingRecords: timetable.labSettingsRecords,
                                
                                day,
                                startTimeInt,
                                endTimeInt,
                                slotDuration: 15 * 60 * 1000, // XXX
                                showPast: true,
                                showHeader: false,
                            }) } />

                            <Button
                                className='d-block'
                                onClick={ () => selection.set(it) }
                                variant={
                                    selection.value.includes(it)
                                    ? 'primary'
                                    : 'outline-primary'
                                }
                                block
                                disabled={[
                                    ...(reservationRecordsByLocation[it] || []),
                                    ...(experimentRecordsByLocation[it] || []),
                                ].length > 0}
                            >
                                Wählen
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button
                    onClick={ handleSubmit }
                    variant='primary'
                    disabled={ selection.value.length !== 1 }
                >
                    Speichern
                </Button>
            </div>
        </div>
    )
}

const ChangeInviteLocationModal = WithDefaultModal({
    title: 'Change Room',
    size: 'lg',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: ChangeInviteLocationModalBody,
});

export default ChangeInviteLocationModal;
