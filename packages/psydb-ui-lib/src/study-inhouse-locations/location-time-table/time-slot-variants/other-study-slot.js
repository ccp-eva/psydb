import React from 'react';

const OtherStudySlot = (ps) => {
    var { studyLabel } = ps;
    return (
        <div
            className='text-center text-grey m-1 border'
            style={{
                height: '26px',
            }}
        ><b>{ studyLabel }</b></div>
    )
}

export default OtherStudySlot;
