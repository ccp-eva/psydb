import React from 'react';
import {
    SplitPartitioned,
} from '@mpieva/psydb-ui-layout';

export const OpsList = (ps) => {
    var { title, ops, related, ...pass } = ps;
    return (
        <div { ...pass }>
            { title && (
                <header className='border-bottom pb-1 mb-1'>
                    <b>{ title }</b>
                </header>
            )}
            { ops.map((it, ix) => (
                <OpsItem
                    key={ ix }
                    index={ ix }
                    { ...it }
                    related={ related }
                />
            ))}
        </div>
    )
}

const OpsItem = (ps) => {
    var { index, op, collection, args, related } = ps;

    var { _id } = args[0];
    var label = related[collection] ? related[collection][_id] : '-';
    var href = {
        'subject': `/#/subjects/${_id}`,
        'experiment': `/#/experiments/${_id}`,
    }[collection];

    return (
        <SplitPartitioned partitions={[ 1,1,2,4,3,1 ]}>
            <b>{ index } </b>
            <span>{ op }</span>
            <span>{ collection }</span>
            <span>{ label }</span>
            { href ? (
                <a href={ href } target='_blank'>
                    { _id }
                </a>
            ) : (
                <span>{ _id }</span>
            )}
            { href ? (
                <a
                    href={ 'https://psydb.eva.mpg.de'+ href }
                    target='_blank'
                >
                    -> PsyDB
                </a>
            ) : <i /> }
        </SplitPartitioned>
    )
}
