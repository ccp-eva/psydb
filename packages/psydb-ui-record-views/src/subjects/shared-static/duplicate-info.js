import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid, PaddedText } from '@mpieva/psydb-ui-layout';

const DuplicateInfo = (ps) => {
    var {
        mergedDuplicates, showSequenceNumber, showOnlineId,
        cols = [ '1fr', '3fr' ], className = 'px-3'
    } = ps;

    var [{ translate }] = useI18N();

    if (mergedDuplicates.length < 1) {
        return null;
    }
    if (!showSequenceNumber && !showOnlineId) {
        return null
    }

    return (
        <Grid 
            label={ translate('Duplicates') }
            cols={ cols }
            className={ className }
        >
            <PaddedText>{ translate('Duplicates') }</PaddedText>
            <PaddedText>
                { mergedDuplicates.map((it, ix) => (
                    <Grid 
                        key={ ix } cols={[ '150px', '1fr' ]}
                        className={ 'border bg-white px-3 py-1' + (
                            ix === 0 ? '' : ' mt-2'
                        )}
                    >
                        <span>{ translate('ID No.') }</span>
                        <span>{ it.sequenceNumber }</span>
                        <span>{ translate('Online ID Code') }</span>
                        <span>{ it.onlineId }</span>
                    </Grid>
                ))}
            </PaddedText>
        </Grid>
    )
}

export default DuplicateInfo;
