import React, { useState } from 'react';
import { DoctorQuestion } from '../types/medical';
import { Stethoscope, CheckSquare, Square, Copy, Check, Plus, Printer, AlertCircle } from 'lucide-react';

interface DoctorQuestionsProps {
  questions: DoctorQuestion[];
  onToggleQuestion: (id: string) => void;
  onAddCustomQuestion: (question: string, category: string) => void;
}

export const DoctorQuestions: React.FC<DoctorQuestionsProps> = ({
  questions,
  onToggleQuestion,
  onAddCustomQuestion,
}) => {
  const [copied, setCopied] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('Personal Question');
  const [isAdding, setIsAdding] = useState(false);

  const handleCopy = () => {
    const textToCopy = questions
      .map(
        (q, idx) =>
          `${idx + 1}. [${q.priority.toUpperCase()}] ${q.question}\n   Context: ${q.context}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(
      `--- Vital AI: Consultation Prep Questions ---\n\n${textToCopy}\n\n*Prepared for discussion with primary care physician.*`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    onAddCustomQuestion(newQuestionText.trim(), newQuestionCategory);
    setNewQuestionText('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <Stethoscope className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Doctor Consultation Prep</h3>
            <p className="text-xs text-slate-500">
              Targeted, clinically grounded questions tailored specifically to your results
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Print List</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-teal-900">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <span>
          <strong>Pro-tip for your visit:</strong> Doctors appreciate focused questions. Bring this checklist on your phone or print it out. Check off questions as you discuss them in your consultation.
        </span>
      </div>

      {/* Question List */}
      <div className="space-y-3">
        {questions.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No questions added yet.</p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              onClick={() => onToggleQuestion(q.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                q.checked
                  ? 'bg-slate-50/80 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-teal-400 shadow-sm'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-teal-600 shrink-0"
                aria-label={q.checked ? "Unmark question" : "Mark question"}
              >
                {q.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 hover:text-teal-600" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      q.priority === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : q.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {q.priority} priority
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">{q.category}</span>
                </div>

                <p className={`text-sm font-semibold text-slate-900 ${q.checked ? 'line-through text-slate-400' : ''}`}>
                  {q.question}
                </p>

                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-600">Why this matters: </strong>
                  {q.context}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Custom Question Accordion */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-700 hover:text-teal-900 transition pt-1"
        >
          <Plus className="w-4 h-4 text-teal-600" />
          <span>Add your own personalized question</span>
        </button>
      ) : (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-800">Add Custom Question</h4>
          <input
            type="text"
            placeholder="e.g. Could my sleep apnea or work stress be affecting my cholesterol?"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <select
              value={newQuestionCategory}
              onChange={(e) => setNewQuestionCategory(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-700"
            >
              <option value="Personal Question">Category: Personal Question</option>
              <option value="Medication">Category: Medication</option>
              <option value="Diet & Lifestyle">Category: Diet & Lifestyle</option>
              <option value="Follow-Up Diagnostics">Category: Follow-Up Diagnostics</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newQuestionText.trim()}
                className="text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg disabled:opacity-50 transition"
              >
                Add Question
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

