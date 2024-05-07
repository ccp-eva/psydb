import React, { useEffect, useState, lazy } from 'react';
import { CookiesProvider } from 'react-cookie';
import { HashRouter as Router } from 'react-router-dom';

import { entries } from '@mpieva/psydb-core-utils';
import config from '@mpieva/psydb-common-config';
import { createTranslate } from '@mpieva/psydb-common-translations';

import createAgent, { simple as publicAgent } from '@mpieva/psydb-ui-request-agents';

import {
    SelfContext,
    AgentContext,
    UIConfigContext,
    UILocaleContext,
    UILanguageContext,
    UITranslationContext,

    useUIConfig,
    useMergeUIConfig,
} from '@mpieva/psydb-ui-contexts';

import ErrorResponseModalSetup from './error-response-modal-setup';
import ErrorBoundary from './error-boundary';

import PublicLanding from './public-landing';
import Main from './main'

import { withContext, composeAsComponent } from './compose-react-contexts';
import useCookieI18N from './use-cookie-i18n';
import branding from './branding';

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
        //config,
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

const BrandingWrapper = (ps) => {
    var { enableDevPanel = true, children } = ps;
    
    var config = useUIConfig();
    var mergeUIConfig = useMergeUIConfig();

    var setBrandingBodyCSS = (theBranding) => {
        var { cssvars } = branding[theBranding];
        for (var [ key, value ] of entries(cssvars)) {
            document.body.style.setProperty(key, value);
        }
    }

    var [ isCSSDone, setCSSDone ] = useState(false);
    useEffect(() => {
        setBrandingBodyCSS(config.branding);
        setCSSDone(true)
    }, [ config.branding ]);

    if (!isCSSDone) {
        return null;
    }

    return (
        <>
            { enableDevPanel && (
                <div className='border-left border-bottom bg-light p-3' style={{
                    position: 'absolute',
                    right: 0,
                    zIndex: 500,
                }}>
                    <h5 className='text-danger'>
                        <b>DEV Panel</b>
                    </h5>
                    <div className='d-flex flex-column'>
                        <header><b>Branding</b></header>
                        <a onClick={() => mergeUIConfig({
                            '/branding': 'mpiccp',
                            '/disableLogoOverlay': false
                        })}>
                            MPI EVA
                        </a>
                        <a onClick={() => mergeUIConfig({
                            '/branding': 'sunwayfull',
                            '/disableLogoOverlay': true
                        })}>
                            Sunway Logo Full
                        </a>
                        <a onClick={() => mergeUIConfig({
                            '/branding': 'sunwaywide',
                            '/disableLogoOverlay': true
                        })}>
                            Sunway Logo Wide
                        </a>
                        <a onClick={() => mergeUIConfig({
                            '/branding': 'sunwayadapted',
                            '/disableLogoOverlay': true
                        })}>
                            Sunway Logo Adapted
                        </a>
                        <hr />

                        <header><b>Copy Notice Orb</b></header>
                        <a onClick={() => mergeUIConfig({
                            '/copyNoticeGreyscale': true,
                        })}>
                            Greyscale
                        </a>
                        <a onClick={() => mergeUIConfig({
                            '/copyNoticeGreyscale': false,
                        })}>
                            Color
                        </a>

                    </div>
                </div>
            )}
            <div className={ config.branding || 'mpiccp' }>
                { children }
            </div>
        </>
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

