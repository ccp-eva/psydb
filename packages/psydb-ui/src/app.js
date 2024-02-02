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
import SignIn from './sign-in';
import TwoFactorCodeInput from './two-factor-code-input';
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
    var [ needTwoFactorCode, setNeedTwoFactorCode ] = useState(false);
    var [ isSignedIn, setIsSignedIn ] = useState(false);
    var [ self, setSelf ] = useState();

    var [ cookies, setCookie ] = useCookies([ 'i18n' ]);
    var { language, localeCode } = applyI18N({ cookies, config });
    var locale = localesByCode[localeCode];

    var setI18N = (value) => {
        var [ language, localeCode ] = (
            typeof value === 'string'
            ? [ value, value === 'de' ? deLocale.code : enUSLocale.code ]
            : [ value.language, value.localeCode ]
        )
        setCookie('i18n', { language, localeCode });
    };
    //var setLocale = (value) => dispatch({ type: 'set-locale', value });

    var onSignedIn = (selfArg) => {
        setIsSignedIn(true);
        setNeedTwoFactorCode(true);
        if (selfArg) {
            setSelf(selfArg);
        }
    }

    var onSignedOut = () => {
        setIsSignedIn(false);
        setNeedTwoFactorCode(false);
        setIsInitialized(false);
    }

    useEffect(() => {
        setIsInitialized(false)
        publicAgent.get('/api/self').then(
            (res) => {
                var self = res.data.data;
                onSignedIn(self);
                setIsInitialized(true)
            },
            (error) => {
                var statusCode = error.response?.status;
                if ([801, 803].includes(statusCode)) {
                    setNeedTwoFactorCode(true);
                }
                setIsInitialized(error.response.status)
            }
        )
    }, [ isSignedIn, needTwoFactorCode ]);

    var translate = createTranslate(language);

    var sharedBag = {
        config,
        language: [ language, setI18N ],
        locale,
        translate,
    }

    var agent = createAgent({ language, localeCode: locale.code });

    if (!isInitialized) {
        return (
            <ErrorBoundary>
                <AppInitializing />
            </ErrorBoundary>
        )
    }

    var renderedView = undefined;
    if (isSignedIn && self) {
        renderedView = (
            <CommonContexts { ...sharedBag } agent={ agent }>
                <ErrorResponseModalSetup />
                <SelfContext.Provider value={{ ...self, setSelf }}>
                    <Main onSignedOut={ onSignedOut } />
                </SelfContext.Provider>
            </CommonContexts>
        )
    }
    else {
        if ([801, 803].includes(isInitialized)) {
            renderedView = (
                <CommonContexts { ...sharedBag } agent={ publicAgent }>
                    <TwoFactorCodeInput
                        isMismatch={ isInitialized === 803 }
                        onSignedIn={ onSignedIn }
                        onSignedOut={ onSignedOut }
                    />
                </CommonContexts>
            );
        }
        else {
            renderedView = (
                <CommonContexts { ...sharedBag } agent={ publicAgent }>
                    <SignIn
                        onSignedIn={ onSignedIn }
                        onTwoFactor={() => setNeedTwoFactorCode(true) }
                    />
                </CommonContexts>
            )
        }
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
