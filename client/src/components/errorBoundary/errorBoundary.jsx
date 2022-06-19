/**
 * https://blog.openreplay.com/catching-errors-in-react-with-error-boundaries
 */

import React, { Component } from 'react';

/**
 * Catch all React components errors and prevent application crashes
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    };
  }

  static getDerivedStateFromError(error) {
    if (error) {
      return {
        hasError: true,
      };
    }
  }

  // Catch errors in any components below and re-render with error message
  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Catch error:', error);
      console.error('Catch info:', errorInfo);
      this.setState({ error, errorInfo });
    } else {
      this.setState({ error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>
            <span role="img" aria-label="icon-image">
              💥
            </span>
            Oops! Something went wrong.
            {/* Reset error, use only in same cases */}
            <button type="button" onClick={() => this.setState({ hasError: false })}>
              Try again?
            </button>
          </h1>
          {/* For development mode show all errors */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state?.error && this.state.error.toString()}
              <br />
              {/* {this.state?.errorInfo} */}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
