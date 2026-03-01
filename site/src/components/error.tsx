import React, { Component, ErrorInfo, ReactNode } from "react"

interface Props {
  children?: ReactNode
  // Optional custom fallback UI
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  // 1. Update state so the next render shows the fallback UI
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  // 2. Log the error to your analytics or console
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
