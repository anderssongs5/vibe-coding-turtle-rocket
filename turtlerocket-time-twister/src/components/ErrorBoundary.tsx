import React, { Component } from 'react';

interface State { hasError: boolean }

export class ErrorBoundary extends Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: '16px', color: '#c00' }}>
          Something went wrong. Please refresh and try again.
        </div>
      );
    }
    return this.props.children;
  }
}
