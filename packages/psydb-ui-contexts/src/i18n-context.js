import React, { useContext } from 'react';
export const I18NContext = React.createContext();
export const useI18N = () => useContext(I18NContext);
