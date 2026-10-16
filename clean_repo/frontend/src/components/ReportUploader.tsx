import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Sparkles, Shield, Loader2 } from 'lucide-react';
import { SAMPLE_REPORTS } from '../data/sampleReports';
import { MedicalReport } from '../types/medical';

interface ReportUploaderProps {
  onReportLoaded: (report: MedicalReport) => void;
  onFileUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

export const ReportUploader: React.FC<ReportUploaderProps> = ({
  onReportLoaded,
  onFileUpload,
  isLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await onFileUpload(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await onFileUpload(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-800 shadow-sm">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>AI-Powered Medical Report Interpretation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Turn your confusing lab reports into <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">clear, empowering insights</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
          Upload any blood test, metabolic panel, or pathology report. Vital AI breaks down biomarkers into plain language, spots out-of-range patterns, and arms you with questions for your doctor.
        </p>
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-teal-500 bg-teal-50/60 scale-[1.01]'
            : 'border-slate-300 hover:border-teal-400 bg-white hover:bg-slate-50/50 shadow-sm hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            ) : (
              <UploadCloud className="w-8 h-8 stroke-[1.8]" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">
              {isLoading ? 'Extracting & Interpreting Biomarkers...' : 'Drop your medical report here, or browse'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Supports PDF documents, scanned reports, and photos (PNG, JPG) up to 20MB
            </p>
          </div>

          {!isLoading && (
            <button
              type="button"
              className="mt-2 inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition"
            >
              <FileText className="w-4 h-4" />
              <span>Select File from Device</span>
            </button>
          )}

          <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Private & secure. Processing happens in your active session.</span>
          </div>
        </div>
      </div>

      {/* Demo Reports Quick Launcher */}
      <div className="mt-10 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Don't have a report on hand?</h4>
            <p className="text-xs text-slate-500">Explore one of our pre-loaded real-world clinical examples:</p>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 shrink-0 self-start sm:self-auto">
            1-Click Interactive Demos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {SAMPLE_REPORTS.map((report) => (
            <button
              key={report.id}
              onClick={() => onReportLoaded(report)}
              className="text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/30 transition-all duration-150 group shadow-sm hover:shadow"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                  {report.category.split('/')[0].trim()}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
              </div>
              <h5 className="font-bold text-slate-900 text-sm group-hover:text-teal-900 transition mb-1">
                {report.title}
              </h5>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {report.overallSummary}
              </p>
              <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{report.biomarkers.length} biomarkers parsed</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

