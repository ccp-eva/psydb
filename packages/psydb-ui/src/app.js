import React, { useEffect, useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import { HashRouter as Router } from 'react-router-dom';

import createAgent, { simple as publicAgent } from '@mpieva/psydb-ui-request-agents';

import config from '@mpieva/psydb-common-config';
import { createTranslate } from '@mpieva/psydb-common-translations';

import {
    SelfContext,
    AgentContext,
    UIConfigContext,
    UILocaleContext,
    UILanguageContext,
    UITranslationContext,
} from '@mpieva/psydb-ui-contexts';

import ErrorResponseModalSetup from './error-response-modal-setup';
import ErrorBoundary from './error-boundary';

import PublicLanding from './public-landing';
import Main from './main'

import { withContext, composeAsComponent } from './compose-react-contexts';
import useCookieI18N from './use-cookie-i18n';

const App = () => {
    var [ isInitialized, setIsInitialized ] = useState(false);

    var [ state, setState ] = useState({});
    var { authResponseStatus, self } = state;
    var setSelf = (nextSelf) => setState({ ...state, self: nextSelf });

    var [ i18n, setI18N ] = useCookieI18N({ config });
    var { language, locale } = i18n;
    
    var translate = createTranslate(language);
    var agent = createAgent({ language, localeCode: locale.code });

    var onSuccessfulUpdate = (response) => {
        // FIXME: find better way to determine logout
        if (response?.data?.data?.record) {
            setState({
                self: response.data.data,
                authResponseStatus: response.status
            });
        }
        else {
            // NOTE: reset auth status on logout /api/self on logout
            setState({});
        }
    }

    var onFailedUpdate = (error) => {
        var statusCode = error.response?.status;
        if (statusCode) {
            setState({ authResponseStatus: statusCode });
        }
        else {
            throw error;
        }
    }

    var is200 = (authResponseStatus === 200);
    useEffect(() => {
        setIsInitialized(false)
        publicAgent.get('/api/self').then(
            (response) => {
                onSuccessfulUpdate(response);
                setIsInitialized(true);
            },
            (error) => {
                onFailedUpdate(error);
                setIsInitialized(true);
            }
        )
    }, [ is200 ]);

    var contextBag = {
        config,
        language: [ language, setI18N ],
        locale,
        translate,
    }

    if (!isInitialized) {
        return (
            <ErrorBoundary>
                <AppInitializing />
            </ErrorBoundary>
        )
    }

    var renderedView = undefined;
    if (authResponseStatus === 200 && self) {
        renderedView = (
            <CommonContexts { ...contextBag } agent={ agent }>
                <ErrorResponseModalSetup />
                <SelfContext.Provider value={{ ...self, setSelf }}>
                    <Main onSignedOut={ onSuccessfulUpdate } />
                </SelfContext.Provider>
            </CommonContexts>
        )
    }
    else {
        var publicBag = {
            authResponseStatus,
            onSuccessfulUpdate,
            onFailedUpdate,
        };
        renderedView = (
            <CommonContexts { ...contextBag } agent={ publicAgent }>
                <PublicLanding { ...publicBag } />
            </CommonContexts>
        )
    }

    return (
        <ErrorBoundary>
            <Router>
                { renderedView }
            </Router>
        </ErrorBoundary>
    );
}

const AppInitializing = () => (
    <div>Loading</div>
)

var CommonContexts = composeAsComponent(
    withContext(UIConfigContext, 'config'),
    withContext(UILocaleContext, 'locale'),
    withContext(UILanguageContext, 'language'),
    withContext(UITranslationContext, 'translate'),
    withContext(AgentContext, 'agent')
);

var withCookiesProvider = (Component) => (ps) => {
    return (
        <CookiesProvider defaultSetOptions={{
            path: '/', maxAge: 365*24*60*60
        }}>
            <Component { ...ps} />
        </CookiesProvider>
    )
}

export default withCookiesProvider(App);
