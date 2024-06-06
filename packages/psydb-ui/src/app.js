import React, { useEffect, useState, lazy } from 'react';
import { CookiesProvider } from 'react-cookie';
import { HashRouter as Router } from 'react-router-dom';

import {
    withContext,
    composeAsComponent
} from '@cdxoo/react-compose-contexts';

import config from '@mpieva/psydb-common-config';
import { createTranslate } from '@mpieva/psydb-common-translations';

import createAgent, { simple as publicAgent } from '@mpieva/psydb-ui-request-agents';

import {
    UIConfigContext,

    SelfContext,
    AgentContext,
    I18NContext,
    
    UILocaleContext,
    UILanguageContext,
    UITranslationContext,

    useUIConfig,
} from '@mpieva/psydb-ui-contexts';

import { useCookieI18N } from '@mpieva/psydb-ui-hooks';
import { createI18N } from '@mpieva/psydb-ui-lib';

import ErrorResponseModalSetup from './error-response-modal-setup';
import ErrorBoundary from './error-boundary';

import BrandingWrapper from './branding-wrapper';
import PublicLanding from './public-landing';
import Main from './main'

const App = () => {
    var [ isInitialized, setIsInitialized ] = useState(false);

    var [ state, setState ] = useState({});
    var { authResponseStatus, self } = state;
    var setSelf = (nextSelf) => setState({ ...state, self: nextSelf });

    var [ cookieI18N, setCookieI18N ] = useCookieI18N({ config });
    var i18n = createI18N({ ...cookieI18N });
    var { language, translate, localeCode, locale } = i18n;
    
    var agent = createAgent({ language, localeCode });

    var onSuccessfulUpdate = (response) => {
        // FIXME: find better way to determine logout
        var data = response?.data?.data;
        if (data?.authStatusCode) {
            setState({
                self: data.self,
                authResponseStatus: data.authStatusCode,
            })
        }
        else if (data?.record) {
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
        publicAgent.get('/api/init-ui').then(
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
        //config,
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
    if (authResponseStatus === 200 && self) {
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
            authResponseStatus,
            onSuccessfulUpdate,
            onFailedUpdate,
        };
        renderedView = (
            <CommonContexts { ...contextBag } agent={ publicAgent }>
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
    //withContext(UIConfigContext, 'config'),
    withContext(I18NContext, 'i18n'),
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
            <Component { ...ps } />
        </CookiesProvider>
    )
}

const CookieWrapped = withCookiesProvider(App);

const ConfigWrapped = (ps) => {
    return (
        <UIConfigContext.Provider value={ config }>
            <CookieWrapped />
        </UIConfigContext.Provider>
    )
}

export default ConfigWrapped;

