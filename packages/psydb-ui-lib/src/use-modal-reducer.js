import { useReducer, useCallback } from 'react';

const useModalReducer = (defaults) => {
    var [ state, dispatch ] = useReducer(reducer, defaults || {});
    var {
        show,
        data
    } = state;

    var handleShow = useCallback((payload) => (
        dispatch({ type: 'show-modal', payload })
    ), []);
    var handleHide = useCallback(() => (
        dispatch({ type: 'hide-modal' })
    ), []);

    return {
        show,
        data,
        handleShow,
        handleHide
    }
}

var reducer = (state, action) => {
    var { type, payload } = action;
    console.log(action);
    switch (type) {
        case 'show-modal':
            return {
                ...state,
                show: true,
                data: payload
            }
        case 'hide-modal':
            return {
                ...state,
                show: false,
            }
    }
}

export default useModalReducer;
