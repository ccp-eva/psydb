import React from 'react';
import { Base64 } from 'js-base64';
import { useHistory } from 'react-router';
import { useParams, useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { PageWrappers } from '@mpieva/psydb-ui-layout';
import { DefaultForm, useFormikContext } from '@mpieva/psydb-ui-lib';

import TabNav from './tab-nav';
import Filters from './filters';
import Results from './results';

const maybeDecodeBase64 = (encoded, { isJson = true } = {}) => {
    var decoded = undefined;
    try {
        if (encoded) {
            decoded = Base64.decode(encoded);
            if (isJson) {
                decoded = JSON.parse(decoded);
            }
            console.log('decoded base64', decoded);
        }
    }
    catch (e) {
        console.log(e);
    }
    return decoded;
}

const StudyStatisticsRouting = (ps) => {
    var { url, path } = useRouteMatch();
    return (
        <Route path={ `${path}/:tab/:b64?` }>
            <ParamWrapper url={ url } path={ path }/>
        </Route>
    )
}

const ParamWrapper = (ps) => {
    var { url, path } = ps;
    var { b64 } = useParams();
    var decodedFormData = maybeDecodeBase64(b64, { isJson: true });

    var history = useHistory();
    var translate = useUITranslation();

    var handleSwitchTab = ({ nextTab, formData }) => {
        var formData64 = Base64.encode(JSON.stringify(formData));
        
        history.replace({
            pathname: `${path}/${nextTab}/${formData64}`,
        });
        window.scrollTo(0, 0);
    }

    var initialValues = decodedFormData || {};
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
    var { tab } = useParams();
    var { values } = useFormikContext();

    var handleSwitchTab = ({ nextTab }) => {
        onSwitchTab({ nextTab, formData: values['$'] });
    }

    return (
        <>
            <TabNav activeTab={ tab } onSwitchTab={ handleSwitchTab } />
            { tab === 'results' ? (
                <Results formData={ values['$'] } />
            ) : (
                <Filters />
            )}
        </>
    )
}

export default StudyStatisticsRouting;
