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
import InhouseGroupSimpleList from './inhouse-group-simple/group-list';
import AwayTeamTargetLocationList from './away-team/target-location-list';
import OnlineVideoCallSubjectList from './online-video-call/testable-subject-list';
import OnlineSubjectList from './online/testable-subject-list';

import { SelectionForm } from './selection-form';

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
            history.push(`${url}/search/${base64}`);
        }
        catch (e) {
            console.log(e);
        }
    }

    var SubjectListComponent = {
        'inhouse': InhouseSubjectList,
        'away-team': AwayTeamTargetLocationList,
        'online-video-call': OnlineVideoCallSubjectList,
        'online-survey': OnlineSubjectList,
        'inhouse-group-simple': InhouseGroupSimpleList,
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

}

export default SearchContainer;
