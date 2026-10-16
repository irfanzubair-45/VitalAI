import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-x-4">
        <div className="flex items-center space-x-2.5 text-xs text-amber-900 leading-tight">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-950">Educational Tool Only:</strong> Vital AI assists patients in understanding clinical laboratory data and preparing for consultations. It is <span className="underline decoration-amber-400 font-medium">not diagnostic medical advice</span>. Always review results with your licensed healthcare provider.
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="hidden lg:flex items-center space-x-1.5 bg-red-100/80 text-red-800 text-[11px] font-medium px-2.5 py-1 rounded-full border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Acute symptoms? Call 911 immediately.</span>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="text-amber-700 hover:text-amber-950 p-1 rounded-md hover:bg-amber-100/60 transition"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

