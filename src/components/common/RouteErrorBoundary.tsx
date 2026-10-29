import * as React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

export const RouteErrorBoundary: React.FC = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = React.useState(false);

  // Extract message
  const errorMessage = error?.message || error?.statusText || String(error || "Unknown Error");
  const errorStack = error?.stack;

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--surface-page)] px-6 py-12 font-[family-name:var(--font-sans)]">
      <div className="relative w-full max-w-xl rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-8 shadow-[0_20px_50px_rgba(0,49,50,0.08)]">
        {/* Glow effect */}
        <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-red-500/10 blur-[60px]" />
        <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-amber-500/10 blur-[60px]" />

        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6 border border-red-500/20">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <Typography
            variant="h2"
            className="font-[family-name:var(--font-heading)] font-bold text-[color:var(--text-heading)] mb-2 !text-2xl"
          >
            Application Error
          </Typography>

          <p className="text-sm text-[color:var(--text-secondary)] mb-8 max-w-md">
            An unexpected error occurred while loading this section of the application. This could be due to a network interruption or temporary build cache issue.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mb-8">
            <Button
              variant="primary"
              onClick={handleReload}
              leftIcon={<RefreshCw className="h-4 w-4 animate-spin-hover" />}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            >
              Reload Page
            </Button>
            <Button
              variant="secondary"
              onClick={handleGoHome}
              leftIcon={<Home className="h-4 w-4" />}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-[color:var(--border-soft)] bg-transparent hover:bg-black/5"
            >
              Go to Home
            </Button>
          </div>

          {/* Technical Details Accordion */}
          <div className="w-full text-left border-t border-[color:var(--border-soft)] pt-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[color:var(--text-secondary)] uppercase tracking-wider hover:text-[color:var(--text-primary)] transition-colors"
            >
              <span>Technical Details</span>
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showDetails && (
              <div className="mt-4 overflow-x-auto rounded-lg border border-[color:var(--border-soft)] bg-red-950/5 p-4 text-left font-mono text-[11px] leading-relaxed text-red-700 max-h-60 overflow-y-auto">
                <div className="font-bold mb-1">{errorMessage}</div>
                {errorStack && <pre className="whitespace-pre-wrap mt-2 opacity-80">{errorStack}</pre>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
