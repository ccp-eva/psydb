import React, { useEffect, useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import {
    withContext,
    composeAsComponent
} from '@cdxoo/react-compose-contexts';

import { createAgent, PublicAgent } from '@mpieva/psydb-ui-request-agents';

import {
    AgentContext,
    UIConfigContext,
    SelfContext,
    I18NContext,
    
    UILocaleContext,
    UILanguageContext,
    UITranslationContext,
} from '@mpieva/psydb-ui-contexts';

import { withCookiesProvider } from '@mpieva/psydb-ui-cookies';
import { initI18N } from '@mpieva/psydb-ui-context-initializers';

import ErrorResponseModalSetup from './error-response-modal-setup';
import { ErrorBoundary, BrandingWrapper } from '@mpieva/psydb-ui-lib';
import PublicLanding from '@mpieva/psydb-ui-public-landing';

import Main from './main'

const App = () => {
    var [ isInitialized, setIsInitialized ] = useState(false);

    var [ state, setState ] = useState({});
    var {
        authCurrentStatus = 401,
        authResponseStatus = undefined,
        self, config = {}
    } = state;

    var setSelf = (nextSelf) => setState({ ...state, self: nextSelf });

    var [ i18n, setCookieI18N ] = initI18N({ config });
    var { language, translate, localeCode, locale } = i18n;

    var agent = createAgent({ language, localeCode });

    var onSuccessfulUpdate = (response) => {
        // FIXME: find better way to determine logout
        var data = response?.data?.data;
        if (data?.authStatusCode) {
            setState({
                self: data.self,
                authCurrentStatus: data.authStatusCode,
                authResponseStatus: undefined,
                config: data.config,
            })
        }
        else if (data?.record) {
            setState({
                self: response.data.data,
                authCurrentStatus: response.status,
                config,
            });
        }
        else {
            // NOTE: reset auth status on logout /api/self on logout
            setState({ config });
        }
    }

    var onFailedUpdate = (error) => {
        var statusCode = error.response?.status;
        if (statusCode) {
            setState({
                authCurrentStatus: statusCode,
                authResponseStatus: statusCode,
                config,
            });
        }
        else {
            throw error;
        }
    }
            
    var is200 = (authCurrentStatus === 200);
    useEffect(() => {
        setIsInitialized(false)
        PublicAgent.get('/api/init-ui').then(
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
        i18n: [ i18n, setCookieI18N ],
        language: [ language, setCookieI18N ],
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
    if (authCurrentStatus === 200 && self) {
        renderedView = (
            <CommonContexts { ...contextBag } agent={ agent }>
                <BrandingWrapper enableDevPanel={ false }>
                    <ErrorResponseModalSetup />
                    <SelfContext.Provider value={{ ...self, setSelf }}>
                        <Main onSignedOut={ onSuccessfulUpdate } />
                    </SelfContext.Provider>
                </BrandingWrapper>
            </CommonContexts>
        )
    }
    else {
        var publicBag = {
            authCurrentStatus,
            authResponseStatus,
            onSuccessfulUpdate,
            onFailedUpdate,
        };
        renderedView = (
            <CommonContexts { ...contextBag } agent={ PublicAgent }>
                <BrandingWrapper>
                    <PublicLanding { ...publicBag } />
                </BrandingWrapper>
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
    withContext(I18NContext, 'i18n'),
    withContext(UILocaleContext, 'locale'),
    withContext(UILanguageContext, 'language'),
    withContext(UITranslationContext, 'translate'),
    withContext(AgentContext, 'agent')
);

const CookieWrapped = withCookiesProvider(App);

export default CookieWrapped;

