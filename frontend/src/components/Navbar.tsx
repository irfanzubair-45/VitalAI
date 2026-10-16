import React from 'react';
import { Activity, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

interface NavbarProps {
  onOpenPrivacy: () => void;
  onOpenGlossary: () => void;
  activeReportTitle?: string;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPrivacy, onOpenGlossary, activeReportTitle, onReset }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">Vital<span className="text-teal-600">AI</span></span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                Medical Copilot
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Plain-English Medical Report Understanding</p>
          </div>
        </div>

        {/* Center: Active Report Badge */}
        {activeReportTitle && (
          <div className="hidden md:flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 max-w-sm truncate">
            <FileText className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate">{activeReportTitle}</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenGlossary}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 transition"
            title="Medical Terminology Dictionary"
          >
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Medical Dictionary</span>
          </button>

          <button
            onClick={onOpenPrivacy}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 transition"
            title="Privacy & Data Control"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Privacy & Guardrails</span>
          </button>
        </div>
      </div>
    </header>
  );
};

