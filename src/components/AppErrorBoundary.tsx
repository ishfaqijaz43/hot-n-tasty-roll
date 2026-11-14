import React from "react";

interface BoundaryState { hasError: boolean }

/** Never leave customers with a completely blank page after a render exception. */
export class AppErrorBoundary extends React.Component<React.PropsWithChildren, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Restaurant website render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-5 text-zinc-900">
        <div className="bg-white max-w-lg w-full rounded-2xl p-8 shadow-sm border border-zinc-200 text-center space-y-4">
          <h1 className="text-2xl font-bold">Hot N Tasty Roll</h1>
          <p className="text-zinc-600">The menu could not be displayed. Please refresh the page, or try again shortly.</p>
          <button className="bg-red-600 text-white px-5 py-3 rounded-xl font-semibold" onClick={() => window.location.reload()}>
            Reload website
          </button>
        </div>
      </main>
    );
  }
}
