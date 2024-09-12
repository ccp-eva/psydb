import React from 'react';
import { Base64 } from 'js-base64';
import { useHistory } from 'react-router';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { PageWrappers } from '@mpieva/psydb-ui-layout';
import { DefaultForm, useFormikContext } from '@mpieva/psydb-ui-lib';

import TabNav from './tab-nav';
import Filters from './filters';
import Results from './results';

const StudyStatisticsRouting = (ps) => {
    var { url, path } = useRouteMatch();

    var history = useHistory();
    var translate = useUITranslation();

    var handleSwitchTab = ({ nextTab, formData }) => {
        var formData64 = Base64.encode(JSON.stringify(formData));
        
        history.replace({
            pathname: `${path}/${nextTab}/${formData64}`,
        });
        window.scrollTo(0, 0);
    }

    var initialValues = {}
    return (
        <PageWrappers.Level2
            title={ translate('Study Statistics') }
            titleLinkUrl={ `${url}/filters` }
        >
            <DefaultForm
                onSubmit={ (formData) => { handleSwitchTab({
                    nextTab: 'results', formData,
                }) }}
                initialValues={ initialValues }
            >
                { () => <Inner onSwitchTab={ handleSwitchTab } /> }
            </DefaultForm>
        </PageWrappers.Level2>
    )
}

const Inner = (ps) => {
    var { onSwitchTab } = ps;
    var { path } = useRouteMatch();
    var { values } = useFormikContext();
    console.log(values);

    var handleSwitchTab = ({ nextTab }) => {
        onSwitchTab({ nextTab, formData: values['$'] });
    }

    return (
        <Switch>
            <Route path={ `${path}/filters/:b64?` }>
                <>
                    <TabNav
                        activeTab='filters'
                        onSwitchTab={ handleSwitchTab }
                    />
                    <Filters />
                </>
            </Route>
            <Route path={ `${path}/results/:b64?` }>
                
                <>
                    <TabNav
                        activeTab='results'
                        onSwitchTab={ handleSwitchTab }
                    />
                    <Results />
                </>
            </Route>
        </Switch>
    )
}

export default StudyStatisticsRouting;
