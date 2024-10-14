import logoDETextColor from './mp-logo-farbig-rgb.svg';
import logoENTextColor from './mp-logo-en-farbig-rgb.svg';

import logoHumankindDE from './humankind-logo-de.svg';

import logoSunwayWide from './sunway-logo-wide.svg';
import logoSunwayAdapted from './sunway-psydb.svg';

const cssvars = {
    mpiccp: {
        '--default-text': '#212529',

        '--primary': '#006c66',
        '--primary-btn-hover': '#007d77',
        '--primary-btn-disabled': '#006c66',
        '--primary-a-disabled': '#227e77',
        '--primary-a-hover': '#228e88',
        
        '--info-alert-text': '#0c5460',
        '--info-alert-bg': '#d1ecf1',
        '--info-alert-border': '#bee5eb',

        '--form-control-focus': '#779799',
        '--loader-base-color': '#006c6644',
        '--loader-highlight-color': '#006c66',
    },
    humankind: {
        // base    #80cbdd
        // light-1 #b0e4f0
        // light-2 #e4f8fd
        // dark-1  #57afc3
        // dark-2  #358da2
        '--default-text': '#212529',

        '--primary': '#57afc3',
        '--primary-btn-hover': '#358da2',
        '--primary-btn-disabled': '#42939e',
        '--primary-a-disabled': '#42939e',
        '--primary-a-hover': '#358da2',
        
        '--info-alert-text': '#57afc3',
        '--info-alert-bg': '#e4f8fd', // FIXME
        '--info-alert-border': '#c0e2e7', // FIXME

        '--form-control-focus': '#80cbdd',
        '--loader-base-color': '#57afc344',
        '--loader-highlight-color': '#57afc3',
    },
    humankind_zuhell: {
        // base    #80cbdd
        // light-1 #b0e4f0
        // light-2 #e4f8fd
        // dark-1  #57afc3
        // dark-2  #358da2
        '--default-text': '#212529',

        '--primary': '#80cbdd',
        '--primary-btn-hover': '#57afc3',
        '--primary-btn-disabled': '#42939e',
        '--primary-a-disabled': '#42939e',
        '--primary-a-hover': '#57afc3',
        
        '--info-alert-text': '#80cbdd',
        '--info-alert-bg': '#d6f1f5', // FIXME
        '--info-alert-border': '#c0e2e7', // FIXME

        '--form-control-focus': '#70b7c1',
        '--loader-base-color': '#80cbdd44',
        '--loader-highlight-color': '#80cbdd',
    },
    humankind_old: {
        // base    #2e919e
        // light-1 #42939e
        // light-2 #70b7c1
        // dark-1  #12717e
        // dark-2  #075863
        '--default-text': '#212529',

        '--primary': '#2e919e',
        '--primary-btn-hover': '#12717e',
        '--primary-btn-disabled': '#42939e',
        '--primary-a-disabled': '#42939e',
        '--primary-a-hover': '#12717e',
        
        '--info-alert-text': '#2e919e',
        '--info-alert-bg': '#d6f1f5', // FIXME
        '--info-alert-border': '#c0e2e7', // FIXME

        '--form-control-focus': '#70b7c1',
        '--loader-base-color': '#2e919e44',
        '--loader-highlight-color': '#2e919e',
    },
    sunway: {
        '--default-text': '#000',

        //'--primary': '#1c3a69',
        '--primary': '#003572',
        '--primary-btn-disabled': '#89a3ca',
        '--primary-btn-hover': '#254b89',
        '--primary-a-disabled': '#89a3ca',
        '--primary-a-hover': '#254b89',
        
        '--info-alert-text': '#254b89',
        '--info-alert-bg': '#d9e1f1',
        '--info-alert-border': '#c7d3e6',
        
        '--form-control-focus': '#89a3ca',
        '--loader-base-color': '#00357244',
        '--loader-highlight-color': '#003572',
    },
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
                marginTop: '-30px',
                marginRight: '-20px',
                marginBottom: '-25px',
                marginLeft: '-20px',
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
    humankind: {
        cssvars: cssvars.humankind,
        landing: {
            logos: { 'en': logoHumankindDE },
            style: {
                width: '500px',
                padding: '10px 30px',
            }
        },
        sidenav: {
            logos: { 'en': logoHumankindDE },
            style: {
                width: '193px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
                marginTop: '-10px'
            }
        }
    },
    sunway: {
        cssvars: cssvars.sunway,
        landing: {
            logos: { 'en': logoSunwayWide },
            style: { width: '500px', marginBottom: '15px' }
        },
        sidenav: {
            logos: { 'en': logoSunwayAdapted },
            style: { width: '193px', margin: '-15px 0 10px 0' }
        }
    },
}

export default branding;
