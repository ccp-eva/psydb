import React from 'react';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
import { Nav, LinkContainer } from '@mpieva/psydb-ui-layout';

//import logoOrb from './ccp-orb.svg';
//import logoOrgWireframe from './ccp-orb-monochrome-white.svg';
//import logoTextMono from './mp-logo-graustufen-negativ-rgb.svg';

import logoDETextColor from './mp-logo-farbig-rgb.svg';
import logoENTextColor from './mp-logo-en-farbig-rgb.svg';

const logosByLanguage = {
    'en': logoENTextColor,
    'de': logoDETextColor,
}

const Link = ({
    to,
    className,
    children
}) => (
    <LinkContainer to={ to }>
        <Nav.Link className={ className }>{ children }</Nav.Link>
    </LinkContainer>
)

const TextColor = () => {
    var [ language ] = useUILanguage();
    return (
        <h2
            className='text-center pt-3 pb-1 m-0 border-left border-right bg-white'
            style={{ overflow: 'hidden' }}
        >
            <Link to='/'>
                <div style={{ overflow: 'hidden' }}>
                    <img
                        style={{
                            marginLeft: '-20px',
                            marginRight: '-20px',
                            marginTop: '-20px',
                            //marginBottom: '-20px',
                        }}
                        src={ logosByLanguage[language] } alt=''
                    />
                    <div
                        className='border-top pt-2'
                        style={{ fontSize: '1.3rem' }}
                    >
                        <b>PsyDB</b>
                    </div>
                </div>
            </Link>
        </h2>
    );
}

//const TextMono = () => {
//    return (
//        <h2
//            className='text-center pt-3 pb-1 m-0'
//            style={{ background: '#006c66'}}
//        >
//            <Link to='/'>
//                <div style={{ overflow: 'hidden' }}>
//                    <img
//                        style={{
//                            marginLeft: '-20px',
//                            marginRight: '-20px',
//                            marginTop: '-20px',
//                            //marginBottom: '-20px',
//                        }}
//                        src={ logoTextMono } alt=''
//                    />
//                    <div
//                        className='pt-2'
//                        style={{
//                            fontSize: '1.3rem', color: 'white',
//                            borderTop: '1px solid white'
//                        }}
//                    >
//                        <b>PsyDB</b>
//                    </div>
//                </div>
//            </Link>
//        </h2>
//    );
//}

export default TextColor;
