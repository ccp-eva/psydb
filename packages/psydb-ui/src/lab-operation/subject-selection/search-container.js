import React, { useState, useEffect, useReducer } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import {
    DateOnlyInterval,
} from '@mpieva/psydb-schema-fields';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import SelectionSettingsFormSchema from './selection-settings-form-schema';
import SelectionSettingsForm from './selection-settings-form';

var FormSettingsItemSchema = ({
    studyName,
    selectionSettings,
    conditionsByAgeFrameItemSchema,
}) => ({
    type: 'object',
    title: studyName,
    properties: {
        conditionsByAgeFrame: {
            type: 'array',
            items: conditionsByAgeFrameItemSchema
        }
    }
});

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'init':
            var {
                studySelectionSettings,
                scientificFieldDefinitions,
                relatedHelperSetItems,
                relatedRecords,
            } = payload;

            var schema = SelectionSettingsFormSchema({
                timeFrameDefaults: {
                    start: datefns.format(new Date(), 'yyyy-MM-dd'),
                    end: datefns.format(new Date(), 'yyyy-MM-dd')
                },
                studySelectionSettings,
                customFieldDefinitions: scientificFieldDefinitions,
                relatedRecords,
                relatedHelperSetItems,
            });

            return ({
                ...state,
                isInitialized: true,
                schema,
            })
    }

};

const SearchContainer = () => {
    var { path, url } = useRouteMatch();
    var { studyIds, subjectRecordType } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {
        isInitialized: false,
        schema: undefined,
        formData: undefined,
    });

    var {
        isInitialized,
        schema,
    } = state;

    useEffect(() => {
        agent.fetchSelectionSettingsForSubjectTypeAndStudies({
            studyIds: studyIds.split(','),
            subjectRecordType,
        })
        .then(response => {
            dispatch({
                type: 'init',
                payload: response.data.data
                // [studyId]: [
                //    { ageFrame: {}, conditionList }
                // ]
            })
        })
    }, [ studyIds, subjectRecordType ])

    if (!isInitialized) {
        return <LoadingIndicator size='lg' />
    }

    return (
        <Switch>
            <Route exact path={ `${path}` }>
                <SelectionSettingsForm { ...({
                    schema,
                }) } />
            </Route>
            <Route exact path={ `${path}/search`}>
                <TestableSubjectList />
            </Route>
        </Switch>
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
