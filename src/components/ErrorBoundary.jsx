import React from 'react';
import { RefreshCw, Home, AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TripReady Auto-Recovery caught error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Check if error is due to a stale dynamic chunk from a fresh deployment
    const isChunkError = 
      error?.name === 'ChunkLoadError' || 
      error?.message?.includes('dynamically imported module') || 
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('Failed to fetch') ||
      error?.message?.includes('Load failed');

    if (isChunkError) {
      const lastReload = sessionStorage.getItem('last_chunk_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
        sessionStorage.setItem('last_chunk_reload', now.toString());
        // Bypass disk cache to fetch fresh index.html
        const cleanUrl = window.location.href.split('?')[0];
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('v', now.toString());
        window.location.href = `${cleanUrl}?${searchParams.toString()}`;
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem('last_chunk_reload');
    sessionStorage.removeItem('chunk_auto_reload');
    // Hard cache-busting navigation forces fresh HTML from CDN
    const cleanUrl = window.location.href.split('?')[0];
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('v', Date.now().toString());
    window.location.href = `${cleanUrl}?${searchParams.toString()}`;
  };

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-white dark:bg-[#0A1224] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fade-in">
            {/* Warning Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                Oops! Refreshing View...
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                We detected a temporary network hiccup or new version update. Your session is safe and auto-recovering now.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>
              <button
                onClick={this.handleTryAgain}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 cursor-pointer transition-all active:scale-95"
              >
                <Home className="w-4 h-4" /> Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
