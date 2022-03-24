import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { FormBox } from '@mpieva/psydb-ui-lib';
import ExperimentContainer from './experiment-container';

const Experiments = () => {
    var { path, url } = useRouteMatch();
    
    return (
        <div>
            <header>
                <h1 className='mb-0 border-bottom' role='button'>
                    Termin
                </h1>
            </header>
            <h5 className='mt-0 mb-3 text-muted' role='button'>
                Details
            </h5>
            <Switch>
                <Route exact path={ `${path}/:experimentType/remove-success` }>
                    <RemoveSuccessInfo />
                </Route>
                <Route path={ `${path}/:experimentType/:id` }>
                    <ExperimentContainer />
                </Route>
            </Switch>
        </div>
    );
}

const RemoveSuccessInfo = (ps) => {
    var { experimentType } = useParams();
    var successInfoBackLink = getSuccessInfoBackLink(experimentType);

    return (
        <FormBox titleClassName='text-success' title='Termin gelöscht'>
            <i>Termin wurde erfolgreich gelöscht</i>
            {/* successInfoBackLink && (
                <>
                    <hr />
                    <a href={ successInfoBackLink }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>zurück zur Liste</b>
                    </a>
                </>
            )*/}
        </FormBox>
    )
}

var getSuccessInfoBackLink = (experimentType) => {
    // FIXME: doesnt reallly work because of researchGroupId
    switch (experimentType) {
        case 'away-team':
            return undefined;
    }
}

export default Experiments
