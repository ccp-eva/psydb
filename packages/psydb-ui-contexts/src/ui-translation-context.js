import React, { useContext } from 'react';
export const UITranslationContext = React.createContext();
export const useUITranslation = () => useContext(UITranslationContext);
