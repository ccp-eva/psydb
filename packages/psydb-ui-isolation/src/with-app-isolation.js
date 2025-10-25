import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import { withContext, composeAsComponent }
    from '@cdxoo/react-compose-contexts';

import { createAgent } from '@mpieva/psydb-ui-request-agents'

import { AgentContext, UIConfigContext, SelfContext, I18NContext }
    from '@mpieva/psydb-ui-contexts';

import { withCookiesProvider } from '@mpieva/psydb-ui-cookies';
import { initI18N, initStateFromAPI }
    from '@mpieva/psydb-ui-context-initializers';

import { ErrorBoundary, BrandingWrapper } from '@mpieva/psydb-ui-lib';
import * as Public from '@mpieva/psydb-ui-public-landing';

import withMainIsolation from './with-main-isolation';

const withAppIsolation = (Component) => {
    var MainIsolation = withMainIsolation(Component);

    var AppIsolation = () => {
        var {
            isInitialized, config,
            authCurrentStatus, authResponseStatus,
            self, setSelf,
        } = initStateFromAPI();

        var [ i18n, setI18N ] = initI18N({ config });
        var agent = createAgent({ ...i18n });

        var contextBag = {
            agent, config, i18n: [ i18n, setI18N ],
        }

        if (!isInitialized) {
            return <AppInitializing />
        }

        var renderedView = undefined;
        if (authCurrentStatus === 200 && self) {
            renderedView = (
                <CommonContexts { ...contextBag } agent={ agent }>
                    <BrandingWrapper enableDevPanel={ false }>
                        <SelfContext.Provider value={{ ...self, setSelf }}>
                            <MainIsolation onSignedOut={ onSuccessfulUpdate } />
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

    return AppIsolation;
}

const AppInitializing = () => (
    <ErrorBoundary>
        <div>Loading</div>
    </ErrorBoundary>
)

var CommonContexts = composeAsComponent(
    withContext(UIConfigContext, 'config'),
    withContext(I18NContext, 'i18n'),
    withContext(AgentContext, 'agent')
);

const CookieWrapped = withCookiesProvider(App);

export default CookieWrapped;

