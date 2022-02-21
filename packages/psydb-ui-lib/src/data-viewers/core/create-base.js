import React from 'react';
import { ThemeProvider } from './theme-context';

export const createBase = (options = {}) => {
    var Context = React.createContext();
    var Component = (ps) => {
        var { theme, children, ...context } = ps;
        var { value, crtSettings, related } = context;
        if (!value) {
            throw new Error('value prop is required (db record)');
        }
        // FIXME: add options to enable/disable theese checks
        /*if (!crtSettings) {
            throw new Error('crtSettings prop is required');
        }
        if (!related) {
            throw new Error('related prop is required');
        }*/
        return (
            <ThemeProvider value={ theme }>
                <Context.Provider value={ context }>
                    { children }
                </Context.Provider>
            </ThemeProvider>
        );
    }
    return [ Component, Context ];
}
