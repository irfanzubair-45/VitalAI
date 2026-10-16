import React, { useState } from 'react';
import { Biomarker, BiomarkerStatus } from '../types/medical';
import { ChevronDown, ChevronUp, HelpCircle, PlusCircle, Check, AlertTriangle, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface BiomarkerCardProps {
  biomarker: Biomarker;
  onAddQuestion?: (questionText: string, context: string) => void;
}

export const BiomarkerCard: React.FC<BiomarkerCardProps> = ({ biomarker, onAddQuestion }) => {
  const [expanded, setExpanded] = useState(false);
  const [addedQuestion, setAddedQuestion] = useState(false);

  const getStatusBadge = (status: BiomarkerStatus) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Normal</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
            <span>Elevated</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-300">
            <ArrowDownRight className="w-3.5 h-3.5 text-sky-600" />
            <span>Low</span>
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Critical Attention</span>
          </span>
        );
    }
  };

  // Calculate visual gauge position if numeric
  const calculateGaugePosition = () => {
    if (
      typeof biomarker.numericValue === 'number' &&
      typeof biomarker.referenceRange.min === 'number' &&
      typeof biomarker.referenceRange.max === 'number'
    ) {
      const min = biomarker.referenceRange.min;
      const max = biomarker.referenceRange.max;
      const val = biomarker.numericValue;
      const range = max - min;
      if (range <= 0) return 50;

      // Calculate percentage with padding for out of bounds
      const normalized = ((val - min) / range) * 60 + 20; // 20% to 80% represents the normal range
      return Math.min(Math.max(normalized, 5), 95);
    }
    return null;
  };

  const gaugePos = calculateGaugePosition();

  const handleAddQuestion = () => {
    if (onAddQuestion && biomarker.recommendedQuestions && biomarker.recommendedQuestions.length > 0) {
      onAddQuestion(
        biomarker.recommendedQuestions[0],
        `Regarding ${biomarker.name} result (${biomarker.value} ${biomarker.unit})`
      );
      setAddedQuestion(true);
      setTimeout(() => setAddedQuestion(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white ${
        biomarker.status === 'normal'
          ? 'border-slate-200 hover:border-slate-300 shadow-sm'
          : biomarker.status === 'critical'
          ? 'border-rose-300 shadow-md ring-1 ring-rose-200'
          : 'border-amber-200/80 hover:border-amber-300 shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header: Name and Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
              {biomarker.category}
            </span>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {biomarker.name}
            </h4>
          </div>
          <div className="shrink-0">{getStatusBadge(biomarker.status)}</div>
        </div>

        {/* Observed Value & Reference Range */}
        <div className="flex items-baseline justify-between bg-slate-50/80 p-3 rounded-xl border border-slate-100 mb-3.5">
          <div>
            <span className="text-xs text-slate-500 block">Your Result</span>
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-2xl font-extrabold tracking-tight ${
                biomarker.status === 'normal' ? 'text-slate-900' : biomarker.status === 'high' ? 'text-amber-700' : biomarker.status === 'low' ? 'text-sky-700' : 'text-rose-700'
              }`}>
                {biomarker.value}
              </span>
              <span className="text-xs font-semibold text-slate-500">{biomarker.unit}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Standard Range</span>
            <span className="text-xs font-bold text-slate-700 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
              {biomarker.referenceRange.text}
            </span>
          </div>
        </div>

        {/* Visual Range Indicator Bar (if numeric) */}
        {gaugePos !== null && (
          <div className="mb-4 px-1">
            <div className="relative h-2 rounded-full bg-slate-200 overflow-visible flex">
              {/* Normal Zone in the middle (20% to 80%) */}
              <div className="absolute left-[20%] right-[20%] top-0 bottom-0 bg-emerald-200 rounded-full" />
              {/* Pointer indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 z-10"
                style={{ left: `${gaugePos}%` }}
              >
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
                  biomarker.status === 'normal' ? 'bg-emerald-600' : biomarker.status === 'high' ? 'bg-amber-600' : biomarker.status === 'low' ? 'bg-sky-600' : 'bg-rose-600'
                }`} />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Low</span>
              <span className="text-emerald-700 font-medium">Optimal Window</span>
              <span>High</span>
            </div>
          </div>
        )}

        {/* Plain-English Explanation */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
          {biomarker.simpleExplanation}
        </p>

        {/* Expandable Details Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-1 text-xs font-semibold text-teal-600 hover:text-teal-800 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{expanded ? 'Less context' : 'Clinical context & reasons'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {biomarker.recommendedQuestions && biomarker.recommendedQuestions.length > 0 && onAddQuestion && (
            <button
              onClick={handleAddQuestion}
              className={`inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-lg transition ${
                addedQuestion
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Add question to consultation prep list"
            >
              {addedQuestion ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Ask Doctor</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Collapsible Clinical Context & Reasons */}
        {expanded && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-3 text-xs animate-fadeIn">
            <div>
              <strong className="font-semibold text-slate-800 block mb-1">Physician Perspective:</strong>
              <p className="text-slate-600 leading-relaxed">{biomarker.clinicalContext}</p>
            </div>

            {biomarker.potentialReasons && biomarker.potentialReasons.length > 0 && (
              <div>
                <strong className="font-semibold text-slate-800 block mb-1">Common Factors That Influence This:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {biomarker.potentialReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

