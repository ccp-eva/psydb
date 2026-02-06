import React from 'react';
import {
    useUIConfig,
    useMergeUIConfig,
} from '@mpieva/psydb-ui-contexts';

const DevPanel = (ps) => {
    var config = useUIConfig();

    return (
        <div
            className='border border-right-0 bg-light border-danger p-3'
            style={{
                position: 'fixed',
                right: 0,
                zIndex: 500,
                width: '225px',
                top: '50%',
                transform: 'translate(0, -50%)'
            }}
        >
            <h5 className='text-danger mb-1'>
                <b>DEV Panel</b>
            </h5>
            <p className='text-danger text-small'>
                This exists only for testing purposes
                and will be removed again.
            </p>
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
