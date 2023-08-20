import React from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { PageWrappers } from '@mpieva/psydb-ui-layout';
import { FormBox } from '@mpieva/psydb-ui-lib';
import ExperimentContainer from './experiment-container';

const Experiments = () => {
    var { path, url } = useRouteMatch();
    var translate = useUITranslation();

    return (
        <PageWrappers.Level1 title={ translate('Appointment') }>
            <PageWrappers.Level2 title={ translate('Details') }>
                <Switch>
                    <Route exact path={ `${path}/:experimentType/remove-success` }>
                        <RemoveSuccessInfo />
                    </Route>
                    <Route path={ `${path}/:experimentType/:id` }>
                        <ExperimentContainer />
                    </Route>
                </Switch>
            </PageWrappers.Level2>
        </PageWrappers.Level1>
    );
}

const RemoveSuccessInfo = (ps) => {
    var { experimentType } = useParams();
    var translate = useUITranslation();

    var successInfoBackLink = getSuccessInfoBackLink(experimentType);

    return (
        <FormBox
            titleClassName='text-success'
            title={ translate('Appointment Deleted') }
        >
            <i>{ translate('Appointment was deleted successfully') }</i>
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
