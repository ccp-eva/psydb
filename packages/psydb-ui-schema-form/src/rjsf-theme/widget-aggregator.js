import React from "react";

import * as widgets from './widgets';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';

const WidgetAggregator = (type) => {
    return (ps) => {
        var {
            schema,
        } = ps;

        // when that thing is a const and has a default value
        // dont render anything
        // if insufficient use Object.keys().inludes() or sth
        if (schema.const !== undefined && schema.default !== undefined) {
            return null;
        }

        const Widget = widgets[type] || Bootstrap4Theme.widgets[type];
        return (
            <Widget { ...ps } />
        )
    }
}

const allWidgets = Object.keys(Bootstrap4Theme.widgets).reduce(
    (acc, type) => ({
        ...acc,
        [type]: WidgetAggregator(type)
    }),
    { /* empty */ }
)

export default allWidgets;
