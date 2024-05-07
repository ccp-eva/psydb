import logoDETextColor from './mp-logo-farbig-rgb.svg';
import logoENTextColor from './mp-logo-en-farbig-rgb.svg';

import logoSunwayWide from './sunway-logo-wide.svg';
import logoSunwayFull from './sunway-logo-full.svg';
import logoSunwayAdapted from './sunway-psydb.svg';

const branding = {
    mpiccp: {
        landing: {
            logos: {
                'en': logoENTextColor,
                'de': logoDETextColor,
            },
            style: {
                marginLeft: '-20px',
                marginRight: '-20px',
                marginTop: '-30px',
                marginBottom: '-25px',
            }
        },
        sidenav: {
            logos: {
                'en': logoENTextColor,
                'de': logoDETextColor,
            },
            style: {
                marginLeft: '-20px',
                marginRight: '-20px',
                marginTop: '-20px',
            }
        }
    },
    sunwayadapted: {
        landing: {
            logos: { 'en': logoSunwayAdapted },
            style: {
                width: '500px',
                marginBottom: '-10px',
            }
        },
        sidenav: {
            logos: { 'en': logoSunwayAdapted },
            style: {
                width: '193px',
                marginBottom: '10px',
                marginTop: '-15px',
            }
        }
    },
    sunwayfull: {
        landing: {
            logos: { 'en': logoSunwayFull },
            style: {
                width: '400px',
                marginLeft: '50px',
                marginBottom: '15px',
            }
        },
        sidenav: {
            logos: { 'en': logoSunwayFull },
            style: {
                width: '193px',
                marginBottom: '10px',
                marginTop: '-15px',
            }
        }
    },
    sunwaywide: {
        landing: {
            logos: { 'en': logoSunwayWide },
            style: {
                width: '500px',
                marginBottom: '15px',
            }
        },
        sidenav: {
            logos: { 'en': logoSunwayFull },
            style: {
                width: '193px',
                marginBottom: '10px',
                marginTop: '-15px',
            }
        }
    },
}

export default branding;
