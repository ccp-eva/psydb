import React from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';

var withCookiesProvider = (Component) => (ps) => {
    return (
        <CookiesProvider defaultSetOptions={{
            // FIXME: theese cannot currently controlled via
            // config; im not sure that is an issue since we only
            // use it for i18n
            path: '/', maxAge: 365*24*60*60
        }}>
            <Component { ...ps } />
        </CookiesProvider>
    )
}

export { CookiesProvider, useCookies, withCookiesProvider }
