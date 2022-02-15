import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { Alert, Icons } from '@mpieva/psydb-ui-layout';
import { Locations } from './locations';

export const LocationTypeRouting = ({
    customRecordTypes,
    studyRecord,
    teamRecords,
    settingRecords,
}) => {
    var { path, url } = useRouteMatch();

    var firstSetting = settingRecords.find(it => (
        ['inhouse', 'online-video-call'].includes(it.type)
        && it.state.locations?.length > 0
    ));

    if (!firstSetting) {
        return <NoLocationsFallback studyRecord={ studyRecord } />
    }

    var firstLocationType = (
        firstSetting.state.locations[0].customRecordTypeKey
    );

    return (
        <div className='border p-2 border-top-0'>
            <Switch> 
                <Route exact path={ path }>
                    <Redirect to={`${url}/${firstLocationType}`} />
                </Route>
                <Route path={ `${path}/:locationRecordType`}>
                    <Locations
                        studyRecord={ studyRecord }
                        teamRecords={ teamRecords }
                        customRecordTypeData={ customRecordTypes }
                    />
                </Route>
            </Switch>
        </div>
    );
}

const NoLocationsFallback = (ps) => {
    var { studyRecord } = ps;
    var { _id: studyId, type: studyType } = studyRecord;
    return (
        <Alert variant='danger' className='mt-3'>
            Keine Räumlichkeiten für Interne/Online-Video-Termine festgelegt.
            {' '}
            <a 
                className='text-reset'
                href={`#/studies/${studyType}/${studyId}/experiment-settings`}
            >
                <b>Zu den Studien-Einstellungen</b>
                {' '}
                <Icons.ArrowRightShort style={{
                    height: '20px',
                    width: '20px', marginTop: '-4px'
                }} />
            </a>
        </Alert>
    );
}
