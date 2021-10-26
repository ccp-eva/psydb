import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

//import { LocationList } from './location-list';
import LocationTypeContainer from './location-type-container';

export const LocationTypeRouting = ({
    customRecordTypes,
    studyRecord,
    teamRecords,
}) => {
    var { path, url } = useRouteMatch();
    var { inhouseTestLocationSettings } = studyRecord.state;
   
    if (inhouseTestLocationSettings.length < 1) {
        return (
            <div>no locations available</div>
        )
    }

    var { customRecordType } = inhouseTestLocationSettings[0];

    return (
        <div className='border p-2 border-top-0'>
            <Switch> 
                <Route exact path={ path }>
                    <Redirect to={`${url}/${customRecordType}`} />
                </Route>
                <Route path={ `${path}/:locationRecordType`}>
                    <LocationTypeContainer
                        studyRecord={ studyRecord }
                        teamRecords={ teamRecords }
                        customRecordTypeData={ customRecordTypes }
                    />
                </Route>
            </Switch>
        </div>
    );
}
