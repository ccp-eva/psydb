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

var reducer = (state, action) => {
    var { type, payload } = state;
    switch (type) {
        case 'change-experiment-time-interval':
            return ({
                ...state,
                experimentTimeInterval: payload
            });
        case 'init-ageframe-settings':
            return ({
                ...state,
                // TODO: descie how to structure that
                ageFrameSettingsByStudy: payload
            })
    }
};

const SearchContainer = () => {
    var { path, url } = useRouteMatch();

    useEffect(() => {
        agent.fetchAgeFrameSettings({
            studyIds,
            subjectRecordType,
        })
        .then(response => {
            dispatch({
                type: 'init-ageframe-settings',
                payload: response.data.data.ageFrameSettingsByStudy
                // [studyId]: [
                //    { ageFrame: {}, conditionList }
                // ]
            })
        })
    })

    return (
        <Switch>
            <Route exact path={ `${path}` }>
                <ExperimentTimeIntervalEditor
                    interval={ experimentTimeInterval }
                    onChange={ (nextInterval) => {
                        dispatch({
                            type: 'change-experiment-time-interval',
                            payload: nextInterval
                        })
                    }}
                />
                <AgeFrameSettingsEditor
                    settings={ settings }
                    onChange={ (...args) => {
                        console.log(args);
                    }}
                />
            </Route>
            <Route exact path={ `${path}/search`}>
                <TestableSubjectList />
            </Route>
        </Switch>
    )
}

const ExperimentTimeIntervalEditor = ({
    interval,
    onChange,
}) => {
    return (
        <div>Interval editor</div>
    )
}

const AgeFrameSettingsEditor = ({
    settings,
    onChange
}) => {
    return (
        <div>Age frame ditor</div>
    )
}

const TestableSubjectList = ({
    settings
}) => {
    return (
        <div>testable subject list</div>
    );
}

export default SearchContainer;
