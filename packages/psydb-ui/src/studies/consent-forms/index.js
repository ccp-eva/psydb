import React from 'react';

import {
    Route,
    Switch,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

const StudyConsentFormRouting = (ps) => {
    var { studyId } = ps;
    var { path, url } = useRouteMatch();
    var history =  useHistory();

    return (
        <Switch>
            <Route exact path={ path }>
                <List studyId={ studyId } />
            </Route>
            <Route path={ `${path}/new` }>
                <RecordCreator studyId={ studyId} />
            </Route>
        </Switch>
    )
}

export default StudyConsentFormRouting;
