import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import { withContext, composeAsComponent }
    from '@cdxoo/react-compose-contexts';

import { PublicAgent, createAgent }
    from '@mpieva/psydb-ui-request-agents'

import { AgentContext, UIConfigContext, SelfContext, I18NContext }
    from '@mpieva/psydb-ui-contexts';

import { withCookiesProvider } from '@mpieva/psydb-ui-cookies';
import { initI18N } from '@mpieva/psydb-ui-context-initializers';

import { ErrorBoundary, BrandingWrapper } from '@mpieva/psydb-ui-lib';
import PublicLanding from '@mpieva/psydb-ui-public-landing';

import withMainIsolation from './with-main-isolation';

const withAppIsolation = (Component) => {
    var MainIsolation = withMainIsolation(Component);

    var AppIsolation = () => {
        var [ isInitialized, setIsInitialized ] = useState(false);
        var [ state, setState ] = useState({});
        var {
            authCurrentStatus = 401,
            authResponseStatus = undefined,
            self, config = {}
        } = state;

        var [ i18n, setI18N ] = initI18N();
        var agent = createAgent({ ...i18n });

        // XXX: this feels relly dumb
        initStateFromApi({
            state, setState, isInitialized, setIsInitialized
        });

        var setSelf = (nextSelf) => setState({ ...state, self: nextSelf });
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
                <CommonContexts { ...contextBag } agent={ PublicAgent }>
                    <BrandingWrapper>
                        <PublicLanding { ...publicBag } />
                    </BrandingWrapper>
                </CommonContexts>
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

