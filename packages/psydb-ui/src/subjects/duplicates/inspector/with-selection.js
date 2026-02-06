import React, { useReducer } from 'react';
import { without } from '@mpieva/psydb-core-utils';

const withSelection = () => (NextComponent) => {
    var WithSelection = (ps) => {
        var { query } = ps;
        
        var { items: queryItems } = query;
        var [ state, dispatch ] = useReducer(reducer, {
            items: queryItems,
            leftId: queryItems[0]?._id,
            rightId: queryItems[1]?._id 
        });

        var { items, leftId, rightId } = state;

        var left = [
            leftId, (id) => dispatch({ type: 'set-left', payload: id })
        ];
        var right = [
            rightId, (id) => dispatch({ type: 'set-right', payload: id })
        ];

        var selection = { state, dispatch, left, right };
        var bag = { selection };
        return <NextComponent { ...ps } { ...bag } />
    }
    
    return WithSelection;
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'set-left':
            return { ...state, leftId: payload };
        case 'set-right':
            return { ...state, rightId: payload };
        case 'set-items':
            var { leftId, rightId } = state;

            var next = { ...state, items: payload };
            var ids = payload.map(it => it._id);

            if (!ids.includes(state.leftId)) {
                next.leftId = without(ids, rightId)[0];
            }
            if (!ids.includes(state.rightId)) {
                next.rightId = without(ids, leftId)[0];
            }
            return next;
    }
}

export default withSelection;
