import React, { useEffect, useReducer } from 'react';

import {
    Button
} from 'react-bootstrap';

import { PencilFill, X } from 'react-bootstrap-icons';

const StudyTeamListItem = ({
    record,
    relatedRecordLabels,
    
    active,
    onClick,
    onEditClick,

    // FIXME: decide if obsolete
    onDeleteClick,
    enableDelete,
}) => {
    var cls = [
        'd-flex mb-3 border bg-white',
        'experiment-operator-team-list-item',
        ...(active ? ['active'] : []),
        ...(onClick ? ['hover'] : []),
    ].join(' ');

    return (
        <div
            className={ cls }
            onClick={ onClick && (() => onClick(record._id)) }
            role={ onClick ? 'button' : '' }
        >
            <div style={{
                width: '30px',
                background: record.state.color,
                border: `1px solid ${record.state.color}`,
            }}>
            </div>
            <div className='flex-grow p-3'>
                <div>
                    <b>{ record.state.name }</b>
                </div>
                <div>
                    <span className='d-inline-block pr-2'>Experimenter:</span>
                    {
                        record.state.personnelIds
                        .map(id => (
                            relatedRecordLabels.personnel[id]._recordLabel
                        ))
                        .join(', ')
                    }
                </div>

            </div>

            <div className='d-flex flex-column justify-content-between ml-2'>
                { onEditClick && (
                    <TeamEditButton
                        onClick={ () => onEditClick(record._id) }
                    />
                )}
                { enableDelete && (
                    <TeamDeleteButton
                        onDeleteClick={ () => onDeleteClick(record._id) }
                    />
                )}
            </div>
        </div>
    )
}

const TeamEditButton = ({
    onClick
}) => {
    return (
        <TeamButton
            className='bg-white border-left border-bottom'
            style={{ color: '#006066', borderRight: 0, borderTop: 0 }}
            onClick={ onClick }
        >
            <PencilFill style={{ marginTop: '-2px' }} />
        </TeamButton>
    )
}

const TeamDeleteButton = ({
    onClick
}) => {
    return (
        <TeamButton
            className='bg-white border-left border-top text-danger'
            style={{ borderRight: 0, borderBottom: 0 }}
            onClick={ onClick }
        >
            <X style={{ marginTop: '-2px', width: '18px', height: '18px' }} />
        </TeamButton>
    )
}

const TeamButton = ({
    onClick,
    className,
    style,
    children
}) => {
    
    var style = {
        padding: '.25rem .5rem',
        ...style
    }
    
    var allClassNames = [
        className
    ].join(' ')

    return (
        <button
            type='button'
            className={ allClassNames }
            style={ style }
            onClick={ onClick }
        >
            { children }
        </button>
    )
}

export default StudyTeamListItem;
