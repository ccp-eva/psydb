import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { BigNav } from '@mpieva/psydb-ui-layout';

const IndexNav = (ps) => {
    var {
        canWriteReservations,
        canSelectSubjects,
        canConfirmInvitations,
        canPostprocess,
    } = ps;
    
    var translate = useUITranslation();
    var { url } = useRouteMatch();
    var { studyType } = useParams();
    
    var baseUrl = up(url, 2);

    var navItems = [
        (canWriteReservations && { 
            label: translate('Reservation'),
            linkUrl: `${baseUrl}/reservation/${studyType}`,
        }),
        (canSelectSubjects && {
            label: translate('Subject Selection'),
            linkUrl: `${baseUrl}/subject-selection/${studyType}`,
        }),
        (canConfirmInvitations && {
            label: translate('Confirm Appointments'),
            linkUrl: `${baseUrl}/invite-confirmation/${studyType}`,
        }),
        (canPostprocess && {
            label: translate('Postprocessing'),
            linkUrl: `${baseUrl}/experiment-postprocessing/${studyType}`,
        }),
    ].filter(it => !!it)

    return (
        <BigNav items={ navItems } />
    )
}

export default IndexNav;
