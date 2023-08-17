import React, { useContext } from 'react';
export const UILocaleContext = React.createContext();
export const useUILocale = () => useContext(UILocaleContext);
