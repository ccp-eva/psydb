import React from 'react';

const withTriggers = () => (NextComponent) => {
    var WithTriggers = (ps) => {
        var {
            query, updateQuery, selection,
            fullRevision, subjectRevision
        } = ps;

        var fullUpdate = (updatedId) => {
            var next = [];
            for (var it of selection.state.items) {
                if (it._id !== updatedId) {
                    next.push(it)
                }
            }
            
            updateQuery({ ...query, items: next }, { action: 'replace' });
            selection.dispatch({ type: 'set-items', payload: next });
            fullRevision.up();
            window.scrollTo(0, 0);
        }

        var onSuccessfulMerge = ({ mergedId }) => fullUpdate(mergedId);
        var onSuccessfulRemove = ({ removedId }) => fullUpdate(removedId);

        var onSuccessfulMark = subjectRevision.up;
        var onSuccessfulUnmark = subjectRevision.up;
        var onSuccessfulEdit = subjectRevision.up;
        
        var bag = {
            onSuccessfulMerge, onSuccessfulRemove,
            onSuccessfulMark, onSuccessfulUnmark,
            onSuccessfulEdit,
        };
        return <NextComponent { ...ps } { ...bag } />
    }
     
    return WithTriggers;
}

export default withTriggers;
