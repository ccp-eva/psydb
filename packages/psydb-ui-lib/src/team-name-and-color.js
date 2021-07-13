import React from 'react';

const TeamNameAndColor = ({
    teamRecord
}) => {
    var { name, color } = teamRecord.state;

    return (
        <>
            <span className='d-inline-block mr-2' style={{
                backgroundColor: color,
                height: '24px',
                width: '24px',
                verticalAlign: 'bottom',
            }} />
            <span>{ name }</span>
        </>
    );
}

export default TeamNameAndColor;
