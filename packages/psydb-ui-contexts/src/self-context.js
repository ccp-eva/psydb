import React, { useContext } from 'react';
export const SelfContext = React.createContext();
export const useSelf = () => useContext(SelfContext);
