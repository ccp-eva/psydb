import React from 'react';
import * as Icons from 'react-bootstrap-icons';
import { withIconButton } from './with-icon-button';

export { withIconButton };

export const StudyIconButton = withIconButton({
    Icon: Icons.ClipboardData,
    defaultTitle: 'zur Studie'
});

export const ExperimentIconButton = withIconButton({
    Icon: Icons.CalendarDate,
    defaultTitle: 'zum Termin'
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
    defaultTitle: 'zur Proband:in',
    defaultIconStyle: {
        width: '22px',
        height: '22px',
        marginTop: '2px'
    },
});

export const RemoveIconButtonInline = withIconButton({
    Icon: Icons.X,
    defaultTitle: 'Löschen',
    defaultButtonProps: {
        size: 'sm',
        variant: 'outline-danger'
    },
});

export const EditIconButtonInline = withIconButton({
    Icon: Icons.PencilFill,
    defaultTitle: 'Bearbeiten',
    defaultIconStyle: {
        width: '16px',
        height: '16px',
        marginTop: '-2px'
    },
});

