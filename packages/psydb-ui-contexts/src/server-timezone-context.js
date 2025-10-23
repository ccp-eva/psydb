// NOTE: this is currently unused but was used in
// date-only-server-side field
import React, { useContext } from 'react';
export const ServerTimezoneContext = React.createContext(0); // FIXME: 0?
export const useServerTimezone = () => useContext(ServerTimezoneContext);
