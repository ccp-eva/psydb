import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import LabMethodSettingsError from './lab-method-settings-error';
import Locations from './locations';

const LocationTypeRouting = (ps) => {
    var {
        customRecordTypes,
        studyRecord,
        teamRecords,
        settingRecords,
    } = ps;

    var translate = useUITranslation();
    var { path, url } = useRouteMatch();

    var firstSetting = settingRecords.find(it => (
        ['inhouse', 'online-video-call'].includes(it.type)
        && it.state.locations?.length > 0
    ));

    if (!firstSetting) {
        return (
            <LabMethodSettingsError
                studyRecord={ studyRecord }
                urlAffix='/experiment-settings'
            >
                { translate(
                    'No rooms for inhouse/video appointments set.'
                )}
            </LabMethodSettingsError>
        )
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

export default LocationTypeRouting;
