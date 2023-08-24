import React from 'react';

const TeamNameAndColor = (ps) => {
    var { teamRecord, as = 'div', ...pass } = ps;
    var { name, color } = teamRecord.state;

    var Wrapper = as;

    return (
        <Wrapper { ...pass }>
            <span className='d-inline-block mr-2' style={{
                backgroundColor: color,
                height: '24px',
                width: '24px',
                verticalAlign: 'bottom',
            }} />
            <span>{ name }</span>
        </Wrapper>
    );
}

export default TeamNameAndColor;
