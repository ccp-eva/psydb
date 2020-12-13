import * as React from 'react';
import { NeutralColors, Depths } from '@fluentui/theme';
import { Nav } from '@fluentui/react';

const navStyles = { 
    root: {
        width: 300,
        //paddingTop: 20,
        backgroundColor: NeutralColors.white,
        //boxShadow: Depths.depth8,
        borderBottom: '1px solid',
        borderRight: '1px solid',
        borderColor: NeutralColors.gray40,
    },
    link: {
        //paddingLeft: 200,
    },
    linkText: {
        //fontSize: 20,
        //color: 'red',
    }
};

const iconProps = (iconName) => ({
    iconName,
    style: {
        root: {
            //fontSize: 20,
            color: '#106ebe',
        }
    }
});

const navLinkGroups = [
    { links: [
        {
            name: 'Kalender',
            isExpanded: true,
            links: [
                {
                    key: 'reception-calendar',
                    name: 'Rezeption',
                    url: '#/examples/activityitem',
                    //iconProps: iconProps('CalendarWeek'),
                    iconProps: iconProps('Calendar'),
                },
                {
                    key: 'inhouse-calendar',
                    name: 'Inhouse Termine',
                    url: '#/examples/breadcrumb',
                    iconProps: iconProps('DateTime2'),
                },
                {
                    key: 'external-calendar',
                    name: 'Externe Termine',
                    url: '#/examples/button',
                    iconProps: iconProps('WorldClock'),
                },
            ],
        },

        {
            name: 'Terminverwaltung',
            links: [
                {
                    key: 'appointment-confirmation',
                    name: 'Bestätigung',
                    url: '#/examples/activityitem',
                    iconProps: iconProps('Accept'),
                },
                {
                    key: 'experiment-postprocessing',
                    name: 'Nachbereitung',
                    url: '#/examples/breadcrumb',
                    //iconProps: iconProps('Label'),
                    iconProps: iconProps('MultiSelectMirrored'),
                },
            ],
        },

        {
            name: 'Studien',
            url: '#/examples/breadcrumb',
            iconProps: iconProps('Trackers'),
            //onClick: () => { alert('clicked study') },
        },

    ]},
    
];

export const SideNav = () => {
    return (
        <Nav
            styles={navStyles}
            ariaLabel="Nav example similiar to one found in this demo page"
            groups={navLinkGroups}
        />
  );
};
