import React from 'react';
import { useUIConfig, useUILanguage } from '@mpieva/psydb-ui-contexts';

//import logoDETextColor from '../mp-logo-farbig-rgb.svg';
//import logoENTextColor from '../mp-logo-en-farbig-rgb.svg';
import logoDETextColor from '../sunway-logo-wide.svg';
import logoENTextColor from '../sunway-logo-wide.svg';

import logoSunwayWide from '../sunway-logo-wide.svg';
import logoSunwayFull from '../sunway-logo-full.svg';
import logoSunwayAdapted from '../sunway-psydb.svg';

const logosByLanguage = {
    'en': logoENTextColor,
    'de': logoDETextColor,
}

var logos = {
    mpiccp: {
        'en': logoENTextColor,
        'de': logoDETextColor,
    },
    sunwaywide: {
        'en': logoSunwayWide,
        'de': logoSunwayWide,
    },
    sunwayfull: {
        'en': logoSunwayFull,
        'de': logoSunwayFull,
    },
    sunwayadapted: {
        'en': logoSunwayAdapted,
        'de': logoSunwayAdapted,
    }
}

var styles = {
    mpiccp: {
        marginLeft: '-20px',
        marginRight: '-20px',
        marginTop: '-30px',
        marginBottom: '-25px',
    },
    sunwayadapted: {
        width: '500px',
        marginBottom: '-10px',
    },
    sunwayfull: {
        width: '400px',
        marginLeft: '50px',
        marginBottom: '15px',
    },
    sunwaywide: {
        width: '500px',
        marginBottom: '15px',
    },
}

const LogoImage = (ps) => {
    var config = useUIConfig();
    var [ language ] = useUILanguage();
    var design = config.whitelabelDesign || 'mpiccp';
    return (
        <img
            style={ styles[design] }
            src={ logos[design][language] } alt=''
        />
    )
}

export default LogoImage;
