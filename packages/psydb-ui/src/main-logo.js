import React from 'react';
import { useUIConfig, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { Nav, LinkContainer } from '@mpieva/psydb-ui-layout';

const Link = ({
    to, ...pass
}) => (
    <a href={`#${to}`} className='nav-link' { ...pass } />
)

const TextColor = () => {
    var config = useUIConfig();
    var [ language ] = useUILanguage();

    var { logos, style } = config.branding.sidenav;

    return (
        <h2
            className='text-center pt-3 pb-1 m-0 border-left border-right bg-white'
            style={{ overflow: 'show' }}
        >
            <Link to='/' style={{ padding: '8px 16px' }}>
                <div style={{ overflow: 'show' }}>
                    <img
                        style={ style }
                        src={ logos[language] || logos.en } alt=''
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
