import React, { useState, useEffect, useReducer, useMemo } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import jsonpointer from 'jsonpointer';
import { Base64 } from 'js-base64';
import pako from 'pako';

import {
    DateOnlyServerSideInterval,
} from '@mpieva/psydb-schema-fields';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import createValueMap from './create-value-map';
import SelectionSettingsFormSchema from './selection-settings-form-schema';
import SelectionSettingsForm from './selection-settings-form';
import InhouseSubjectList from './inhouse/testable-subject-list';
import OnlineSubjectList from './online/testable-subject-list';
import AwayTeamTargetLocationList from './away-team/target-location-list';

import { SelectionForm } from './selection-form';

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

            var valueMap = createValueMap(studySelectionSettings);

            var schema = SelectionSettingsFormSchema({
                timeFrameDefaults: {
                    start: datefns.format(
                        datefns.add(new Date(), { days: 1 }),
                        'yyyy-MM-dd'
                    ),
                    end: datefns.format(
                        datefns.add(new Date(), { weeks: 2, days: 1 }),
                        'yyyy-MM-dd'
                    )
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
                valueMap,
                searchSettings: undefined,
                studyLabelItems: studySelectionSettings.map(it => ({
                    key: it.studyId,
                    label: it.studyShorthand
                }))
            })
        case 'update-search-settings':
            return ({
                ...state,
                searchSettings: action.payload,
            })
    }

};

const SearchContainer = ({
    experimentType,
}) => {
    var { path, url } = useRouteMatch();
    var history = useHistory();
    var { studyIds, subjectRecordType } = useParams();

    var [ schema, setSchema ] = useState();
    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        crts: agent.readCustomRecordTypeMetadata({
            only: [{
                collection: 'subject',
                types: [ subjectRecordType ]
            }]
        }),
        ageFrames: agent.fetchAgeFrames({
            studyIds: studyIds.split(','),
        })
    }), [ studyIds, subjectRecordType ]);

    var schema = useMemo(() => {
        if (didFetch) {
            /*return SelectionSettingsFormSchema({
                timeFrameDefaults: {
                    start: datefns.format(
                        datefns.add(new Date(), { days: 1 }),
                        'yyyy-MM-dd'
                    ),
                    end: datefns.format(
                        datefns.add(new Date(), { weeks: 2, days: 1 }),
                        'yyyy-MM-dd'
                    )
                },
                studySelectionSettings,
                customFieldDefinitions: scientificFieldDefinitions,
                relatedRecords,
                relatedHelperSetItems,
            });*/
        }
    }, [ didFetch ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var subjectTypeRecord = fetched.crts.data.customRecordTypes[0];
    var {
        records: ageFrameRecords,
        ...ageFrameRelated
    } = fetched.ageFrames.data;

    var handleSubmit = (formData) => {
        try {
            var json = JSON.stringify(formData);
            var base64 = Base64.encode(json);

            //var gzipped = pako.deflate(json);
            //var base64 = Base64.encode(gzipped);
            console.log({ base64 });

            //dispatch({ type: 'update-search-settings', payload });
            history.push(`${url}/search/${base64}`);
        }
        catch (e) {
            console.log(e);
        }
    }

    var SubjectListComponent = {
        'inhouse': InhouseSubjectList,
        'online': OnlineSubjectList,
        'away-team': AwayTeamTargetLocationList,
    }[experimentType];

    return (
        <Switch>
            <Route exact path={ `${path}` }>
                <div className='p-3 border bg-light'>
                    <SelectionForm { ...({
                        subjectTypeRecord,
                        ageFrameRecords,
                        ageFrameRelated,

                        onSubmit: handleSubmit
                    })} />
                </div>
            </Route>
            <Route exact path={ `${path}/search/:searchSettings64` }>
                <SubjectListComponent />
            </Route>
        </Switch>

    );

    return 'foo';

    var [ state, dispatch ] = useReducer(reducer, {
        isInitialized: false,
        schema: undefined,
        formData: undefined,
    });

    var {
        isInitialized,
        schema,
        ageFrameMap,
        valueMap,
        searchSettings,
        studyLabelItems,
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

    var handleSubmit = ({ formData }) => {
        console.log(formData);
        console.log(valueMap);

        var remapped = {};
        var enabledAgeFrames = [];
        for (var ageFramePtr of Object.keys(valueMap)) {
            var { enabled: ageFrameEnabled } = jsonpointer.get(
                formData.selectionSettings,
                ageFramePtr
            );
            if (ageFrameEnabled) {
                enabledAgeFrames.push(ageFramePtr.replace(
                    'conditionsByAgeFrame/', ''
                ));
                var values = valueMap[ageFramePtr];
                for (var valuePtr of Object.keys(values)) {
                    var fullptr = `${ageFramePtr}${valuePtr}`;
                    var valueEnabled = jsonpointer.get(
                        formData.selectionSettings,
                        fullptr
                    );
                    if (valueEnabled) {
                        remapped[fullptr.replace(
                            /(conditionsByAgeFrame|conditions)\//, ''
                        )] = values[valuePtr];
                    }
                }
            }

            //var enabled = 
        }

        var out = {};
        for (var ptr of Object.keys(remapped)) {
            var match = ptr.match(/^(.*)\/[^\/]+$/);
            var [ _unused, basePtr ] = match;
            if (!out[basePtr]) {
                out[basePtr] = [];
            }
            out[basePtr].push(remapped[ptr]);
        }

        var payload = {
            timeFrame: {
                start: new Date(formData.timeFrame.start).getTime(),
                end: new Date(formData.timeFrame.end).getTime(),
            },
            ageFrames: enabledAgeFrames,
            values: out,
        };

        console.log(payload);

        var json = JSON.stringify(payload);
        var base64 = Base64.encode(json);
        console.log(base64);

        dispatch({ type: 'update-search-settings', payload });
        history.push(`${url}/search/${base64}`);
    };

    var SubjectListComponent = {
        'inhouse': InhouseSubjectList,
        'online': OnlineSubjectList,
        'away-team': AwayTeamTargetLocationList,
    }[experimentType];

    return (
        <Switch>
            <Route exact path={ `${path}` }>
                <SelectionSettingsForm { ...({
                    schema,
                    onSubmit: handleSubmit,
                }) } />
            </Route>
            <Route exact path={ `${path}/search/:searchSettings64` }>
                <SubjectListComponent
                    studyLabelItems={ studyLabelItems }
                />
            </Route>
        </Switch>
    )
}

export default SearchContainer;
