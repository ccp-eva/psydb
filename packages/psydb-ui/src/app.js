import React, { useEffect, useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import { withContext, composeAsComponent }
    from '@cdxoo/react-compose-contexts';

import { createAgent }
    from '@mpieva/psydb-ui-request-agents';
import { withCookiesProvider }
    from '@mpieva/psydb-ui-cookies';
import { initI18N, initStateFromAPI }
    from '@mpieva/psydb-ui-context-initializers';

import {
    AgentContext, UIConfigContext, SelfContext, I18NContext,
    UILocaleContext, UILanguageContext, UITranslationContext,
} from '@mpieva/psydb-ui-contexts';


import ErrorResponseModalSetup from './error-response-modal-setup';
import { ErrorBoundary, BrandingWrapper } from '@mpieva/psydb-ui-lib';
import * as Public from '@mpieva/psydb-ui-public-landing';

import Main from './main'

const App = () => {
    var {
        isInitialized, config,
        authCurrentStatus, authResponseStatus,
        self, setSelf,

        onFailedUpdate,
        onSuccessfulUpdate,
    } = initStateFromAPI();
    
    var [ i18n, setI18N ] = initI18N({ config });
    var agent = createAgent({ ...i18n });
    
    var contextBag = {
        config,
        i18n: [ i18n, setI18N ],

        // NOTE: compat
        language: [ i18n.language, setI18N ],
        locale: i18n.locale,
        translate: i18n.translate,
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
            authCurrentStatus, authResponseStatus,
            onSuccessfulUpdate, onFailedUpdate,
        };
        renderedView = (
            <Public.Contexts { ...contextBag }>
                <BrandingWrapper>
                    <Public.Landing { ...publicBag } />
                </BrandingWrapper>
            </Public.Contexts>
        )
    }

    return (
        <ErrorBoundary>
            <Router>{ renderedView }</Router>
        </ErrorBoundary>
    );
}

const AppInitializing = () => (
    <div>Loading</div>
)

var CommonContexts = composeAsComponent(
    withContext(AgentContext, 'agent'),
    withContext(UIConfigContext, 'config'),
    withContext(I18NContext, 'i18n'),
    withContext(UILocaleContext, 'locale'),
    withContext(UILanguageContext, 'language'),
    withContext(UITranslationContext, 'translate'),
);

const CookieWrapped = withCookiesProvider(App);

export default CookieWrapped;

