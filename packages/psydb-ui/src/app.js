import React, { useEffect, useState, useReducer } from 'react';
import enUSLocale from 'date-fns/locale/en-US';
import deLocale from 'date-fns/locale/de';

import {
    HashRouter as Router,
} from 'react-router-dom';

import agent, { simple as publicAgent } from '@mpieva/psydb-ui-request-agents';

import { createTranslate } from '@mpieva/psydb-ui-translations';

import {
    SelfContext,
    AgentContext,
    UILocaleContext,
    UILanguageContext,
    UITranslationContext,
} from '@mpieva/psydb-ui-contexts';

import ErrorResponseModalSetup from './error-response-modal-setup';
import ErrorBoundary from './error-boundary';
import SignIn from './sign-in';
import Main from './main'

const App = () => {

    var [ isSignedIn, setIsSignedIn ] = useState(false);
    var [ self, setSelf ] = useState();
    var [ isInitialized, setIsInitialized ] = useState(false);

    var [ state, dispatch ] = useReducer(i18nReducer, {
        language: 'en',
        locale: enUSLocale
    });

    var { language, locale } = state;
    var setI18N = (value) => dispatch({ type: 'set-i18n', value });
    var setLocale = (value) => dispatch({ type: 'set-locale', value });

    var onSignedIn = (selfArg) => {
        setIsSignedIn(true);
        if (selfArg) {
            setSelf(selfArg);
        }
    }

    var onSignedOut = () => {
        setIsSignedIn(false);
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
                setIsInitialized(true)
            }
        )
    }, [ isSignedIn ]);

    var translate = createTranslate(language);

    var sharedBag = {
        language: [ language, setI18N ],
        locale,
        translate,
    }

    var View = undefined;
    if (isInitialized) {
        View = (
            isSignedIn && self
            ? (
                <CommonContexts { ...sharedBag } agent={ agent }>
                    <ErrorResponseModalSetup />
                    <SelfContext.Provider value={{ ...self, setSelf }}>
                        <Main onSignedOut={ onSignedOut } />
                    </SelfContext.Provider>
                </CommonContexts>
            )
            : (
                <CommonContexts { ...sharedBag } agent={ publicAgent }>
                    <SignIn onSignedIn={ onSignedIn } />
                </CommonContexts>
            )
        );
    }
    else {
        View = <AppInitializing />
    }

    return (
        <ErrorBoundary>
            <Router>
                { View }
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

var i18nReducer = (state, action) => {
    var { type, value } = action;
    switch (type) {
        case 'set-language':
            return { ...state, language: value };
        case 'set-date-locale':
            return { ...state, locale: value };
        case 'set-i18n':
            return {
                ...state,
                language: value,
                locale: (value === 'de' ? deLocale : enUSLocale )
            };
        default:
            throw new Error(`unknown action type "${type}"`);
    }
}

export default App;
