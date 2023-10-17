import React, { useContext } from 'react';
export const AgentContext = React.createContext();
export const useRequestAgent = () => useContext(AgentContext);
