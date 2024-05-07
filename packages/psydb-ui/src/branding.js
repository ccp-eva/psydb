import logoDETextColor from './mp-logo-farbig-rgb.svg';
import logoENTextColor from './mp-logo-en-farbig-rgb.svg';

import logoSunwayWide from './sunway-logo-wide.svg';
import logoSunwayFull from './sunway-logo-full.svg';
import logoSunwayAdapted from './sunway-psydb.svg';

const cssvars = {
    mpiccp: {
        '--default-text': '#212529',

        '--primary': '#006c66',
        '--primary-btn-hover': '#007d77',
        '--primary-a-disabled': '#227e77',
        '--primary-a-hover': '#228e88',
        
        '--info-alert-text': '#0c5460',
        '--info-alert-bg': '#d1ecf1',
        '--info-alert-border': '#bee5eb',

        '--form-control-focus': '#779799',
        '--loader-base-color': '#006c6644',
        '--loader-highlight-color': '#006c66',
    },
    sunway: {
        '--default-text': '#000',

        //'--primary': '#1c3a69',
        '--primary': '#003572',
        '--primary-btn-hover': '#254b89',
        '--primary-a-disabled': '#89a3ca',
        '--primary-a-hover': '#254b89',
        
        '--info-alert-text': '#254b89',
        '--info-alert-bg': '#d9e1f1',
        '--info-alert-border': '#c7d3e6',
        
        '--form-control-focus': '#89a3ca',
        
        '--loader-base-color': '#00357244',
        '--loader-highlight-color': '#003572',
    }
}

const branding = {
    mpiccp: {
        cssvars: cssvars.mpiccp,
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
        cssvars: cssvars.sunway,
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
        cssvars: cssvars.sunway,
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
        cssvars: cssvars.sunway,
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
