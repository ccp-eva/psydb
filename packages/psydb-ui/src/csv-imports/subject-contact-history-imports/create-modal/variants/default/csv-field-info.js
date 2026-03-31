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
                    <Grid cols={[ '15px', '270px', '1fr' ]}>
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
            <ColInfo csvkey='subjectId' example='1, 2, 3 ...' isRequired />
            <ColInfo csvkey='contactType' example='email, phone' isRequired />
            <ColInfo csvkey='date' example='2001-12-20' isRequired />
            <ColInfo csvkey='time' example='16:30' isRequired />
            <ColInfo csvkey='comment' example='some comment'/>
        </>
    )
}

const ColInfo = (ps) => {
    var { csvkey, example, isRequired } = ps;

    return (
        <>
            <b>{ isRequired ? ' *' : ''}</b>
            <b>{ csvkey }</b>
            <span>{ example }</span>
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
