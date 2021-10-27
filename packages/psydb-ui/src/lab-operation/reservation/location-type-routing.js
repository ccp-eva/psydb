import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

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
        && it.state.locations.length > 0
    ));

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
