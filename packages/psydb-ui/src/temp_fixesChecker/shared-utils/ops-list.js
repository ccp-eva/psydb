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
    var { index, op, collection, args, event, related } = ps;

    var { _id } = args[0];

    var targetCollection = (
        event
        ? event.collectionName
        : collection
    );
    var targetChannelId = (
        event
        ? event.channelId
        : _id
    );

    var label = (
        related[targetCollection]
        ? related[targetCollection][targetChannelId]
        : '-'
    );

    var href = {
        'subject': `/#/subjects/${targetChannelId}`,
        'experiment': `/#/experiments/${targetChannelId}`,
    }[targetCollection];

    var psydb = 'https://psydb.eva.mpg.de'

    return (
        <SplitPartitioned partitions={[ 3,10,15,50,40 ]}>
            <b>{ index } </b>
            <span>{ op }</span>
            <span>{ collection }</span>
            { href ? (
                <SplitPartitioned partitions={[ 12, 8 ]}>
                    <a href={ href } target='_blank'>
                        { label }
                    </a>
                    <a href={ psydb + href } target='_blank'>
                        <b>(original)</b>
                    </a>
                </SplitPartitioned>
            ) : (
                <span>{ label }</span>
            )}
            { collection === 'rohrpostEvents' ? (
                <SplitPartitioned partitions={[ 12, 8 ]}>
                    <a href={`/#/rohrpost-events/${_id}`} target='_blank'>
                        { _id }
                    </a>
                    <a href={`${psydb}/#/rohrpost-events/${_id}`} target='_blank'>
                        <b>(original)</b>
                    </a>
                </SplitPartitioned>
            ) : (
                <span>{ _id }</span>
            ) }
        </SplitPartitioned>
    )
}
