import React, { useState, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import RecordListContainer from '@mpieva/psydb-ui-lib/src/record-list-container';

import StudySelect from './study-select';
import SubjectTypeSelect from './subject-type-select';
import SearchContainer from './search-container';

const SubjectSelectionRouting = () => {
    var { path, url } = useRouteMatch();
    var { studyType } = useParams();

    return (
        <div>
            <div>have tabs for inhouse/away</div>
            <div>select studies (multiple)</div>
            <div>select subject type</div>
            <div>select age-frame</div>

            <Switch>
                <Route exact path={ `${path}` }>
                    <StudySelect />
                </Route>
                <Route exact path={ `${path}/:studyIds` }>
                    <SubjectTypeSelect />
                </Route>
                <Route path={ `${path}/:studyIds/:subjectRecordType` }>
                    <SearchContainer />
                </Route>
            </Switch>
        </div>
    )
}

export default SubjectSelectionRouting;
