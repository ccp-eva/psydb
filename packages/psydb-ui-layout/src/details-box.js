import React from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import LinkButton from './link-button';

const DetailsBox = (ps) => {
    var {
        title,
        children,
        
        canEdit,
        editLabel,
        editUrl,
        
        extraClassName,
        titleExtraClassName,

        onEditClick,
        isRecordHidden,
    } = ps;

    var className = classnames([
        'border pl-3 bg-light',
        extraClassName
    ])
    return (
        <div className={ className }>
            <Header
                title={ title }
                canEdit={ canEdit }
                editLabel={ editLabel }
                editUrl={ editUrl } 
                extraClassName={ titleExtraClassName }
                isRecordHidden={ isRecordHidden }
            />
            <hr />
            <div
                className='px-3 pb-3'
                style={ isRecordHidden ? { opacity: 0.5 } : {}}
            >
                { children }
            </div>
        </div>

    )
}

const Header = (ps) => {
    var translate = useUITranslation();

    var {
        title = translate('Record Details'),
        editLabel = translate('Edit'),

        canEdit,
        editUrl,
        onEditClick,

        extraClassName,
        isRecordHidden
    } = ps;

    var className = classnames([
        'd-flex justify-content-between align-items-start',
        extraClassName
    ]);

    return (
        <h5 className={ className }>
            <span className='d-inline-block pt-3'>
                { title }
                { isRecordHidden && (
                    <span className='d-inline-block text-muted ml-2'>
                        ({ translate('Hidden Record') })
                    </span>
                )}
            </span>
            { canEdit && editUrl && (
                <LinkButton to={ editUrl }>
                    { editLabel }
                </LinkButton>
            )}
            { canEdit && onEditClick && (
                <Button onClick={ onEditClick }>
                    { editLabel }
                </Button>
            )}
        </h5>
    )
}

export default DetailsBox;
