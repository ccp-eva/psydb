import React from 'react';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';

import logoDETextColor from '../mp-logo-farbig-rgb.svg';
import logoENTextColor from '../mp-logo-en-farbig-rgb.svg';

const logosByLanguage = {
    'en': logoENTextColor,
    'de': logoDETextColor,
}

const LogoImage = (ps) => {
    var [ language ] = useUILanguage();
    return (
        <img
            style={{
                marginLeft: '-20px',
                marginRight: '-20px',
                marginTop: '-30px',
                //marginBottom: '-20px',
                marginBottom: '-25px',
            }}
            src={ logosByLanguage[language] } alt=''
        />
    )
}

export default LogoImage;
