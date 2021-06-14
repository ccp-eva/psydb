import React, { useState } from 'react';

import {
    Button
} from 'react-bootstrap';

const GeneralFunctions = ({
    experimentData,
    studyData
}) => {
    return (
        <>
            <Button size='sm' className='mr-3'>
                Team ändern
            </Button>
            <Button size='sm'>
                Verschieben
            </Button>
        </>
    );
}

export default GeneralFunctions;
