import React, { useContext } from 'react';
export const UIConfigContext = React.createContext();
export const useUIConfig = () => useContext(UIConfigContext);
