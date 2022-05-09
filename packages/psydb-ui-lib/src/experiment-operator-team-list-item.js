import React, { useEffect, useReducer } from 'react';
import classnames from 'classnames';
import { Button, Icons } from '@mpieva/psydb-ui-layout';

const StudyTeamListItem = ({
    record,
    relatedRecordLabels,
    
    active,
    onClick,
    onEditClick,
    canEdit,

    // FIXME: decide if obsolete
    onDeleteClick,
    enableDelete,
}) => {
    var cls = classnames([
        'd-flex border',
        record.state.hidden ? 'bg-light' : 'bg-white',
        'experiment-operator-team-list-item',
        relatedRecordLabels ? 'mb-3' : 'mb-1',
        active && 'active',
        onClick && 'hover',
    ]);

    var textCls = classnames([
        'flex-grow',
        relatedRecordLabels ? 'p-3' : 'pl-3',
        record.state.hidden && 'text-grey'
    ]);

    return (
        <div
            className={ cls }
            onClick={ onClick && (() => onClick(record._id)) }
            role={ onClick ? 'button' : '' }
        >
            <div style={{
                flexShrink: 0,
                width: '30px',
                background: record.state.color,
                border: `1px solid ${record.state.color}`,
            }}>
            </div>
            <div 
                className={ textCls }
                style={relatedRecordLabels ? {} : {
                    paddingTop: '0.375rem',
                    paddingBottom: '0.375rem',
                }}
            >
                <div>
                    <b>{ record.state.name }</b>
                </div>
                { relatedRecordLabels && (
                    <div>
                        <span className='d-inline-block pr-2'>Experimenter:innen:</span>
                        {
                            record.state.personnelIds
                            .map(id => (
                                relatedRecordLabels.personnel[id]._recordLabel
                            ))
                            .join(', ')
                        }
                    </div>
                )}

            </div>

            <div className='d-flex flex-column justify-content-between ml-2'>
                { canEdit && onEditClick && (
                    <TeamEditButton
                        onClick={ () => onEditClick(record._id) }
                    />
                )}
                { enableDelete && (
                    <TeamDeleteButton
                        onClick={ () => onDeleteClick(record._id) }
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
            <Icons.PencilFill style={{ marginTop: '-2px' }} />
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
            <Icons.X style={{ marginTop: '-2px', width: '22px', height: '22px' }} />
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
