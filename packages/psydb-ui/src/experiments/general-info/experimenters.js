import React from 'react';

const Experimenters = (ps) => {
    var { ids, related } = ps;
    return (
        <span>
            { ids.map(it => (
                related?.records?.personnel?.[it]?._recordLabel || it
            )).join(', ') }
        </span>
    );
}

export default Experimenters;
