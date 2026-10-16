import React, { useState } from 'react';
import { MedicalReport } from '../types/medical';
import { BiomarkerTable } from './BiomarkerTable';
import { DoctorQuestions } from './DoctorQuestions';
import { ReportChat } from './ReportChat';
import { ArrowLeft, Calendar, Building2, User, Activity, Stethoscope, MessageSquare, AlertCircle } from 'lucide-react';

interface ReportDashboardProps {
  report: MedicalReport;
  onBack: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({ report, onBack }) => {
  const [activeTab, setActiveTab] = useState<'biomarkers' | 'doctor' | 'chat'>('biomarkers');
  const [questions, setQuestions] = useState(report.doctorQuestions || []);

  const handleToggleQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, checked: !q.checked } : q))
    );
  };

  const handleAddQuestionFromBiomarker = (questionText: string, context: string) => {
    const newQ = {
      id: `q-${Date.now()}`,
      question: questionText,
      context,
      category: 'Biomarker Follow-Up',
      priority: 'high' as const,
      checked: false,
    };
    setQuestions((prev) => [newQ, ...prev]);
  };

  const handleAddCustomQuestion = (questionText: string, category: string) => {
    const newQ = {
      id: `q-${Date.now()}`,
      question: questionText,
      context: 'Patient personal inquiry added for doctor discussion.',
      category,
      priority: 'medium' as const,
      checked: false,
    };
    setQuestions((prev) => [newQ, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button & Report Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Upload or Select Another Report</span>
          </button>

          <div className="flex items-center space-x-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {report.title}
            </h2>
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            {report.patientName && (
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{report.patientName}</span>
              </span>
            )}
            {report.labName && (
              <span className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{report.labName}</span>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{report.reportDate}</span>
            </span>
          </div>
        </div>

        {/* Right Actions: Status Badge and Print Summary */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm transition"
            title="Print or Save PDF Summary for Doctor"
          >
            <span>Print Doctor Summary</span>
          </button>

          {report.urgencyLevel === 'follow_up' && (
            <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200/90 text-amber-900 px-3.5 py-2 rounded-xl text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse" />
              <span>Routine Follow-Up Advised</span>
            </div>
          )}
          {report.urgencyLevel === 'urgent' && (
            <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-300 text-rose-900 px-3.5 py-2 rounded-xl text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-ping" />
              <span>Prompt Clinical Review Needed</span>
            </div>
          )}
          {report.urgencyLevel === 'routine' && (
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>General Wellness / Stable</span>
            </div>
          )}
        </div>
      </div>

      {/* Health Summary Evaluation Box */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-teal-800/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              AI Health Report Summary Evaluation
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Evaluated against standard clinical reference intervals
          </span>
        </div>

        {/* Narrative Summary */}
        <p className="text-sm sm:text-base leading-relaxed text-slate-100 font-normal">
          {report.overallSummary}
        </p>

        {/* Evaluation Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Out of Range Attention Areas */}
          <div className="bg-slate-800/70 rounded-xl p-3.5 border border-amber-500/30">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Key Areas for Doctor Discussion:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {report.biomarkers.filter(b => b.status !== 'normal').length > 0 ? (
                report.biomarkers
                  .filter(b => b.status !== 'normal')
                  .map(b => (
                    <span
                      key={b.id}
                      className="text-[11px] font-medium bg-amber-950/60 text-amber-200 border border-amber-500/40 px-2 py-0.5 rounded-md"
                    >
                      {b.name}: <strong>{b.value} {b.unit}</strong> ({b.status.toUpperCase()})
                    </span>
                  ))
              ) : (
                <span className="text-xs text-slate-400">All evaluated biomarkers fall within standard reference intervals.</span>
              )}
            </div>
          </div>

          {/* Reassuring Normal Markers */}
          <div className="bg-slate-800/70 rounded-xl p-3.5 border border-emerald-500/30">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Reassuring Optimal Baseline:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {report.biomarkers
                .filter(b => b.status === 'normal')
                .slice(0, 4)
                .map(b => (
                  <span
                    key={b.id}
                    className="text-[11px] font-medium bg-emerald-950/60 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded-md"
                  >
                    ✓ {b.name} ({b.value} {b.unit})
                  </span>
                ))}
              {report.biomarkers.filter(b => b.status === 'normal').length > 4 && (
                <span className="text-[11px] text-slate-400 self-center">
                  +{report.biomarkers.filter(b => b.status === 'normal').length - 4} more normal
                </span>
              )}
            </div>
          </div>
        </div>

        {report.urgencyReason && (
          <div className="pt-2 flex items-start space-x-2 text-xs text-amber-200/90">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span><strong>Clinical Follow-up Reason: </strong>{report.urgencyReason}</span>
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('biomarkers')}
            className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'biomarkers'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Biomarkers & Results ({report.biomarkers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'doctor'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Consult Prep ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'chat'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Questions (Copilot)</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'biomarkers' && (
          <BiomarkerTable
            biomarkers={report.biomarkers}
            onAddQuestion={handleAddQuestionFromBiomarker}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorQuestions
            questions={questions}
            onToggleQuestion={handleToggleQuestion}
            onAddCustomQuestion={handleAddCustomQuestion}
          />
        )}

        {activeTab === 'chat' && <ReportChat report={report} />}
      </div>
    </div>
  );
};

