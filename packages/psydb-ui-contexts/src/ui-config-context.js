import React, { useContext, useState } from 'react';
import { entries, jsonpointer } from '@mpieva/psydb-core-utils';

export const UIConfigContext = React.createContext();

const OriginalProvider = UIConfigContext.Provider;
UIConfigContext.Provider = (ps) => {
    var { value: initialValue, children } = ps;
    var [ config, setConfig ] = useState(initialValue);

    var setValues = (those) => {
        var nextConfig = { ...config };
        for (var [ pointer, override ] of entries(those)) {
            jsonpointer.set(nextConfig, pointer, override)
        }
        setConfig(nextConfig);
    }

    return (
        <OriginalProvider value={[ config, setValues ]}>
            { children }
        </OriginalProvider>
    )
}

export const useUIConfig = () => {
    var [ config ] = useContext(UIConfigContext);
    return config;
};

export const useMergeUIConfig = () => {
    var [ config, setValues ] = useContext(UIConfigContext);
    return setValues;
}
