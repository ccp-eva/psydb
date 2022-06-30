import React, { useState, useEffect, useReducer, useMemo } from 'react';

import {
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useModalReducer, useRevision } from '@mpieva/psydb-ui-hooks';

import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

import { CreateModal, DeleteModal } from './modals';

export const Locations = ({
    studyRecord,
    teamRecords,
    customRecordTypeData,
}) => {
    var { path, url } = useRouteMatch();
    var { studyId, studyType, locationRecordType } = useParams();
    var history = useHistory();

    var createModal = useModalReducer();
    var deleteModal = useModalReducer();
    var revision = useRevision();

    var onSelectLocationType = (nextType) => {
        history.push(`${up(url, 1)}/${nextType}`);
    }

    return (
        <>
            <CreateModal
                { ...createModal.passthrough }
                onSuccessfulUpdate={ revision.up }
            />

            <DeleteModal
                { ...deleteModal.passthrough }
                onSuccessfulUpdate={ revision.up }
            />

            <StudyInhouseLocations
                variant='reservation'
                studyId={ studyId }
                studyRecordType={ studyType }
                onSelectLocationType={ onSelectLocationType }

                activeLocationType={ locationRecordType }
                onSelectEmptySlot={ createModal.handleShow  }
                onSelectReservationSlot={ deleteModal.handleShow }
                calendarRevision={ revision.value }

                locationCalendarListClassName='bg-white'
            />

        </>
    );
}
