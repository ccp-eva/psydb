import React, { useEffect, useState, useReducer } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { HashRouter as Router } from 'react-router-dom';

import enUSLocale from 'date-fns/locale/en-US';
import enGBLocale from 'date-fns/locale/en-GB';
import deLocale from 'date-fns/locale/de';

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
import SignIn from './public-landing/sign-in';
import TwoFactorCodeInput from './public-landing/two-factor-code-input';
import PublicLanding from './public-landing';
import Main from './main'

const localesByCode = [
    enUSLocale,
    enGBLocale,
    deLocale
].reduce((acc, locale) => ({
    ...acc,
    [locale.code]: locale
}), {});

var applyI18N = (bag) => {
    var { cookies, config } = bag;
    var { enableI18NSelect, defaultLanguage, defaultLocaleCode } = config.i18n;
    if (enableI18NSelect) {
        var { i18n = {}} = cookies;
        var {
            language = defaultLanguage,
            localeCode = defaultLocaleCode
        } = i18n;
    }
    else {
        var language = defaultLanguage;
        var localeCode = defaultLocaleCode;
    }

    return { language, localeCode };
}

const App = () => {
    var [ isInitialized, setIsInitialized ] = useState(false);

    var [ state, setState ] = useState({});
    var { authResponseStatus, self } = state;
    var setSelf = (nextSelf) => setState({ ...state, self: nextSelf });

    var [ cookies, setCookie ] = useCookies([ 'i18n' ]);
    var { language, localeCode } = applyI18N({ cookies, config });
    var locale = localesByCode[localeCode];
    var translate = createTranslate(language);

    var agent = createAgent({ language, localeCode: locale.code });

    var setI18N = (value) => {
        var [ language, localeCode ] = (
            typeof value === 'string'
            ? [ value, value === 'de' ? deLocale.code : enUSLocale.code ]
            : [ value.language, value.localeCode ]
        )
        setCookie('i18n', { language, localeCode });
    };

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

var withContext = (Context, propKey) => (Next) => (ps) => {
    var { [propKey]: value, ...rest } = ps;
    return (
        <Context.Provider value={ value }>
            <Next { ...rest }/>
        </Context.Provider>
    )
}
var CommonContexts = compose(
    withContext(UIConfigContext, 'config'),
    withContext(UILocaleContext, 'locale'),
    withContext(UILanguageContext, 'language'),
    withContext(UITranslationContext, 'translate'),
    withContext(AgentContext, 'agent')
)(
    ({ children }) => children
);

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

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
