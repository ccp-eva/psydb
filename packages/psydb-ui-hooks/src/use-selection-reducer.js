import { useReducer, useCallback, useMemo } from 'react';

const useSelectionReducer = (options = {}) => {
    var {
        defaultSelection: selected = [],
        //unique,
        checkEqual,
    } = options;

    var reducer = useMemo(() => (
        createReducer({ checkEqual })
    ), [ checkEqual ]);

    var [ state, dispatch ] = useReducer(reducer, { selected });
    var { selected } = state;

    var handleSet = useCallback((payload) => {
        dispatch({ type: 'set', payload });
    }, [])
    var handleAdd = useCallback((payload) => {
        dispatch({ type: 'add', payload });
    }, []);
    var handleRemove = useCallback((payload) => {
        dispatch({ type: 'remove', payload });
    }, []);

    return {
        value: selected,
        set: handleSet,
        add: handleAdd,
        remove: handleRemove
    }
}

const createReducer = (options) => {
    var {
        //unique,
        checkEqual
    } = options;
    if (checkEqual === undefined) {
        checkEqual = (existingItem, payloadItem) => (
            existingItem === payloadItem
        )
    }
    if (typeof checkEqual !== 'function') {
        throw new Error('option "checkEqual" must be a function');
    }

    return (state, action) => {
        var { type, payload } = action;
        payload = arrify(payload);

        switch (type) {
            case 'set':
                return ({
                    ...state,
                    selected: payload
                });
            case 'add':
                var nextSelected = [
                    ...state.selected,
                    ...payload,
                ];
                return ({
                    ...state,
                    selected: nextSelected
                });
            case 'remove':
                var nextSelected = without({
                    that: state.selected,
                    without: payload,
                    checkEqual
                });
                return ({
                    ...state,
                    selected: nextSelected
                })
        }
    }
}

const arrify = (value) => (
    Array.isArray(value) ? value : [ value ]
);

const without = ({ that: listA, without: listB, checkEqual }) => {
    var filtered = [];
    for (var a of listA) {
        var found = false;
        for (var b of listB) {
            if (checkEqual(a, b)) {
                found = true;
                break;
            }
        }
        if (!found) {
            filtered.push(a);
        }
    }
    return filtered;
}

/*const intersect = (listA, listB, checkEqual) => {
    // FIXME: this implementation does wierd things when
    // one of the lists contains duplicates
    var filtered = [];
    for (var a of listA) {
        for (var b of listB) {
            if (checkEqual(a, b)) {
                filtered.push(a);
            }
        }
    }
    return filtered;
}*/

export default useSelectionReducer;
