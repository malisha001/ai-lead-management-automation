import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
      <AlertTriangle className="w-8 h-8 text-red-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-200 mb-2">Failed to load</h3>
    <p className="text-slate-500 text-sm max-w-sm">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-6 btn-ghost flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
