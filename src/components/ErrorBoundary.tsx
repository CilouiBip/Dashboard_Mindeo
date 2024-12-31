import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private isAirtableError(error: Error): boolean {
    return error.message.includes('Airtable');
  }

  private renderAirtableError() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Airtable Configuration Required
          </h2>
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-700">Please set up your Airtable configuration to continue.</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Setup Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in the project root</li>
              <li>Add your Airtable API key:
                <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                  VITE_AIRTABLE_API_KEY=your_api_key
                </pre>
              </li>
              <li>Add your Base ID:
                <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                  VITE_AIRTABLE_BASE_ID=your_base_id
                </pre>
              </li>
              <li>Restart the development server</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can find your API key in your Airtable account settings and the Base ID in your base URL.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  private renderGenericError() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-700">{this.state.error?.message}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  public render() {
    if (this.state.hasError) {
      return this.isAirtableError(this.state.error!) 
        ? this.renderAirtableError() 
        : this.renderGenericError();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;