import React from 'react';
import * as Icons from 'react-bootstrap-icons';
import { withIconButton } from './with-icon-button';

export { withIconButton };

export const LocationIconButton = withIconButton({
    Icon: Icons.HouseDoor,
    defaultTitle: 'Location'
});

export const StudyIconButton = withIconButton({
    Icon: Icons.ClipboardData,
    defaultTitle: 'Study'
});

export const ExperimentIconButton = withIconButton({
    Icon: Icons.CalendarDate,
    defaultTitle: 'Appointment'
});

export const SubjectIconButton = withIconButton({
    //Icon: Icons.PersonSquare,
    //defaultIconStyle: {
    //    width: '20px',
    //    height: '20px',
    //    marginTop: '0px'
    //}
    //Icon: Icons.Postcard,
    
    Icon: Icons.PersonVideo2,
    defaultTitle: 'Subject',
    defaultIconStyle: {
        width: '22px',
        height: '22px',
        marginTop: '2px'
    },
});

export const RemoveIconButtonInline = withIconButton({
    Icon: Icons.X,
    defaultTitle: 'Delete',
    defaultButtonProps: {
        size: 'sm',
        variant: 'outline-danger'
    },
    defaultButtonStyle: {
        marginTop: '-3px', // FIXME: in lists only
        borderRadius: '.2rem',
        border: 0,
    }
});

export const EditIconButtonInline = withIconButton({
    Icon: Icons.PencilFill,
    defaultTitle: 'Edit',
    defaultIconStyle: {
        width: '16px',
        height: '16px',
        marginTop: '-2px'
    },
});

export const ItemsIconButtonInline = withIconButton({
    Icon: Icons.List,
    defaultTitle: 'Items',
    defaultIconStyle: {
        width: '16px',
        height: '16px',
        marginTop: '-2px'
    },
});

