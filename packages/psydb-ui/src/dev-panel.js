import React from 'react';
import {
    useUIConfig,
    useMergeUIConfig,
} from '@mpieva/psydb-ui-contexts';

const DevPanel = (ps) => {
    var config = useUIConfig();

    return (
        <div className='border-left border-bottom bg-light p-3' style={{
            position: 'absolute',
            right: 0,
            zIndex: 500,
            minWidth: '225px',
        }}>
            <h5 className='text-danger mb-3'>
                <b>DEV Panel</b>
            </h5>
            <div className='d-flex flex-column'>
                <header>
                    <b>Branding</b>
                </header>
                
                <DevPanelButton values={{
                    '/branding': 'mpiccp',
                    '/disableLogoOverlay': false
                }} isActive={ config.branding === 'mpiccp'}>
                    MPI EVA
                </DevPanelButton>
                
                <DevPanelButton values={{
                    '/branding': 'sunwaywide',
                    '/disableLogoOverlay': true
                }} isActive={ config.branding === 'sunwaywide'}>
                    Sunway Logo Wide
                </DevPanelButton>
                
                <DevPanelButton values={{
                    '/branding': 'sunwayfull',
                    '/disableLogoOverlay': true
                }} isActive={ config.branding === 'sunwayfull'}>
                    Sunway Logo Full
                </DevPanelButton>

                <DevPanelButton values={{
                    '/branding': 'sunwayadapted',
                    '/disableLogoOverlay': true
                }} isActive={ config.branding === 'sunwayadapted'}>
                    Sunway Logo Adapted
                </DevPanelButton>

                <header className='mt-3'>
                    <b>Copy Notice Orb</b>
                </header>
                <DevPanelButton values={{
                    '/dev_copyNoticeGreyscale': true,
                }} isActive={ config.dev_copyNoticeGreyscale }>
                    Greyscale
                </DevPanelButton>
                <DevPanelButton values={{
                    '/dev_copyNoticeGreyscale': false,
                }} isActive={ !config.dev_copyNoticeGreyscale }>
                    Color
                </DevPanelButton>
            </div>
        </div>
    )
}

const DevPanelButton = (ps) => {
    var { values, isActive, children } = ps;
    var mergeUIConfig = useMergeUIConfig();
    return (
        <span
            role='button'
            className={ `text-primary ${isActive ? 'text-bold': ''}` }
            onClick={ () => mergeUIConfig(values) }
        >
            { children }
        </span>
    )
}

export default DevPanel;
