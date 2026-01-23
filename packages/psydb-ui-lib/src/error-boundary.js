import React from 'react';

class ErrorBoundary extends React.Component {
    constructor (ps) {
        super(ps);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render () {
        if (this.state.errorInfo) {
            return (
                <div
                    className="alert alert-danger"
                >
                    <h3>Something went wrong.</h3>
                    <div style={{
                        whiteSpace: 'pre-wrap',
                        paddingLeft: '20px',
                    }}>
                        <div style={{ borderTop: '1px solid #a94442', paddingTop: '5px', marginTop: '5px' }}>
                            <b>{this.state.error && this.state.error.toString()}</b>
                            {this.state.errorInfo.componentStack}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
