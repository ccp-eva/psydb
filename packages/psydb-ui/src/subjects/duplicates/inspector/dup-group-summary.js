import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid } from '@mpieva/psydb-ui-layout';

const DupGroupSummary = (ps) => {
    var { group } = ps;
    var { items, inspectedFields } = group;
    var [{ translate }] = useI18N();

    return (
        <Grid cols={[ '200px', '1fr' ]}>
            <b className='d-block'>
                { translate('Inspected Fields') }
            </b>
            <div className='d-flex gapx-3'>
                { inspectedFields.map((it, ix) => (
                    <span key={ ix }>
                        { translate.fieldDefinition(it) }
                    </span>
                )) }
            </div>
            <b className='d-block'>
                { translate('Possible Duplicates') }
            </b>
            <div className='d-flex gapx-3'>
                { items.map((it, ix) => (
                    <span key={ ix }>{ it._label }</span>
                )) }
            </div>
        </Grid>
    )
}

export default DupGroupSummary;
