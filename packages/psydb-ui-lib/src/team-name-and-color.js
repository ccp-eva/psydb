import React from 'react';

const TeamNameAndColor = (ps) => {
    var { teamRecord, related, as = 'div', ...pass } = ps;
    var { name, color, personnelIds = [] } = teamRecord.state;

    // NOTE: when related is given we render the actual personnel labels
    // instead of the pregenerated team name
    var label = (
        related
        ? personnelIds.map(it => (
            related.records?.personnel?.[it]?._recordLabel || it
        )).join(', ')
        : name
    );

    var Wrapper = as;

    return (
        <Wrapper { ...pass }>
            <span className='d-inline-block mr-2' style={{
                backgroundColor: color,
                height: '24px',
                width: '24px',
                verticalAlign: 'bottom',
            }} />
            <span>{ label }</span>
        </Wrapper>
    );
}

export default TeamNameAndColor;
