import { Component, type ReactNode } from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, textAlign: "center" }}>
          <h1 style={{ color: "#DC2626" }}>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#FF5F00",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
