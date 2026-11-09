import { Component, ErrorInfo, PropsWithChildren } from 'react';

import { reportError } from '@/lib/monitoring';

import { ScreenWrapper } from './layout/ScreenWrapper';
import { EmptyState } from './ui/EmptyState';
export class ErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, _info: ErrorInfo) {
    reportError(error, 'render');
  }
  render() {
    return this.state.failed ? (
      <ScreenWrapper>
        <EmptyState
          title="We hit a bump"
          message="Please try loading the screen again."
          action="Try again"
          onAction={() => this.setState({ failed: false })}
        />
      </ScreenWrapper>
    ) : (
      this.props.children
    );
  }
}
