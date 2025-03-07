import React from 'react';

const withTriggers = () => (NextComponent) => {
    var WithTriggers = (ps) => {
        var { query, updateQuery, selection, revision } = ps;
        
        var onSuccessfulMerge = ({ mergedId }) => {
            var next = [];
            for (var it of selection.state.items) {
                if (it._id !== mergedId) {
                    next.push(it)
                }
            }
            
            updateQuery({ ...query, items: next }, { action: 'replace' });
            selection.dispatch({ type: 'set-items', payload: next });
            revision.up();
            window.scrollTo(0, 0);
        };

        
        var bag = { onSuccessfulMerge };
        return <NextComponent { ...ps } { ...bag } />
    }
     
    return WithTriggers;
}

export default withTriggers;
