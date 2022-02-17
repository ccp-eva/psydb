import React from 'react';

export const createBase = (options = {}) => {
    var Context = React.createContext();
    var Component = (ps) => {
        var { children, ...context } = ps;
        var { value, crtSettings, related } = context;
        if (!value) {
            throw new Error('value prop is required (db record)');
        }
        if (!crtSettings) {
            throw new Error('crtSettings prop is required');
        }
        if (!related) {
            throw new Error('related prop is required');
        }
        return (
            <Context.Provider value={ context }>
                { children }
            </Context.Provider>
        );
    }
    return [ Component, Context ];
}
