import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { BigNav } from '@mpieva/psydb-ui-layout';

const IndexNav = (ps) => {
    var {
        canViewReception,
        canViewInhouse,
        canViewAwayTeam,
        canViewVideo
    } = ps;
    
    var translate = useUITranslation();
    var { url: baseUrl } = useRouteMatch();

    var navItems = [
        (canViewReception && { 
            label: translate('Reception'),
            linkUrl: `${baseUrl}/reception`,
        }),
        (canViewInhouse && { 
            label: translate('Inhouse Appointments'),
            linkUrl: `${baseUrl}/inhouse`,
        }),
        (canViewAwayTeam && {
            label: translate('External Appointments'),
            linkUrl: `${baseUrl}/away-team`,
        }),
        (canViewVideo && {
            label: translate('Video Appointments'),
            linkUrl: `${baseUrl}/online-video-call`,
        }),
    ].filter(it => !!it)

    return (
        <BigNav items={ navItems } />
    )
}

export default IndexNav;
