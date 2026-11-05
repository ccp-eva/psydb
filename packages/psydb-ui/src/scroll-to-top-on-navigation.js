import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

// NOTE: the browser keeps the scroll position when the hash route
// changes, so we reset it ourselves when navigating to another page;
// back/forward (POP) is left alone, and search-only changes
// (e.g. extended search tabs) are handled by the pages themselves
const ScrollToTopOnNavigation = () => {
    var history = useHistory();
    var { pathname } = useLocation();

    useEffect(() => {
        if (history.action !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [ pathname ]);

    return null;
}

export default ScrollToTopOnNavigation;
