import { useReducer, useCallback } from 'react';

const usePaginationReducer = (initial) => {
    var [ state, dispatch ] = useReducer(reducer, {
        offset: 0,
        limit: 100,
        ...initial
    });

    var {
        offset,
        limit,
        total,
        page,
        maxPage,
    } = state;

    page = page || 0;
    maxPage = maxPage || 0;

    var setTotal = useCallback((nextTotal) => (
        dispatch({ type: 'set-total', payload: nextTotal })
    ))

    var setLimit = useCallback((nextLimit) => (
        dispatch({ type: 'set-limit', payload: nextLimit })
    ))

    var selectNextPage = useCallback(() => (
        (offset + limit) < total && (
            dispatch({ type: 'set-offset', payload: offset + limit })
        )
    ))

    var selectPrevPage = useCallback(() => (
        (offset - limit) >= 0
        ? dispatch({ type: 'set-offset', payload: offset - limit })
        : dispatch({ type: 'set-offset', payload: 0 })
    ))

    var selectSpecificPage = useCallback((nextPage) => (
        dispatch({ type: 'set-offset', payload: limit * nextPage })
    ))

    return {
        offset,
        limit,
        total,

        page,
        maxPage,

        setTotal,
        setLimit,
        selectNextPage,
        selectPrevPage,
        selectSpecificPage,
    };
}

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'set-total':
            return {
                ...state,
                total: payload,
                maxPage: Math.ceil(payload / state.limit)
            }
        case 'set-limit':
            var limit = payload;
            var offset = state.offset;
            if (limit >= state.total) {
                offset = 0;
            }
            return {
                ...state,
                limit,
                offset,
                page: Math.floor(offset / limit),
                maxPage: Math.ceil(state.total / limit)
            }
        case 'set-offset':
            return {
                ...state,
                offset: payload,
                page: Math.floor(payload / state.limit),
            }
    }
}

export default usePaginationReducer;
