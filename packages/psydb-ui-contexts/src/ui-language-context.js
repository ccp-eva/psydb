import React, { useContext } from 'react';
export const UILanguageContext = React.createContext();
export const useUILanguage = () => useContext(UILanguageContext);
