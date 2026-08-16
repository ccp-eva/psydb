import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useToggleReducer } from '@mpieva/psydb-ui-hooks';
import { Grid, Button } from '@mpieva/psydb-ui-layout';


const CSVFieldInfo = (ps) => {
    var [{ translate }] = useI18N();
    var [ isOpen, toggleOpen ] = useToggleReducer(false);
    
    var toggleBag = { isOpen, toggleOpen };
    
    return (
        <div>
            <Toggler { ...toggleBag }/>
            { isOpen && (
                <div className='px-3 py-2 bg-white border mb-3'>
                    <Grid cols={[ '15px', '270px', '270px', '1fr' ]}>
                        <AllColInfos />
                    </Grid>
                </div>
            )}
        </div>
    )
}

const AllColInfos = (ps) => {
    return (
        <>
            <ColInfo
                csvkey='date' example='2001-12-20'
                description='(required)'
                isRequired
            />
            <ColInfo
                csvkey='time' example='16:30'
                description='(required)'
                isRequired
            />
            <ColInfo
                csvkey='location' example='1234'
                description='ID No. of location record (required)'
                isRequired
            />
            <ColInfo
                csvkey='subject' example='2345'
                description='ID No. of subject record (required)'
                isRequired
            />
            <ColInfo
                csvkey='experimenter' example='3456'
                description='ID No. of staff member (required)'
                isRequired
            />
            <ColInfo
                csvkey='comment' example='some comment'
                description='(column/value optional)'
            />
        </>
    )
}

const ColInfo = (ps) => {
    var { csvkey, example, description, isRequired } = ps;

    return (
        <>
            <b>{ isRequired ? ' *' : ''}</b>
            <b>{ csvkey }</b>
            <span>{ example }</span>
            <i>{ description }</i>
        </>
    )
}

const Toggler = (ps) => {
    var { isOpen, toggleOpen } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <div className='d-flex justify-content-end'>
            <Button variant='link' onClick={ toggleOpen }>
                { isOpen ? (
                    translate('Hide Available Columns')
                ) : (
                    translate('Show Available Columns')
                )}
            </Button>
        </div>
    )
}

export default CSVFieldInfo;
