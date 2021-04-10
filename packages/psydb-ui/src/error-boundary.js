import React from 'react';

class ErrorBoundary extends React.Component {
    constructor (ps) {
        super(ps);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError (error) {
        return { hasError: true };
    }

    render () {
        if (this.state.hasError) {
            // TODO ErrorDisplayer
            return (
                <h1>Somehing went Wrong</h1>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
