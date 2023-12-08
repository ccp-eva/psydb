import React from 'react';
import { Label125 } from './label-125';

export const UpdateSummary = (ps) => {
    var { update, href } = ps;
    var {
        _id: updateId, source,
        correlationId, isOnlineSurvey,
        timestamp
    } = update;

    return (
        <div>
            <Label125 text='Update ID' />
            { href ? (
                <a href={ href } target='_blank'>
                    { updateId }
                </a>
            ) : (
                <span>{ updateId }</span>
            ) }
            <br />
            <Label125 text='Correlation ID' />{ correlationId }<br />
            <Label125 text='Timestamp' />{ timestamp }<br />
            { isOnlineSurvey && (
                <b className='d-block mt-3'>Is Online-Survey</b>
            )}
        </div>
    )
}
