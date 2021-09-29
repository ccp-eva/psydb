import { useCallback } from 'react';

const useCallbackMaybe = (callback, updateProps = []) => (
    useCallback((...args) => (
        callback && callback(...args)
    ), [ callback, ...updateProps ])
);

export default useCallbackMaybe;
