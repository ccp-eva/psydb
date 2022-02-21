import React, { useContext } from 'react';
import * as FallbackTheme from './fallback-theme';
const ThemeContext = React.createContext();

export const ThemeProvider = (ps) => {
    var { value, children } = ps;
    if (!value) {
        console.warn('no data-viewer theme given, using fallback');
        value = FallbackTheme;
    }
    return (
        <ThemeContext.Provider value={ value }>
            { children }
        </ThemeContext.Provider>
    )
}

export const useThemeContext = (ps) => {
    return useContext(ThemeContext);
}
